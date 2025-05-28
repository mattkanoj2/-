'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatTimeAgo, getStatusDisplay } from '@/lib/utils'
import type { Friend, UserStatus } from '@/lib/supabase/types'

interface FriendCardProps {
  friend: Friend
  realtimeStatus?: UserStatus | null
}

export function FriendCard({ friend, realtimeStatus }: FriendCardProps) {
  // Use realtime status if available, otherwise fall back to friend's current status
  const currentStatus = realtimeStatus || friend.current_status
  const status = currentStatus?.status || 'offline'
  const statusDisplay = getStatusDisplay(status)

  // Check if status has expired
  const isExpired = currentStatus?.expires_at 
    ? new Date(currentStatus.expires_at) < new Date()
    : false
  
  const effectiveStatus = isExpired ? 'offline' : status
  const effectiveStatusDisplay = isExpired ? getStatusDisplay('offline') : statusDisplay
  
  return (
    <div className="friend-card group">
      {/* Status indicator ring */}
      <div 
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, rgb(var(--${effectiveStatusDisplay.color}) / 0.5), rgb(var(--${effectiveStatusDisplay.color}) / 0.2))`,
        }}
      />
      
      <div className="relative flex flex-col items-center space-y-4">
        {/* Avatar with status ring */}
        <div className="relative">
          <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
            <AvatarImage src={friend.avatar_url || undefined} alt={friend.name} />
            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-accent text-white">
              {friend.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          {/* Status dot */}
          <div 
            className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-3 border-white shadow-md flex items-center justify-center"
            style={{ backgroundColor: `rgb(var(--${effectiveStatusDisplay.color}))` }}
          >
            <span className="text-xs">{effectiveStatusDisplay.emoji}</span>
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
            {friend.name}
          </h3>
          
          <div className="flex items-center justify-center gap-2">
            <span 
              className="text-sm font-medium px-3 py-1 rounded-full transition-all duration-300"
              style={{ 
                backgroundColor: `rgb(var(--${effectiveStatusDisplay.color}) / 0.1)`,
                color: `rgb(var(--${effectiveStatusDisplay.color}))` 
              }}
            >
              {effectiveStatusDisplay.label}
            </span>
          </div>
          
          <p className="text-xs text-muted-foreground">
            {currentStatus 
              ? formatTimeAgo(currentStatus.updated_at)
              : formatTimeAgo(friend.last_seen_at)
            }
          </p>
        </div>
      </div>
    </div>
  )
}