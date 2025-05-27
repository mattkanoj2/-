'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'
import { StatusGrid } from '@/components/status/status-grid'
import { FriendsGrid } from '@/components/friends/friends-grid'
import { Header } from '@/components/layout/header'
import type { UserProfile, Friend } from '@/lib/supabase/types'

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        if (!currentUser) {
          router.push('/auth/login')
          return
        }

        const profile = await authService.getUserProfile(currentUser.id)
        if (!profile) {
          router.push('/auth/login')
          return
        }

        setUser(profile)
        await authService.updateLastSeen()
        
        // TODO: Load friends
        setFriends([])
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          <FriendsGrid friends={friends} />
          <StatusGrid />
        </div>
      </main>
    </div>
  )
}