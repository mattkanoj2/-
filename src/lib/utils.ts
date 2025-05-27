import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 1) {
    return 'たった今'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}分前`
  } else if (diffInHours < 24) {
    return `${diffInHours}時間前`
  } else {
    return `${diffInDays}日前`
  }
}

export function getStatusDisplay(status: string) {
  const statusMap = {
    studying: { emoji: '🎓', label: '勉強中', color: 'status-studying' },
    working: { emoji: '💼', label: '仕事中', color: 'status-working' },
    eating: { emoji: '🍽️', label: 'ごはん中', color: 'status-eating' },
    free: { emoji: '😊', label: 'ヒマ', color: 'status-free' },
    offline: { emoji: '😴', label: 'オフライン', color: 'status-offline' },
  }
  
  return statusMap[status as keyof typeof statusMap] || statusMap.offline
}