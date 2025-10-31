from typing import Optional, Tuple
from copy import deepcopy


class MinimaxAgent:
    def __init__(self, player: int = 2, depth: int = 4):
        self.player = player
        self.opponent = 3 - player  # 1 if player is 2, 2 if player is 1
        self.depth = depth
        self.nodes_evaluated = 0

    def get_best_move(self, game_state) -> Optional[Tuple[int, int]]:
        self.nodes_evaluated = 0

        available_boards = game_state.get_available_boards()
        best_score = float('-inf')
        best_move: Optional[Tuple[int, int]] = None

        for board_idx in available_boards:
            board = game_state.boards[board_idx]
            available_moves = board.get_available_moves()

            for position in available_moves:
                game_copy = self._copy_game(game_state)
                game_copy.make_move(board_idx, position, self.player)

                score = self.minimax(
                    game_copy, 
                    self.depth - 1, 
                    float('-inf'), 
                    float('inf'), 
                    False
                )

                if score > best_score:
                    best_score = score
                    best_move = (board_idx, position)

        return best_move

    def minimax(
        self, 
        game_state, 
        depth: int, 
        alpha: float, 
        beta: float, 
        is_maximizing: bool
    ) -> float:
        self.nodes_evaluated += 1

        if game_state.game_winner is not None:
            if game_state.game_winner == self.player:
                return 10 + depth
            elif game_state.game_winner == self.opponent:
                return -10 - depth
            else:
                return 0

        if depth == 0:
            return self._evaluate_position(game_state)

        if is_maximizing:
            max_eval = float('-inf')
            available_boards = game_state.get_available_boards()

            for board_idx in available_boards:
                board = game_state.boards[board_idx]
                for position in board.get_available_moves():
                    game_copy = self._copy_game(game_state)
                    game_copy.make_move(board_idx, position, self.player)

                    eval_score = self.minimax(game_copy, depth - 1, alpha, beta, False)
                    max_eval = max(max_eval, eval_score)
                    alpha = max(alpha, eval_score)

                    if beta <= alpha:
                        return max_eval

            return max_eval if max_eval != float('-inf') else 0
        else:
            min_eval = float('inf')
            available_boards = game_state.get_available_boards()

            for board_idx in available_boards:
                board = game_state.boards[board_idx]
                for position in board.get_available_moves():
                    game_copy = self._copy_game(game_state)
                    game_copy.make_move(board_idx, position, self.opponent)

                    eval_score = self.minimax(game_copy, depth - 1, alpha, beta, True)
                    min_eval = min(min_eval, eval_score)
                    beta = min(beta, eval_score)

                    if beta <= alpha:
                        return min_eval

            return min_eval if min_eval != float('inf') else 0

    def _evaluate_position(self, game_state) -> float:
        score = 0

        score += self._count_threats(game_state.meta_board, self.player) * 3
        score -= self._count_threats(game_state.meta_board, self.opponent) * 3

        for i in range(len(game_state.boards)):
            if game_state.meta_board[i] == 0:
                board = game_state.boards[i]
                score += self._count_threats(board.board, self.player)
                score -= self._count_threats(board.board, self.opponent)

        return score

    def _count_threats(self, board: list, player: int) -> int:
        threats = 0
        winning_combos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]

        for combo in winning_combos:
            player_count = sum(1 for i in combo if board[i] == player)
            empty_count = sum(1 for i in combo if board[i] == 0)

            if player_count == 2 and empty_count == 1:
                threats += 10
            elif player_count == 1 and empty_count == 2:
                threats += 1

        return threats

    def _copy_game(self, game_state) -> 'MetaBoard':
        """Deep copy the game state for AI calculations"""
        from game_engine import MetaBoard, MiniBoard
        
        copy = MetaBoard()
        copy.boards = []
        for board in game_state.boards:
            new_board = MiniBoard()
            new_board.board = board.board.copy()
            new_board.winner = board.winner
            copy.boards.append(new_board)
        copy.meta_board = game_state.meta_board.copy()
        copy.game_winner = game_state.game_winner
        copy.next_board = game_state.next_board
        copy.move_history = deepcopy(game_state.move_history)
        return copy

