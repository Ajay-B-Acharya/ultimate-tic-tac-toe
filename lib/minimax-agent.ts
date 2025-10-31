import { MetaBoard } from "./game-engine"

export class MinimaxAgent {
  player: number
  opponent: number
  depth: number
  nodes_evaluated = 0

  constructor(player = 2, depth = 4) {
    this.player = player
    this.opponent = player === 2 ? 1 : 2
    this.depth = depth
  }

  get_best_move(game_state: MetaBoard): [number, number] | null {
    this.nodes_evaluated = 0

    const available_boards = game_state.get_available_boards()
    let best_score = Number.NEGATIVE_INFINITY
    let best_move: [number, number] | null = null

    for (const board_idx of available_boards) {
      const board = game_state.boards[board_idx]
      const available_moves = board.get_available_moves()

      for (const position of available_moves) {
        const game_copy = this.copy_game(game_state)
        game_copy.make_move(board_idx, position, this.player)

        const score = this.minimax(game_copy, this.depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false)

        if (score > best_score) {
          best_score = score
          best_move = [board_idx, position]
        }
      }
    }

    return best_move
  }

  private minimax(game_state: MetaBoard, depth: number, alpha: number, beta: number, is_maximizing: boolean): number {
    this.nodes_evaluated++

    if (game_state.game_winner !== null) {
      if (game_state.game_winner === this.player) {
        return 10 + depth
      } else if (game_state.game_winner === this.opponent) {
        return -10 - depth
      } else {
        return 0
      }
    }

    if (depth === 0) {
      return this.evaluate_position(game_state)
    }

    if (is_maximizing) {
      let max_eval = Number.NEGATIVE_INFINITY
      const available_boards = game_state.get_available_boards()

      for (const board_idx of available_boards) {
        const board = game_state.boards[board_idx]
        for (const position of board.get_available_moves()) {
          const game_copy = this.copy_game(game_state)
          game_copy.make_move(board_idx, position, this.player)

          const eval_score = this.minimax(game_copy, depth - 1, alpha, beta, false)
          max_eval = Math.max(max_eval, eval_score)
          alpha = Math.max(alpha, eval_score)

          if (beta <= alpha) {
            return max_eval
          }
        }
      }

      return max_eval !== Number.NEGATIVE_INFINITY ? max_eval : 0
    } else {
      let min_eval = Number.POSITIVE_INFINITY
      const available_boards = game_state.get_available_boards()

      for (const board_idx of available_boards) {
        const board = game_state.boards[board_idx]
        for (const position of board.get_available_moves()) {
          const game_copy = this.copy_game(game_state)
          game_copy.make_move(board_idx, position, this.opponent)

          const eval_score = this.minimax(game_copy, depth - 1, alpha, beta, true)
          min_eval = Math.min(min_eval, eval_score)
          beta = Math.min(beta, eval_score)

          if (beta <= alpha) {
            return min_eval
          }
        }
      }

      return min_eval !== Number.POSITIVE_INFINITY ? min_eval : 0
    }
  }

  private evaluate_position(game_state: MetaBoard): number {
    let score = 0

    score += this.count_threats(game_state.meta_board, this.player) * 3
    score -= this.count_threats(game_state.meta_board, this.opponent) * 3

    for (let i = 0; i < game_state.boards.length; i++) {
      if (game_state.meta_board[i] === 0) {
        score += this.count_threats(game_state.boards[i].board, this.player)
        score -= this.count_threats(game_state.boards[i].board, this.opponent)
      }
    }

    return score
  }

  private count_threats(board: number[], player: number): number {
    let threats = 0
    const winning_combos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (const combo of winning_combos) {
      const player_count = combo.filter((i) => board[i] === player).length
      const empty_count = combo.filter((i) => board[i] === 0).length

      if (player_count === 2 && empty_count === 1) {
        threats += 10
      } else if (player_count === 1 && empty_count === 2) {
        threats += 1
      }
    }

    return threats
  }

  private copy_game(game_state: MetaBoard): MetaBoard {
    const copy = new MetaBoard()
    copy.boards = game_state.boards.map((board) => {
      const new_board = new (board.constructor as any)()
      new_board.board = [...board.board]
      new_board.winner = board.winner
      return new_board
    })
    copy.meta_board = [...game_state.meta_board]
    copy.game_winner = game_state.game_winner
    copy.next_board = game_state.next_board
    copy.move_history = game_state.move_history.map((m) => ({ ...m }))
    return copy
  }
}
