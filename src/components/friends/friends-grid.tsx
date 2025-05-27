'use client'

import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FriendCard } from './friend-card'
import { AddFriendModal } from './add-friend-modal'
import type { Friend } from '@/lib/supabase/types'

interface FriendsGridProps {
  friends: Friend[]
  onRefresh?: () => void
}

export function FriendsGrid({ friends, onRefresh }: FriendsGridProps) {
  const [showAddFriend, setShowAddFriend] = useState(false)
  if (friends.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="max-w-md mx-auto">
          <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">友達を追加しよう</h3>
          <p className="text-muted-foreground mb-6">
            メールアドレスで友達を検索して、ヒトコトを共有しましょう
          </p>
          <Button onClick={() => setShowAddFriend(true)}>友達を追加</Button>
          <AddFriendModal 
            open={showAddFriend} 
            onOpenChange={setShowAddFriend}
            onFriendAdded={onRefresh}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">友達 ({friends.length})</h2>
          <Button variant="outline" size="sm" onClick={() => setShowAddFriend(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            追加
          </Button>
        </div>
      </div>
      
      <div className="status-grid">
        {friends.map((friend) => (
          <FriendCard key={friend.id} friend={friend} />
        ))}
      </div>
      
      <AddFriendModal 
        open={showAddFriend} 
        onOpenChange={setShowAddFriend}
        onFriendAdded={onRefresh}
      />
    </div>
  )
}