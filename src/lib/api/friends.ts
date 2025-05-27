import { createClient } from '@/lib/supabase/client'
import { authService } from '@/lib/auth'
import { errorHandler } from '@/lib/errors'
import type { Friend } from '@/lib/supabase/types'

export const friendsApi = {
  async getFriends(): Promise<Friend[]> {
    try {
      const supabase = createClient()
      const user = await authService.getCurrentUser()
      
      if (!user) {
        throw errorHandler.auth('User not authenticated', '認証が必要です')
      }
      
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          requester:users!requester_id(id, name, email, avatar_url, last_seen_at),
          approver:users!approver_id(id, name, email, avatar_url, last_seen_at)
        `)
        .or(`requester_id.eq.${user.id},approver_id.eq.${user.id}`)
        .eq('status', 'approved')
      
      if (error) {
        throw errorHandler.server(error.message, '友達リストの取得に失敗しました')
      }
      
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
    } catch (error) {
      errorHandler.handle(error, 'FriendsAPI.getFriends')
      throw error
    }
  },

  async searchUserByEmail(email: string) {
    try {
      if (!email || !email.includes('@')) {
        throw errorHandler.validation('Invalid email format', '有効なメールアドレスを入力してください')
      }

      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, avatar_url')
        .eq('email', email)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          throw errorHandler.notFound('User not found', '指定されたメールアドレスのユーザーは見つかりません')
        }
        throw errorHandler.server(error.message, 'ユーザー検索に失敗しました')
      }
      
      return data
    } catch (error) {
      errorHandler.handle(error, 'FriendsAPI.searchUserByEmail')
      throw error
    }
  },

  async sendFriendRequest(targetUserId: string) {
    try {
      const supabase = createClient()
      const user = await authService.getCurrentUser()
      
      if (!user) {
        throw errorHandler.auth('User not authenticated', '認証が必要です')
      }

      if (user.id === targetUserId) {
        throw errorHandler.validation('Cannot send friend request to self', '自分自身に友達リクエストは送信できません')
      }
      
      const { error } = await supabase
        .from('friendships')
        .insert({
          requester_id: user.id,
          approver_id: targetUserId,
          status: 'pending'
        })
      
      if (error) {
        if (error.code === '23505') {
          throw errorHandler.validation('Friend request already exists', 'すでに友達リクエストが送信されています')
        }
        throw errorHandler.server(error.message, '友達リクエストの送信に失敗しました')
      }
    } catch (error) {
      errorHandler.handle(error, 'FriendsAPI.sendFriendRequest')
      throw error
    }
  }
}