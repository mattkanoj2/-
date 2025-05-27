// Environment variable validation
interface RequiredEnvVars {
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
}

interface OptionalEnvVars {
  NODE_ENV?: string
}

type EnvVars = RequiredEnvVars & OptionalEnvVars

class EnvironmentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EnvironmentError'
  }
}

function validateEnvironmentVariables(): EnvVars {
  const requiredVars: (keyof RequiredEnvVars)[] = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]

  const missing: string[] = []
  const invalid: string[] = []

  // Check required variables
  for (const varName of requiredVars) {
    const value = process.env[varName]
    
    if (!value) {
      missing.push(varName)
      continue
    }

    // Validate specific formats
    if (varName === 'NEXT_PUBLIC_SUPABASE_URL') {
      try {
        new URL(value)
      } catch {
        invalid.push(`${varName} (invalid URL format)`)
      }
    }

    if (varName === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
      if (value.length < 50) {
        invalid.push(`${varName} (seems too short)`)
      }
    }
  }

  // Report errors
  const errors: string[] = []
  
  if (missing.length > 0) {
    errors.push(`Missing required environment variables: ${missing.join(', ')}`)
  }
  
  if (invalid.length > 0) {
    errors.push(`Invalid environment variables: ${invalid.join(', ')}`)
  }

  if (errors.length > 0) {
    const errorMessage = [
      '🚨 Environment Configuration Error 🚨',
      '',
      ...errors,
      '',
      '📋 Required environment variables:',
      '- NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL',
      '- NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anon key',
      '',
      '💡 Make sure to create a .env.local file in your project root with these variables.',
      '   You can find these values in your Supabase project settings.',
    ].join('\n')
    
    throw new EnvironmentError(errorMessage)
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    NODE_ENV: process.env.NODE_ENV,
  }
}

// Validate environment variables once at module load
let env: EnvVars

try {
  env = validateEnvironmentVariables()
} catch (error) {
  if (error instanceof EnvironmentError) {
    console.error(error.message)
    
    // In development, show a helpful error page
    if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
      process.exit(1)
    }
  }
  throw error
}

export const environmentConfig = env

// Type-safe environment variable access
export function getEnvVar(key: keyof EnvVars): string | undefined {
  return env[key]
}

export function getRequiredEnvVar(key: keyof RequiredEnvVars): string {
  const value = env[key]
  if (!value) {
    throw new EnvironmentError(`Required environment variable ${key} is not set`)
  }
  return value
}

// Environment checks
export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'

// Helper to get Supabase config safely
export function getSupabaseConfig() {
  return {
    url: getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  }
}