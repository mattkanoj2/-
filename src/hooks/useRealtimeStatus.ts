'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth'
import { useFriendsStore } from '@/store/friends'
import { errorHandler } from '@/lib/errors'
import type { UserStatus, Friend } from '@/lib/supabase/types'

interface RealtimeStatusHook {
  isConnected: boolean
  connectionError: string | null
}

export function useRealtimeStatus(friends: Friend[]): RealtimeStatusHook {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const { user } = useAuthStore()
  const { updateFriendStatus, clearFriendStatus, setFriendStatuses } = useFriendsStore()

  useEffect(() => {
    if (!friends.length) return

    const supabase = createClient()
    let statusChannel: any

    const setupRealtimeConnection = async () => {
      try {
        if (!user) {
          throw errorHandler.auth('User not authenticated')
        }

        // Create friends array for subscription
        const friendIds = friends.map(friend => friend.id)

        // Subscribe to status changes for all friends
        statusChannel = supabase
          .channel('friend-statuses')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'statuses',
              filter: `user_id=in.(${friendIds.join(',')})`
            },
            (payload) => {
              console.log('Status change received:', payload)
              
              const status = payload.new as UserStatus
              if (status) {
                updateFriendStatus(status.user_id, status)
              }

              // Handle deletes
              if (payload.eventType === 'DELETE' && payload.old) {
                const oldStatus = payload.old as UserStatus
                clearFriendStatus(oldStatus.user_id)
              }
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              setIsConnected(true)
              setConnectionError(null)
              console.log('Realtime connection established')
            } else if (status === 'CHANNEL_ERROR') {
              setIsConnected(false)
              setConnectionError('リアルタイム接続でエラーが発生しました')
              console.error('Realtime connection error')
            } else if (status === 'TIMED_OUT') {
              setIsConnected(false)
              setConnectionError('リアルタイム接続がタイムアウトしました')
              console.error('Realtime connection timed out')
            }
          })

        // Load initial status data for all friends
        const { data: initialStatuses, error } = await supabase
          .from('statuses')
          .select('*')
          .in('user_id', friendIds)
          .gte('expires_at', new Date().toISOString())

        if (error) {
          throw errorHandler.server(error.message, '初期ステータスデータの取得に失敗しました')
        }

        if (initialStatuses) {
          const statusMap = new Map<string, UserStatus>()
          initialStatuses.forEach(status => {
            statusMap.set(status.user_id, status)
          })
          setFriendStatuses(statusMap)
        }

      } catch (error) {
        errorHandler.handle(error, 'useRealtimeStatus.setupConnection')
        setConnectionError('リアルタイム接続の設定に失敗しました')
        setIsConnected(false)
      }
    }

    setupRealtimeConnection()

    // Cleanup function
    return () => {
      if (statusChannel) {
        supabase.removeChannel(statusChannel)
        setIsConnected(false)
      }
    }
  }, [friends])

  return {
    isConnected,
    connectionError
  }
}

// Hook for friend requests realtime updates
export function useRealtimeFriendRequests() {
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    let requestsChannel: any

    const setupConnection = async () => {
      try {
        const user = await authService.getCurrentUser()
        if (!user) return

        requestsChannel = supabase
          .channel('friend-requests')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'friendships',
              filter: `approver_id=eq.${user.id}`
            },
            (payload) => {
              console.log('New friend request:', payload)
              // Handle new friend request notification
              const friendship = payload.new
              if (friendship && friendship.status === 'pending') {
                // You can add toast notification here or update state
              }
            }
          )
          .subscribe((status) => {
            setIsConnected(status === 'SUBSCRIBED')
          })

      } catch (error) {
        errorHandler.handle(error, 'useRealtimeFriendRequests.setupConnection')
      }
    }

    setupConnection()

    return () => {
      if (requestsChannel) {
        supabase.removeChannel(requestsChannel)
        setIsConnected(false)
      }
    }
  }, [])

  return {
    pendingRequests,
    isConnected
  }
}