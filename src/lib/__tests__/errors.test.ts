import { AppError, ErrorType, errorHandler } from '../errors'

// Mock toast
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}))

describe('AppError', () => {
  it('creates error with correct properties', () => {
    const error = new AppError({
      type: ErrorType.VALIDATION_ERROR,
      message: 'Test error',
      userMessage: 'Custom user message',
    })

    expect(error.type).toBe(ErrorType.VALIDATION_ERROR)
    expect(error.message).toBe('Test error')
    expect(error.userMessage).toBe('Custom user message')
    expect(error.shouldLog).toBe(true)
    expect(error.shouldToast).toBe(true)
  })

  it('provides default user message for error types', () => {
    const error = new AppError({
      type: ErrorType.AUTH_ERROR,
      message: 'Auth failed',
    })

    expect(error.userMessage).toBe('認証に失敗しました。再度ログインしてください。')
  })
})

describe('errorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates appropriate error for auth errors', () => {
    const error = errorHandler.auth('Authentication failed')
    expect(error.type).toBe(ErrorType.AUTH_ERROR)
    expect(error.message).toBe('Authentication failed')
  })

  it('parses Supabase errors correctly', () => {
    const supabaseError = new Error('invalid login credentials')
    const parsed = errorHandler.parseError(supabaseError)
    
    expect(parsed.type).toBe(ErrorType.AUTH_ERROR)
    expect(parsed.userMessage).toBe('ログイン情報が正しくありません。')
  })

  it('handles unknown errors', () => {
    const unknownError = new Error('Something went wrong')
    const parsed = errorHandler.parseError(unknownError)
    
    expect(parsed.type).toBe(ErrorType.SERVER_ERROR)
  })
})