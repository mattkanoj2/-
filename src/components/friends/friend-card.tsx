'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatTimeAgo, getStatusDisplay } from '@/lib/utils'
import type { Friend } from '@/lib/supabase/types'

interface FriendCardProps {
  friend: Friend
}

export function FriendCard({ friend }: FriendCardProps) {
  const status = friend.current_status?.status || 'offline'
  const statusDisplay = getStatusDisplay(status)
  
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
            <span className="text-lg">{statusDisplay.emoji}</span>
            <span className="text-xs font-medium" style={{ color: `var(--${statusDisplay.color})` }}>
              {statusDisplay.label}
            </span>
          </div>
          
          <p className="text-xs text-muted-foreground">
            {friend.current_status 
              ? formatTimeAgo(friend.current_status.updated_at)
              : formatTimeAgo(friend.last_seen_at)
            }
          </p>
        </div>
      </div>
    </div>
  )
}