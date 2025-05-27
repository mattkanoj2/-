export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          last_seen_at: string
          notification_settings: Json
          privacy_settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          last_seen_at?: string
          notification_settings?: Json
          privacy_settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          last_seen_at?: string
          notification_settings?: Json
          privacy_settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      friendships: {
        Row: {
          id: string
          requester_id: string
          approver_id: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          approver_id: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          requester_id?: string
          approver_id?: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      statuses: {
        Row: {
          id: string
          user_id: string
          status: 'studying' | 'working' | 'eating' | 'free' | 'offline'
          emoji: string | null
          location: string | null
          updated_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          status: 'studying' | 'working' | 'eating' | 'free' | 'offline'
          emoji?: string | null
          location?: string | null
          updated_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'studying' | 'working' | 'eating' | 'free' | 'offline'
          emoji?: string | null
          location?: string | null
          updated_at?: string
          expires_at?: string | null
        }
      }
      status_history: {
        Row: {
          id: string
          user_id: string
          status: string
          emoji: string | null
          location: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status: string
          emoji?: string | null
          location?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          emoji?: string | null
          location?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          recipient_id: string
          sender_id: string | null
          type: 'friend_request' | 'status_update' | 'system'
          title: string
          message: string
          data: Json | null
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          recipient_id: string
          sender_id?: string | null
          type: 'friend_request' | 'status_update' | 'system'
          title: string
          message: string
          data?: Json | null
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          recipient_id?: string
          sender_id?: string | null
          type?: 'friend_request' | 'status_update' | 'system'
          title?: string
          message?: string
          data?: Json | null
          read_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type StatusType = 'studying' | 'working' | 'eating' | 'free' | 'offline'

export interface UserProfile {
  id: string
  email: string
  name: string
  avatar_url: string | null
  last_seen_at: string
  notification_settings: {
    all: boolean
    friend_requests: boolean
    status_updates: boolean
  }
  privacy_settings: {
    show_last_seen: boolean
    show_status_history: boolean
  }
}

export interface UserStatus {
  id: string
  user_id: string
  status: StatusType
  emoji: string | null
  location: string | null
  updated_at: string
  expires_at: string | null
}

export interface Friend {
  id: string
  name: string
  avatar_url: string | null
  last_seen_at: string
  current_status?: UserStatus
}

export interface FriendRequest {
  id: string
  requester_id: string
  approver_id: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  requester: {
    name: string
    email: string
    avatar_url: string | null
  }
}