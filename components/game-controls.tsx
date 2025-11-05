"use client"

interface GameControlsProps {
  onReset: () => void
  onBackToMenu?: () => void
  loading: boolean
}

export default function GameControls({ onReset, onBackToMenu, loading }: GameControlsProps) {
  return (
    <div className="flex justify-center gap-4">
      {onBackToMenu && (
        <button
          onClick={onBackToMenu}
          disabled={loading}
          className="group relative px-8 py-4 holographic-panel text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Menu
          </span>
        </button>
      )}
      <button
        onClick={onReset}
        disabled={loading}
        className="group relative px-8 py-4 holographic-panel text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50"
      >
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset Game
        </span>
      </button>
    </div>
  )
}