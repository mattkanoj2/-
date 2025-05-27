import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { FriendRequest } from '@/lib/supabase/types'

interface NotificationState {
  friendRequests: FriendRequest[]
  unreadCount: number
  isLoading: boolean
  
  // Actions
  setFriendRequests: (requests: FriendRequest[]) => void
  addFriendRequest: (request: FriendRequest) => void
  removeFriendRequest: (requestId: string) => void
  markAsRead: (requestId: string) => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set, get) => ({
      friendRequests: [],
      unreadCount: 0,
      isLoading: false,

      setFriendRequests: (requests) => {
        const unreadCount = requests.filter(r => r.status === 'pending').length
        set({ 
          friendRequests: requests,
          unreadCount
        })
      },

      addFriendRequest: (request) => {
        const { friendRequests } = get()
        const exists = friendRequests.find(r => r.id === request.id)
        if (!exists) {
          const updatedRequests = [...friendRequests, request]
          const unreadCount = updatedRequests.filter(r => r.status === 'pending').length
          set({ 
            friendRequests: updatedRequests,
            unreadCount
          })
        }
      },

      removeFriendRequest: (requestId) => {
        const { friendRequests } = get()
        const updatedRequests = friendRequests.filter(r => r.id !== requestId)
        const unreadCount = updatedRequests.filter(r => r.status === 'pending').length
        set({ 
          friendRequests: updatedRequests,
          unreadCount
        })
      },

      markAsRead: (requestId) => {
        const { friendRequests } = get()
        const updatedRequests = friendRequests.map(r => 
          r.id === requestId ? { ...r, status: 'approved' as const } : r
        )
        const unreadCount = updatedRequests.filter(r => r.status === 'pending').length
        set({ 
          friendRequests: updatedRequests,
          unreadCount
        })
      },

      clearAll: () => {
        set({ 
          friendRequests: [],
          unreadCount: 0
        })
      },
    }),
    {
      name: 'notification-store',
    }
  )
)