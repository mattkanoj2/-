'use client'

import { Bell, Settings, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
    <header className="glass-card sticky top-0 z-50 border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gradient">
              ヒトコト
            </h1>
          </div>

          {/* User section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* User info - hidden on mobile */}
            <div className="hidden sm:flex items-center gap-3 mr-2">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src={user.avatar_url || undefined} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
                  {user.name?.slice(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-primary/10 rounded-xl"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full animate-pulse" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-primary/10 rounded-xl"
              >
                <Settings className="h-5 w-5" />
              </Button>
              
              <div className="w-px h-6 bg-border mx-1" />
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSignOut}
                className="hover:bg-destructive/10 hover:text-destructive rounded-xl"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}