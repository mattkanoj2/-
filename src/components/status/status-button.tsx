'use client'

import { cn } from '@/lib/utils'

interface StatusButtonProps {
  emoji: string
  label: string
  color: string
  loading?: boolean
  onClick: () => void
}

export function StatusButton({ emoji, label, color, loading, onClick }: StatusButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cn(
        "status-button group",
        "focus:outline-none focus:ring-4 focus:ring-offset-4",
        loading && "opacity-50 cursor-not-allowed",
        `focus:ring-${color.replace('status-', '')}-500/30`
      )}
      style={{
        borderColor: `rgb(var(--${color}) / 0.3)`,
        backgroundColor: loading ? undefined : `rgb(var(--${color}) / 0.05)`,
      }}
    >
      {/* Gradient background on hover */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, rgb(var(--${color})), transparent)`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-3">
        <span className="text-4xl sm:text-5xl transition-transform duration-300 group-hover:scale-110">
          {emoji}
        </span>
        <span 
          className="text-sm sm:text-base font-semibold transition-colors duration-300"
          style={{ color: `rgb(var(--${color}))` }}
        >
          {label}
        </span>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl">
          <div className="relative">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-gray-200"></div>
            <div 
              className="absolute inset-0 animate-spin rounded-full h-8 w-8 border-3 border-t-transparent"
              style={{ borderColor: `rgb(var(--${color}))` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Pulse effect on hover */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          boxShadow: `0 0 20px rgb(var(--${color}) / 0.3)`,
        }}
      />
    </button>
  )
}