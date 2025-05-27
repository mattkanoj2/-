'use client'

import { useState } from 'react'
import { StatusButton } from './status-button'
import { getStatusDisplay } from '@/lib/utils'
import { useStatusStore } from '@/store/status'
import { useToast } from '@/hooks/use-toast'
import type { StatusType } from '@/lib/supabase/types'

const statusTypes: StatusType[] = ['studying', 'working', 'eating', 'free', 'offline']

export function StatusGrid() {
  const [updating, setUpdating] = useState<StatusType | null>(null)
  const { updateStatus } = useStatusStore()
  const { toast } = useToast()

  const handleStatusUpdate = async (status: StatusType) => {
    setUpdating(status)
    try {
      await updateStatus(status)
      toast({
        title: "ステータス更新完了",
        description: `${getStatusDisplay(status).label}に更新しました`,
      })
    } catch (error) {
      // Error handling is done by the store/API layer
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">ステータス更新</h2>
        <p className="text-sm text-muted-foreground">
          今何をしているかをワンクリックで共有
        </p>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {statusTypes.map((status) => {
            const statusDisplay = getStatusDisplay(status)
            return (
              <StatusButton
                key={status}
                emoji={statusDisplay.emoji}
                label={statusDisplay.label}
                color={statusDisplay.color}
                loading={updating === status}
                onClick={() => handleStatusUpdate(status)}
              />
            )
          })}
        </div>
        
        <p className="text-xs text-muted-foreground mt-4 text-center">
          ステータスは60分後に自動でオフラインになります
        </p>
      </div>
    </div>
  )
}