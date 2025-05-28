import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ヒトコト | シンプルなステータス共有',
  description: '親しい友人間でのシンプルで気軽なコミュニケーション',
  keywords: ['SNS', 'ステータス共有', 'プライベート', 'コミュニケーション'],
  authors: [{ name: 'ヒトコト Team' }],
  openGraph: {
    title: 'ヒトコト | シンプルなステータス共有',
    description: '親しい友人間でのシンプルで気軽なコミュニケーション',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ヒトコト | シンプルなステータス共有',
    description: '親しい友人間でのシンプルで気軽なコミュニケーション',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}