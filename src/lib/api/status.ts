import { createClient } from '@/lib/supabase/client'
import { authService } from '@/lib/auth'
import type { StatusType } from '@/lib/supabase/types'

export const statusApi = {
  async updateStatus(status: StatusType) {
    const supabase = createClient()
    const user = await authService.getCurrentUser()
    
    if (!user) throw new Error('認証が必要です')
    
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // 1時間後に期限切れ
    
    const { error } = await supabase
      .from('statuses')
      .upsert({
        user_id: user.id,
        status,
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString()
      })
    
    if (error) throw error
  },

  async getCurrentStatus() {
    const supabase = createClient()
    const user = await authService.getCurrentUser()
    
    if (!user) return null
    
    const { data, error } = await supabase
      .from('statuses')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (error) return null
    return data
  }
}