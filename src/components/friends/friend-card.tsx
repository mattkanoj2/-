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
    <div className="friend-card">
      <div className="flex flex-col items-center space-y-3">
        <Avatar className="h-16 w-16">
          <AvatarImage src={friend.avatar_url || undefined} alt={friend.name} />
          <AvatarFallback>
            {friend.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        
        <div className="text-center space-y-1">
          <h3 className="font-medium text-sm">{friend.name}</h3>
          
          <div className="flex items-center justify-center space-x-1">
            <span className="text-lg">{effectiveStatusDisplay.emoji}</span>
            <span className="text-xs font-medium" style={{ color: `var(--${effectiveStatusDisplay.color})` }}>
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