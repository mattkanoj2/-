import { createClient } from '@/lib/supabase/client'
import { authService } from '@/lib/auth'
import type { Friend } from '@/lib/supabase/types'

export const friendsApi = {
  async getFriends(): Promise<Friend[]> {
    const supabase = createClient()
    const user = await authService.getCurrentUser()
    
    if (!user) throw new Error('認証が必要です')
    
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        *,
        requester:users!requester_id(id, name, email, avatar_url, last_seen_at),
        approver:users!approver_id(id, name, email, avatar_url, last_seen_at)
      `)
      .or(`requester_id.eq.${user.id},approver_id.eq.${user.id}`)
      .eq('status', 'approved')
    
    if (error) throw error
    
    // 友達情報を正規化
    return data.map(friendship => {
      const friend = friendship.requester_id === user.id 
        ? friendship.approver 
        : friendship.requester
      
      return {
        id: friend.id,
        name: friend.name,
        avatar_url: friend.avatar_url,
        last_seen_at: friend.last_seen_at
      }
    })
  },

  async searchUserByEmail(email: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, avatar_url')
      .eq('email', email)
      .single()
    
    if (error) throw error
    return data
  },

  async sendFriendRequest(targetUserId: string) {
    const supabase = createClient()
    const user = await authService.getCurrentUser()
    
    if (!user) throw new Error('認証が必要です')
    
    const { error } = await supabase
      .from('friendships')
      .insert({
        requester_id: user.id,
        approver_id: targetUserId,
        status: 'pending'
      })
    
    if (error) throw error
  }
}