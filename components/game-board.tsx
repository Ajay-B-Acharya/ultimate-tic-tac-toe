"use client"

import MiniBoard from "./mini-board"

interface GameBoardProps {
  gameState: any
  onMove: (boardIndex: number, position: number) => void
  loading: boolean
}

export default function GameBoard({ gameState, onMove, loading }: GameBoardProps) {
  if (!gameState) return null

  return (
    <div className="bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-purple-500/20 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-3xl"></div>
      <div className="grid grid-cols-3 gap-6 relative z-10">
        {gameState.boards.map((board: any, boardIndex: number) => (
          <MiniBoard
            key={boardIndex}
            boardIndex={boardIndex}
            board={board}
            metaBoardWinner={gameState.meta_board[boardIndex]}
            onMove={onMove}
            loading={loading}
            isActive={gameState.next_board === null || gameState.next_board === boardIndex}
          />
        ))}
      </div>
    </div>
  )
}
