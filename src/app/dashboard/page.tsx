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
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
          <div className="absolute top-1/4 -left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-3/4 -right-10 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '5s' }}></div>
        </div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="h-24 w-24 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full animate-spin"></div>
                <div className="absolute inset-2 bg-white rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-16 w-16 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-foreground animate-pulse">読み込み中...</p>
              <p className="text-sm text-muted-foreground">もう少しお待ちください</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="absolute top-1/4 -left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-3/4 -right-10 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '5s' }}></div>
      </div>
      
      <div className="relative z-10">
        <Header user={user} />
        
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-8">
            {/* Welcome section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-2">
                おかえりなさい、{user.name || 'ユーザー'}さん
              </h1>
              <p className="text-muted-foreground text-lg">
                今日も友達とつながりましょう
              </p>
            </div>
            
            {/* Main content with glass morphism cards */}
            <div className="space-y-8">
              {/* Friends section */}
              <div className="glass-card rounded-3xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-2xl">👥</span>
                  友達のステータス
                </h2>
                <FriendsGrid />
              </div>
              
              {/* Status update section */}
              <div className="glass-card rounded-3xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  あなたのステータス
                </h2>
                <StatusGrid />
              </div>
            </div>
          </div>
        </main>
        
        <Toaster />
      </div>
    </div>
  )
}