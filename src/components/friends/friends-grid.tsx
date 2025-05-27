'use client'

import { UserPlus, Wifi, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FriendCard } from './friend-card'
import { AddFriendModal } from './add-friend-modal'
import { useFriendsStore } from '@/store/friends'
import { useRealtimeStatus } from '@/hooks/useRealtimeStatus'
import type { Friend } from '@/lib/supabase/types'

interface FriendsGridProps {
  friends?: Friend[] // Make optional since we can get from store
}

export function FriendsGrid({ friends: propFriends }: FriendsGridProps) {
  const { friends: storeFriends, friendStatuses } = useFriendsStore()
  const friends = propFriends || storeFriends
  const { isConnected, connectionError } = useRealtimeStatus(friends)

  if (friends.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="max-w-md mx-auto">
          <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">友達を追加しよう</h3>
          <p className="text-muted-foreground mb-6">
            メールアドレスで友達を検索して、ヒトコトを共有しましょう
          </p>
          <AddFriendModal>
            <Button>友達を追加</Button>
          </AddFriendModal>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">友達 ({friends.length})</h2>
            <div className="flex items-center gap-1">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-500" title="リアルタイム接続中" />
              ) : (
                <WifiOff className="h-4 w-4 text-gray-400" title="リアルタイム接続なし" />
              )}
            </div>
          </div>
          <AddFriendModal>
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              追加
            </Button>
          </AddFriendModal>
        </div>
        {connectionError && (
          <p className="text-xs text-orange-600 mt-1">{connectionError}</p>
        )}
      </div>
      
      <div className="status-grid">
        {friends.map((friend) => (
          <FriendCard 
            key={friend.id} 
            friend={friend} 
            realtimeStatus={friendStatuses.get(friend.id) || null}
          />
        ))}
      </div>
    </div>
  )
}