'use client'

import { useState } from 'react'
import { UserPlus, Search, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { friendsApi } from '@/lib/api/friends'
import { useToast } from '@/hooks/use-toast'

interface AddFriendModalProps {
  children: React.ReactNode
}

export function AddFriendModal({ children }: AddFriendModalProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [searchResult, setSearchResult] = useState<any>(null)
  const [searching, setSearching] = useState(false)
  const [sending, setSending] = useState(false)
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!email.trim()) return

    setSearching(true)
    setSearchResult(null)

    try {
      const user = await friendsApi.searchUserByEmail(email.trim())
      setSearchResult(user)
    } catch (error) {
      // Error handling is done by the API layer
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
      setOpen(false)
      setEmail('')
      setSearchResult(null)
    } catch (error) {
      // Error handling is done by the API layer
    } finally {
      setSending(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setEmail('')
    setSearchResult(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            友達を追加
          </DialogTitle>
          <DialogDescription>
            メールアドレスで友達を検索して、友達リクエストを送信します
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">メールアドレス</Label>
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
                variant="outline" 
                size="icon"
                onClick={handleSearch}
                disabled={!email.trim() || searching}
              >
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {searchResult && (
            <div className="border rounded-lg p-4 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  {searchResult.avatar_url ? (
                    <img 
                      src={searchResult.avatar_url} 
                      alt={searchResult.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-primary font-semibold">
                      {searchResult.name.charAt(0)}
                    </span>
                  )}
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
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  送信中...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  友達リクエスト送信
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}