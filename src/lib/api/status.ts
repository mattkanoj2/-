import { createClient } from '@/lib/supabase/client'
import { authService } from '@/lib/auth'
import { errorHandler, ErrorType } from '@/lib/errors'
import type { StatusType } from '@/lib/supabase/types'

export const statusApi = {
  async updateStatus(status: StatusType) {
    try {
      const supabase = createClient()
      const user = await authService.getCurrentUser()
      
      if (!user) {
        throw errorHandler.auth('User not authenticated', '認証が必要です')
      }
      
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
      
      if (error) {
        throw errorHandler.server(error.message, 'ステータスの更新に失敗しました')
      }
    } catch (error) {
      errorHandler.handle(error, 'StatusAPI.updateStatus')
      throw error
    }
  },

  async getCurrentStatus() {
    try {
      const supabase = createClient()
      const user = await authService.getCurrentUser()
      
      if (!user) return null
      
      const { data, error } = await supabase
        .from('statuses')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" which is expected when no status exists
        throw errorHandler.server(error.message, 'ステータスの取得に失敗しました')
      }
      
      return data
    } catch (error) {
      errorHandler.handle(error, 'StatusAPI.getCurrentStatus')
      return null
    }
  }
}