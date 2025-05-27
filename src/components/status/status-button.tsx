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
        "status-button",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        loading && "opacity-50 cursor-not-allowed",
        `focus:ring-${color.replace('status-', '')}-500`
      )}
      style={{
        borderColor: `var(--${color})`,
        backgroundColor: loading ? undefined : `color-mix(in srgb, var(--${color}) 10%, transparent)`,
      }}
    >
      <span className="text-2xl mb-2">{emoji}</span>
      <span className="text-sm font-medium">{label}</span>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
        </div>
      )}
    </button>
  )
}