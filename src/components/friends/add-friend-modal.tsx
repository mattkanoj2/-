'use client'

import { useState } from 'react'
import { UserPlus, Mail, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { friendsApi } from "@/lib/api/friends"

interface AddFriendModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFriendAdded?: () => void
}

export function AddFriendModal({ open, onOpenChange, onFriendAdded }: AddFriendModalProps) {
  const [email, setEmail] = useState('')
  const [searchResult, setSearchResult] = useState<any>(null)
  const [searching, setSearching] = useState(false)
  const [sending, setSending] = useState(false)
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!email.trim()) {
      toast({
        title: "エラー",
        description: "メールアドレスを入力してください",
        variant: "destructive",
      })
      return
    }

    setSearching(true)
    try {
      const user = await friendsApi.searchUserByEmail(email.trim())
      setSearchResult(user)
    } catch (error) {
      console.error('User search failed:', error)
      toast({
        title: "ユーザーが見つかりません",
        description: "入力されたメールアドレスのユーザーは存在しません",
        variant: "destructive",
      })
      setSearchResult(null)
    } finally {
      setSearching(false)
    }
  }

  const handleSendRequest = async () => {
    if (!searchResult) return

    setSending(true)
    try {
      await friendsApi.sendFriendRequest(searchResult.id)
      toast({
        title: "友達リクエスト送信完了",
        description: `${searchResult.name}さんに友達リクエストを送信しました`,
      })
      
      setEmail('')
      setSearchResult(null)
      onOpenChange(false)
      onFriendAdded?.()
    } catch (error) {
      console.error('Friend request failed:', error)
      toast({
        title: "エラー",
        description: "友達リクエストの送信に失敗しました",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setSearchResult(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            友達を追加
          </DialogTitle>
          <DialogDescription>
            メールアドレスで友達を検索して追加しましょう
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              メールアドレス
            </Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                onClick={handleSearch} 
                disabled={searching}
                variant="outline"
              >
                {searching ? '検索中...' : '検索'}
              </Button>
            </div>
          </div>

          {searchResult && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{searchResult.name}</p>
                  <p className="text-sm text-muted-foreground">{searchResult.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            キャンセル
          </Button>
          {searchResult && (
            <Button 
              onClick={handleSendRequest} 
              disabled={sending}
            >
              {sending ? '送信中...' : '友達リクエスト送信'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}