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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-4xl">
          {/* Logo and title with gradient */}
          <div className="mb-8">
            <h1 className="text-7xl sm:text-8xl font-bold mb-4 text-gradient animate-float">
              ヒトコト
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium">
              親しい友人間でのシンプルで気軽なコミュニケーション
            </p>
          </div>
          
          {/* Feature card with glass morphism */}
          <div className="glass-card rounded-3xl p-8 sm:p-12 mb-10 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-bold mb-8 text-foreground">今の気持ちをワンタップで共有</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
              <div className="group cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative bg-white rounded-2xl p-6 shadow-lg group-hover:shadow-xl transform group-hover:-translate-y-1 transition-all duration-300">
                    <div className="text-4xl mb-3">🎓</div>
                    <div className="text-sm font-medium text-gray-700">勉強中</div>
                  </div>
                </div>
              </div>
              
              <div className="group cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative bg-white rounded-2xl p-6 shadow-lg group-hover:shadow-xl transform group-hover:-translate-y-1 transition-all duration-300">
                    <div className="text-4xl mb-3">💼</div>
                    <div className="text-sm font-medium text-gray-700">仕事中</div>
                  </div>
                </div>
              </div>
              
              <div className="group cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative bg-white rounded-2xl p-6 shadow-lg group-hover:shadow-xl transform group-hover:-translate-y-1 transition-all duration-300">
                    <div className="text-4xl mb-3">🍽️</div>
                    <div className="text-sm font-medium text-gray-700">ごはん中</div>
                  </div>
                </div>
              </div>
              
              <div className="group cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative bg-white rounded-2xl p-6 shadow-lg group-hover:shadow-xl transform group-hover:-translate-y-1 transition-all duration-300">
                    <div className="text-4xl mb-3">😊</div>
                    <div className="text-sm font-medium text-gray-700">ヒマ</div>
                  </div>
                </div>
              </div>
              
              <div className="group cursor-pointer col-span-2 sm:col-span-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative bg-white rounded-2xl p-6 shadow-lg group-hover:shadow-xl transform group-hover:-translate-y-1 transition-all duration-300">
                    <div className="text-4xl mb-3">😴</div>
                    <div className="text-sm font-medium text-gray-700">オフライン</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                ワンクリックで今の状況を友達と共有
              </p>
              <p className="text-sm text-muted-foreground">
                コメントやいいねはなく、シンプルに今を伝えるSNSです
              </p>
            </div>
          </div>

          {/* CTA buttons with enhanced styling */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="group relative overflow-hidden px-8 py-6 text-lg font-semibold">
              <Link href="/auth/signup">
                <span className="relative z-10">はじめる</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="px-8 py-6 text-lg font-semibold border-2 hover:bg-primary/5">
              <Link href="/auth/login">ログイン</Link>
            </Button>
          </div>
          
          {/* Features list */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
              <div className="text-2xl mb-3">🔒</div>
              <h3 className="font-semibold mb-2">完全プライベート</h3>
              <p className="text-sm text-muted-foreground">承認した友達のみとのクローズドな関係</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
              <div className="text-2xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2">リアルタイム同期</h3>
              <p className="text-sm text-muted-foreground">友達のステータスを即座に確認</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
              <div className="text-2xl mb-3">✨</div>
              <h3 className="font-semibold mb-2">ストレスフリー</h3>
              <p className="text-sm text-muted-foreground">コメントやいいね機能なし</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}