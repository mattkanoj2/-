import { toast } from '@/hooks/use-toast'

export enum ErrorType {
  AUTH_ERROR = 'AUTH_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppErrorOptions {
  type: ErrorType
  message: string
  userMessage?: string
  details?: any
  shouldLog?: boolean
  shouldToast?: boolean
}

export class AppError extends Error {
  public readonly type: ErrorType
  public readonly userMessage: string
  public readonly details?: any
  public readonly shouldLog: boolean
  public readonly shouldToast: boolean

  constructor(options: AppErrorOptions) {
    super(options.message)
    this.name = 'AppError'
    this.type = options.type
    this.userMessage = options.userMessage || this.getDefaultUserMessage(options.type)
    this.details = options.details
    this.shouldLog = options.shouldLog ?? true
    this.shouldToast = options.shouldToast ?? true
  }

  private getDefaultUserMessage(type: ErrorType): string {
    const messages: Record<ErrorType, string> = {
      [ErrorType.AUTH_ERROR]: '認証に失敗しました。再度ログインしてください。',
      [ErrorType.NETWORK_ERROR]: 'ネットワークエラーが発生しました。接続を確認してください。',
      [ErrorType.VALIDATION_ERROR]: '入力された情報に誤りがあります。',
      [ErrorType.NOT_FOUND_ERROR]: '要求されたリソースが見つかりません。',
      [ErrorType.PERMISSION_ERROR]: 'この操作を行う権限がありません。',
      [ErrorType.SERVER_ERROR]: 'サーバーエラーが発生しました。しばらく後に再試行してください。',
      [ErrorType.UNKNOWN_ERROR]: '予期しないエラーが発生しました。',
    }
    return messages[type] || messages[ErrorType.UNKNOWN_ERROR]
  }
}

export const errorHandler = {
  handle(error: unknown, context?: string): void {
    let appError: AppError

    if (error instanceof AppError) {
      appError = error
    } else if (error instanceof Error) {
      appError = this.parseError(error)
    } else {
      appError = new AppError({
        type: ErrorType.UNKNOWN_ERROR,
        message: String(error),
      })
    }

    // ログ出力
    if (appError.shouldLog) {
      console.error(`[${context || 'Unknown'}] ${appError.type}:`, {
        message: appError.message,
        userMessage: appError.userMessage,
        details: appError.details,
        stack: appError.stack,
      })
    }

    // Toast通知
    if (appError.shouldToast) {
      toast({
        title: 'エラー',
        description: appError.userMessage,
        variant: 'destructive',
      })
    }
  },

  parseError(error: Error): AppError {
    const message = error.message.toLowerCase()

    // Supabaseエラーの解析
    if (message.includes('invalid login credentials')) {
      return new AppError({
        type: ErrorType.AUTH_ERROR,
        message: error.message,
        userMessage: 'ログイン情報が正しくありません。',
      })
    }

    if (message.includes('user not found') || message.includes('no rows returned')) {
      return new AppError({
        type: ErrorType.NOT_FOUND_ERROR,
        message: error.message,
        userMessage: '指定されたユーザーまたはデータが見つかりません。',
      })
    }

    if (message.includes('permission denied') || message.includes('insufficient privileges')) {
      return new AppError({
        type: ErrorType.PERMISSION_ERROR,
        message: error.message,
      })
    }

    if (message.includes('network') || message.includes('fetch')) {
      return new AppError({
        type: ErrorType.NETWORK_ERROR,
        message: error.message,
      })
    }

    if (message.includes('validation') || message.includes('invalid input')) {
      return new AppError({
        type: ErrorType.VALIDATION_ERROR,
        message: error.message,
      })
    }

    // デフォルトはサーバーエラー
    return new AppError({
      type: ErrorType.SERVER_ERROR,
      message: error.message,
    })
  },

  // 特定のエラータイプ用のヘルパー関数
  auth(message: string, userMessage?: string): AppError {
    return new AppError({
      type: ErrorType.AUTH_ERROR,
      message,
      userMessage,
    })
  },

  network(message: string, userMessage?: string): AppError {
    return new AppError({
      type: ErrorType.NETWORK_ERROR,
      message,
      userMessage,
    })
  },

  validation(message: string, userMessage?: string): AppError {
    return new AppError({
      type: ErrorType.VALIDATION_ERROR,
      message,
      userMessage,
    })
  },

  notFound(message: string, userMessage?: string): AppError {
    return new AppError({
      type: ErrorType.NOT_FOUND_ERROR,
      message,
      userMessage,
    })
  },

  permission(message: string, userMessage?: string): AppError {
    return new AppError({
      type: ErrorType.PERMISSION_ERROR,
      message,
      userMessage,
    })
  },

  server(message: string, userMessage?: string): AppError {
    return new AppError({
      type: ErrorType.SERVER_ERROR,
      message,
      userMessage,
    })
  },
}

// グローバルエラーハンドラー（オプション）
export const setupGlobalErrorHandler = () => {
  // Unhandled promise rejection
  window.addEventListener('unhandledrejection', (event) => {
    errorHandler.handle(event.reason, 'UnhandledPromiseRejection')
    event.preventDefault()
  })

  // Uncaught exception
  window.addEventListener('error', (event) => {
    errorHandler.handle(event.error, 'UncaughtException')
  })
}