from typing import List, Tuple, Optional, Dict, Any
from dataclasses import dataclass, field
from copy import deepcopy


@dataclass
class MiniboardState:
    board: List[int]
    winner: Optional[int]
    available_moves: List[int]


@dataclass
class GameState:
    boards: List[MiniboardState]
    meta_board: List[int]
    game_winner: Optional[int]
    next_board: Optional[int]
    available_boards: List[int]
    move_history: List[Dict[str, int]] = field(default_factory=list)


class MiniBoard:
    def __init__(self):
        self.board: List[int] = [0] * 9
        self.winner: Optional[int] = None

    def make_move(self, position: int, player: int) -> bool:
        if self.board[position] != 0 or self.winner is not None:
            return False
        self.board[position] = player
        self._check_winner()
        return True

    def _check_winner(self) -> None:
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
            a, b, c = combo
            if self.board[a] != 0 and self.board[a] == self.board[b] == self.board[c]:
                self.winner = self.board[a]
                return

        if 0 not in self.board:
            self.winner = 3  # Draw

    def is_full(self) -> bool:
        return 0 not in self.board

    def get_available_moves(self) -> List[int]:
        return [i for i, val in enumerate(self.board) if val == 0]

    def get_state(self) -> MiniboardState:
        return MiniboardState(
            board=self.board.copy(),
            winner=self.winner,
            available_moves=self.get_available_moves(),
        )


class MetaBoard:
    def __init__(self):
        self.boards: List[MiniBoard] = [MiniBoard() for _ in range(9)]
        self.meta_board: List[int] = [0] * 9
        self.game_winner: Optional[int] = None
        self.next_board: Optional[int] = None
        self.move_history: List[Dict[str, int]] = []

    def make_move(self, board_index: int, position: int, player: int) -> Tuple[bool, str]:
        if self.game_winner is not None:
            return False, "Game is already over"

        if self.next_board is not None and board_index != self.next_board:
            return False, f"Must play in board {self.next_board}"

        if self.meta_board[board_index] != 0:
            return False, "This board is already won"

        if not self.boards[board_index].make_move(position, player):
            return False, "Invalid move on this board"

        if self.boards[board_index].winner is not None:
            self.meta_board[board_index] = self.boards[board_index].winner
            self._check_game_winner()

        self.next_board = position
        if self.meta_board[position] != 0:
            self.next_board = None

        self.move_history.append({
            "board": board_index,
            "position": position,
            "player": player,
        })

        return True, "Move successful"

    def _check_game_winner(self) -> None:
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
            a, b, c = combo
            if (self.meta_board[a] != 0 and 
                self.meta_board[a] == self.meta_board[b] == self.meta_board[c]):
                self.game_winner = self.meta_board[a]
                return

        if 0 not in self.meta_board:
            self.game_winner = 3  # Draw

    def get_available_boards(self) -> List[int]:
        if self.next_board is not None:
            if self.meta_board[self.next_board] == 0:
                return [self.next_board]
            else:
                return [i for i, val in enumerate(self.meta_board) if val == 0]
        return [i for i, val in enumerate(self.meta_board) if val == 0]

    def get_state(self) -> GameState:
        return GameState(
            boards=[board.get_state() for board in self.boards],
            meta_board=self.meta_board.copy(),
            game_winner=self.game_winner,
            next_board=self.next_board,
            available_boards=self.get_available_boards(),
            move_history=self.move_history.copy(),
        )

    def reset(self) -> None:
        self.boards = [MiniBoard() for _ in range(9)]
        self.meta_board = [0] * 9
        self.game_winner = None
        self.next_board = None
        self.move_history = []

