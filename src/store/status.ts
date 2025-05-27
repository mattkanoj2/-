import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { statusApi } from '@/lib/api/status'
import { errorHandler } from '@/lib/errors'
import type { StatusType, UserStatus } from '@/lib/supabase/types'

interface StatusState {
  currentStatus: UserStatus | null
  isUpdating: boolean
  lastUpdated: Date | null
  
  // Actions
  setCurrentStatus: (status: UserStatus | null) => void
  updateStatus: (status: StatusType) => Promise<void>
  loadCurrentStatus: () => Promise<void>
  clearExpiredStatus: () => void
}

export const useStatusStore = create<StatusState>()(
  devtools(
    (set, get) => ({
      currentStatus: null,
      isUpdating: false,
      lastUpdated: null,

      setCurrentStatus: (status) => set({ 
        currentStatus: status,
        lastUpdated: status ? new Date() : null
      }),

      updateStatus: async (status) => {
        try {
          set({ isUpdating: true })
          await statusApi.updateStatus(status)
          
          // Update local state with new status
          const newStatus: UserStatus = {
            id: '', // Will be set by database
            user_id: '', // Will be set by database
            status,
            emoji: null,
            location: null,
            updated_at: new Date().toISOString(),
            expires_at: (() => {
              const expires = new Date()
              expires.setHours(expires.getHours() + 1)
              return expires.toISOString()
            })()
          }
          
          set({ 
            currentStatus: newStatus,
            isUpdating: false,
            lastUpdated: new Date()
          })
        } catch (error) {
          set({ isUpdating: false })
          throw error // Re-throw for component handling
        }
      },

      loadCurrentStatus: async () => {
        try {
          const status = await statusApi.getCurrentStatus()
          set({ 
            currentStatus: status,
            lastUpdated: status ? new Date() : null
          })
        } catch (error) {
          errorHandler.handle(error, 'StatusStore.loadCurrentStatus')
          set({ currentStatus: null })
        }
      },

      clearExpiredStatus: () => {
        const { currentStatus } = get()
        if (currentStatus?.expires_at) {
          const expiryTime = new Date(currentStatus.expires_at)
          if (expiryTime < new Date()) {
            set({ currentStatus: null })
          }
        }
      },
    }),
    {
      name: 'status-store',
    }
  )
)