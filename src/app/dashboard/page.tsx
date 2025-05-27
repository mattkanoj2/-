'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { useFriendsStore } from '@/store/friends'
import { useStatusStore } from '@/store/status'
import { StatusGrid } from '@/components/status/status-grid'
import { FriendsGrid } from '@/components/friends/friends-grid'
import { Header } from '@/components/layout/header'
import { Toaster } from '@/components/ui/toaster'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, loadUser } = useAuthStore()
  const { loadFriends } = useFriendsStore()
  const { loadCurrentStatus } = useStatusStore()

  useEffect(() => {
    const initializeDashboard = async () => {
      await loadUser()
      
      // If not authenticated after loading user, redirect to login
      if (!isAuthenticated && !isLoading) {
        router.push('/auth/login')
        return
      }
      
      // Load additional data if authenticated
      if (isAuthenticated) {
        await Promise.all([
          loadFriends(),
          loadCurrentStatus()
        ])
      }
    }

    initializeDashboard()
  }, [loadUser, loadFriends, loadCurrentStatus, isAuthenticated, isLoading, router])

  // Show loading while checking authentication
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          <FriendsGrid />
          <StatusGrid />
        </div>
      </main>
      <Toaster />
    </div>
  )
}