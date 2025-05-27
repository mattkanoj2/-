import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { friendsApi } from '@/lib/api/friends'
import { errorHandler } from '@/lib/errors'
import type { Friend, UserStatus } from '@/lib/supabase/types'

interface FriendsState {
  friends: Friend[]
  friendStatuses: Map<string, UserStatus>
  isLoading: boolean
  lastUpdated: Date | null
  
  // Actions
  setFriends: (friends: Friend[]) => void
  loadFriends: () => Promise<void>
  addFriend: (friend: Friend) => void
  removeFriend: (friendId: string) => void
  updateFriendStatus: (userId: string, status: UserStatus) => void
  clearFriendStatus: (userId: string) => void
  setFriendStatuses: (statuses: Map<string, UserStatus>) => void
}

export const useFriendsStore = create<FriendsState>()(
  devtools(
    (set, get) => ({
      friends: [],
      friendStatuses: new Map(),
      isLoading: false,
      lastUpdated: null,

      setFriends: (friends) => set({ 
        friends, 
        lastUpdated: new Date() 
      }),

      loadFriends: async () => {
        try {
          set({ isLoading: true })
          const friends = await friendsApi.getFriends()
          set({ 
            friends, 
            isLoading: false, 
            lastUpdated: new Date() 
          })
        } catch (error) {
          errorHandler.handle(error, 'FriendsStore.loadFriends')
          set({ isLoading: false })
        }
      },

      addFriend: (friend) => {
        const { friends } = get()
        if (!friends.find(f => f.id === friend.id)) {
          set({ 
            friends: [...friends, friend],
            lastUpdated: new Date()
          })
        }
      },

      removeFriend: (friendId) => {
        const { friends, friendStatuses } = get()
        const updatedStatuses = new Map(friendStatuses)
        updatedStatuses.delete(friendId)
        
        set({ 
          friends: friends.filter(f => f.id !== friendId),
          friendStatuses: updatedStatuses,
          lastUpdated: new Date()
        })
      },

      updateFriendStatus: (userId, status) => {
        const { friendStatuses } = get()
        const updatedStatuses = new Map(friendStatuses)
        updatedStatuses.set(userId, status)
        set({ friendStatuses: updatedStatuses })
      },

      clearFriendStatus: (userId) => {
        const { friendStatuses } = get()
        const updatedStatuses = new Map(friendStatuses)
        updatedStatuses.delete(userId)
        set({ friendStatuses: updatedStatuses })
      },

      setFriendStatuses: (statuses) => {
        set({ friendStatuses: statuses })
      },
    }),
    {
      name: 'friends-store',
    }
  )
)