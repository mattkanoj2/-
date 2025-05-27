import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { authService } from '@/lib/auth'
import { errorHandler } from '@/lib/errors'
import type { UserProfile } from '@/lib/supabase/types'

interface AuthState {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Actions
  setUser: (user: UserProfile | null) => void
  loadUser: () => Promise<void>
  logout: () => Promise<void>
  updateLastSeen: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false 
      }),

      loadUser: async () => {
        try {
          set({ isLoading: true })
          
          const currentUser = await authService.getCurrentUser()
          if (!currentUser) {
            set({ user: null, isAuthenticated: false, isLoading: false })
            return
          }

          const profile = await authService.getUserProfile(currentUser.id)
          if (!profile) {
            set({ user: null, isAuthenticated: false, isLoading: false })
            return
          }

          set({ 
            user: profile, 
            isAuthenticated: true, 
            isLoading: false 
          })

          // Update last seen automatically
          await authService.updateLastSeen()
        } catch (error) {
          errorHandler.handle(error, 'AuthStore.loadUser')
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },

      logout: async () => {
        try {
          await authService.signOut()
          set({ user: null, isAuthenticated: false, isLoading: false })
        } catch (error) {
          errorHandler.handle(error, 'AuthStore.logout')
        }
      },

      updateLastSeen: async () => {
        try {
          await authService.updateLastSeen()
        } catch (error) {
          errorHandler.handle(error, 'AuthStore.updateLastSeen')
        }
      },
    }),
    {
      name: 'auth-store',
    }
  )
)