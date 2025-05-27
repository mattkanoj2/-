'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { authService } from '@/lib/auth'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authService.getCurrentUser()
      if (user) {
        router.push('/dashboard')
      }
    }
    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold text-primary mb-4">ヒトコト</h1>
        <p className="text-xl text-muted-foreground mb-8">
          親しい友人間でのシンプルで気軽なコミュニケーション
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🎓</div>
              <div className="text-sm">勉強中</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💼</div>
              <div className="text-sm">仕事中</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🍽️</div>
              <div className="text-sm">ごはん中</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">😊</div>
              <div className="text-sm">ヒマ</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">😴</div>
              <div className="text-sm">オフライン</div>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-6">
            ワンクリックで今の状況を友達と共有。<br />
            コメントやいいねはなく、シンプルに今を伝えるSNSです。
          </p>
        </div>

        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Button asChild size="lg">
            <Link href="/auth/signup">はじめる</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/auth/login">ログイン</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}