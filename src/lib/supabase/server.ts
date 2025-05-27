import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseConfig } from '@/lib/env'
import type { Database } from './types'

export function createClient() {
  const cookieStore = cookies()
  const { url, anonKey } = getSupabaseConfig()

  return createServerClient<Database>(
    url,
    anonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}