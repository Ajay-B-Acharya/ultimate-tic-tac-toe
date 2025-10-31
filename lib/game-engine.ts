export interface MiniboardState {
  board: number[]
  winner: number | null
  available_moves: number[]
}

export interface GameState {
  boards: MiniboardState[]
  meta_board: number[]
  game_winner: number | null
  next_board: number | null
  available_boards: number[]
  move_history: Array<{ board: number; position: number; player: number }>
}

export class MiniBoard {
  board: number[] = Array(9).fill(0)
  winner: number | null = null

  make_move(position: number, player: number): boolean {
    if (this.board[position] !== 0 || this.winner !== null) {
      return false
    }
    this.board[position] = player
    this.check_winner()
    return true
  }

  private check_winner(): void {
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
      const [a, b, c] = combo
      if (this.board[a] !== 0 && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        this.winner = this.board[a]
        return
      }
    }

    if (!this.board.includes(0)) {
      this.winner = 3 // Draw
    }
  }

  is_full(): boolean {
    return !this.board.includes(0)
  }

  get_available_moves(): number[] {
    return this.board.map((val, idx) => (val === 0 ? idx : -1)).filter((idx) => idx !== -1)
  }

  get_state(): MiniboardState {
    return {
      board: this.board,
      winner: this.winner,
      available_moves: this.get_available_moves(),
    }
  }
}

export class MetaBoard {
  boards: MiniBoard[] = Array(9)
    .fill(null)
    .map(() => new MiniBoard())
  meta_board: number[] = Array(9).fill(0)
  game_winner: number | null = null
  next_board: number | null = null
  move_history: Array<{ board: number; position: number; player: number }> = []

  make_move(board_index: number, position: number, player: number): [boolean, string] {
    if (this.game_winner !== null) {
      return [false, "Game is already over"]
    }

    if (this.next_board !== null && board_index !== this.next_board) {
      return [false, `Must play in board ${this.next_board}`]
    }

    if (this.meta_board[board_index] !== 0) {
      return [false, "This board is already won"]
    }

    if (!this.boards[board_index].make_move(position, player)) {
      return [false, "Invalid move on this board"]
    }

    if (this.boards[board_index].winner !== null) {
      this.meta_board[board_index] = this.boards[board_index].winner!
      this.check_game_winner()
    }

    this.next_board = position
    if (this.meta_board[position] !== 0) {
      this.next_board = null
    }

    this.move_history.push({ board: board_index, position, player })

    return [true, "Move successful"]
  }

  private check_game_winner(): void {
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
      const [a, b, c] = combo
      if (
        this.meta_board[a] !== 0 &&
        this.meta_board[a] === this.meta_board[b] &&
        this.meta_board[a] === this.meta_board[c]
      ) {
        this.game_winner = this.meta_board[a]
        return
      }
    }

    if (!this.meta_board.includes(0)) {
      this.game_winner = 3 // Draw
    }
  }

  get_available_boards(): number[] {
    if (this.next_board !== null) {
      if (this.meta_board[this.next_board] === 0) {
        return [this.next_board]
      } else {
        return this.meta_board.map((val, idx) => (val === 0 ? idx : -1)).filter((idx) => idx !== -1)
      }
    }
    return this.meta_board.map((val, idx) => (val === 0 ? idx : -1)).filter((idx) => idx !== -1)
  }

  get_state(): GameState {
    return {
      boards: this.boards.map((board) => board.get_state()),
      meta_board: this.meta_board,
      game_winner: this.game_winner,
      next_board: this.next_board,
      available_boards: this.get_available_boards(),
      move_history: this.move_history,
    }
  }

  reset(): void {
    this.boards = Array(9)
      .fill(null)
      .map(() => new MiniBoard())
    this.meta_board = Array(9).fill(0)
    this.game_winner = null
    this.next_board = null
    this.move_history = []
  }
}
