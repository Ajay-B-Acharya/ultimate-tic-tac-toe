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
    <div className="holographic-panel rounded-3xl p-8 relative" style={{boxShadow: '0 0 50px rgba(0, 217, 255, 0.4), inset 0 0 50px rgba(0, 217, 255, 0.1)'}}>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-cyan-500/5 rounded-3xl pointer-events-none"></div>
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