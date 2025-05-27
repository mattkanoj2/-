'use client'

import { Bell, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { authService } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import type { UserProfile } from '@/lib/supabase/types'

interface HeaderProps {
  user: UserProfile
}

export function Header({ user }: HeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary">ヒトコト</h1>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {user.name}
          </span>
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}