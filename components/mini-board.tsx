"use client"

import { useState } from "react"
import { useSound } from "@/hooks/use-sound"

interface MiniBoardProps {
  boardIndex: number
  board: any
  metaBoardWinner: number
  onMove: (boardIndex: number, position: number) => void
  loading: boolean
  isActive: boolean
}

export default function MiniBoard({ boardIndex, board, metaBoardWinner, onMove, loading, isActive }: MiniBoardProps) {
  const { playMoveSound, playHoverSound } = useSound()
  const [hoveredCell, setHoveredCell] = useState<number | null>(null)

  const getSymbol = (value: number) => {
    if (value === 1) return "X"
    if (value === 2) return "O"
    return ""
  }

  const getWinnerText = (winner: number) => {
    if (winner === 1) return "X"
    if (winner === 2) return "O"
    if (winner === 3) return "Draw"
    return ""
  }

  const isWon = metaBoardWinner !== 0
  const isBoardWon = board.winner !== null

  const handleMove = (position: number) => {
    playMoveSound()
    onMove(boardIndex, position)
  }

  const handleCellHover = (position: number | null) => {
    if (position !== null) {
      playHoverSound()
    }
    setHoveredCell(position)
  }

  return (
    <div
      className={`aspect-square rounded-2xl border-2 p-4 transition-all duration-300 relative overflow-hidden ${
        isWon
          ? "bg-gradient-to-br from-slate-900/30 to-slate-800/30 border-cyan-600/20 opacity-60"
          : isActive
            ? "bg-gradient-to-br from-black/90 via-cyan-900/30 to-black/90 border-cyan-400 ring-2 ring-cyan-400/60"
            : "bg-gradient-to-br from-black/80 to-slate-900/50 border-cyan-600/30 hover:border-cyan-500/50"
      }`}
      style={isActive ? {
        boxShadow: '0 0 40px rgba(0, 217, 255, 0.6), inset 0 0 40px rgba(0, 217, 255, 0.15)',
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 50, 80, 0.4) 50%, rgba(0, 0, 0, 0.9) 100%)'
      } : {}}
    >
      {/* Animated circuit lines overlay */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse" style={{animationDelay: '0.25s'}}></div>
          <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse" style={{animationDelay: '0.75s'}}></div>
        </div>
      )}
      {isWon ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center transform scale-110">
            <div className={`text-5xl font-black mb-2 ${
              metaBoardWinner === 1 ? 'text-cyan-400' :
              metaBoardWinner === 2 ? 'text-amber-500' :
              'text-yellow-400'
            }`} style={
              metaBoardWinner === 1 ? {textShadow: '0 0 20px #00d9ff, 0 0 40px #00d9ff, 0 0 60px #00d9ff'} :
              metaBoardWinner === 2 ? {textShadow: '0 0 20px #f59e0b, 0 0 40px #f59e0b, 0 0 60px #f59e0b'} :
              {textShadow: '0 0 20px #fbbf24, 0 0 40px #fbbf24'}
            }>
              {getWinnerText(metaBoardWinner)}
            </div>
            <div className="text-xs font-semibold text-cyan-300 tracking-wider uppercase" style={{textShadow: '0 0 10px #00d9ff'}}>Winner</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 h-full relative z-10">
          {board.board.map((cell: number, position: number) => (
            <button
              key={position}
              onClick={() => handleMove(position)}
              onMouseEnter={() => handleCellHover(position)}
              onMouseLeave={() => handleCellHover(null)}
              disabled={loading || cell !== 0 || !isActive || isBoardWon}
              className={`rounded-xl text-2xl font-black transition-all duration-200 flex items-center justify-center relative overflow-hidden ${
                cell === 0 
                  ? "bg-gradient-to-br from-black/80 to-slate-900/80 cursor-pointer border border-cyan-600/30" 
                  : "bg-gradient-to-br from-black/90 to-slate-900/90 cursor-default border border-cyan-500/20"
              } disabled:opacity-50`}
              style={cell === 0 && hoveredCell === position ? {
                borderColor: 'rgba(0, 217, 255, 0.8)',
                boxShadow: '0 0 20px rgba(0, 217, 255, 0.6), inset 0 0 20px rgba(0, 217, 255, 0.2)',
                background: 'linear-gradient(135deg, rgba(0, 30, 50, 0.8) 0%, rgba(0, 60, 100, 0.6) 50%, rgba(0, 30, 50, 0.8) 100%)'
              } : cell === 0 ? {
                boxShadow: '0 0 5px rgba(0, 217, 255, 0.2), inset 0 0 10px rgba(0, 0, 0, 0.5)'
              } : {}}
            >
              {/* Electric glow effect on hover */}
              {cell === 0 && hoveredCell === position && (
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-cyan-500/20 animate-pulse"></div>
              )}
              <span className={`relative z-10 ${
                cell === 1 ? "text-cyan-400" : 
                cell === 2 ? "text-amber-500" : ""
              } ${
                cell !== 0 ? "animate-scale-in" : ""
              }`} style={cell === 1 ? {
                textShadow: '0 0 15px #00d9ff, 0 0 30px #00d9ff, 0 0 45px #00d9ff, 0 0 60px #00d9ff'
              } : cell === 2 ? {
                textShadow: '0 0 15px #f59e0b, 0 0 30px #f59e0b, 0 0 45px #f59e0b, 0 0 60px #f59e0b'
              } : {}}>
                {getSymbol(cell)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}