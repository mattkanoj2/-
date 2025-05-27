# ヒトコト セットアップガイド

## 1. 前提条件

- Node.js 18.x以上
- npm または yarn
- Supabaseアカウント

## 2. プロジェクトセットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にログイン
2. 新しいプロジェクトを作成
3. プロジェクトURLとAPI Keyを取得

### 3. データベースセットアップ

1. SupabaseのSQL Editorを開く
2. `supabase/schema.sql`の内容を実行
3. Authenticationセクションで以下を設定：
   - Email認証を有効化
   - Google OAuth設定（オプション）

### 4. 環境変数の設定

`.env.example`をコピーして`.env.local`を作成：

```bash
cp .env.example .env.local
```

以下の値を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いてアプリケーションを確認してください。

## 3. 機能説明

### 認証機能
- メールアドレス・パスワードでのサインアップ/ログイン
- Google OAuth認証
- メール認証

### ステータス機能
- 5種類のステータス（勉強中、仕事中、ごはん中、ヒマ、オフライン）
- ワンクリック更新
- 60分後の自動リセット

### フレンド機能
- メールアドレスでの友達検索・招待
- フレンドリクエストの承認・拒否
- リアルタイムでの友達のステータス確認

## 4. デプロイ

### Vercelへのデプロイ

1. Vercelアカウント作成
2. GitHubリポジトリと連携
3. 環境変数を設定
4. デプロイ実行

詳細は[Vercel Documentation](https://vercel.com/docs)を参照してください。

## 5. 開発のヒント

### TypeScript
- 厳密な型チェックが有効
- Supabaseの型定義は`src/lib/supabase/types.ts`で管理

### スタイリング
- Tailwind CSSを使用
- カスタムステータスカラーは`tailwind.config.js`で定義
- レスポンシブデザイン対応

### データベース
- Row Level Security (RLS)が有効
- リアルタイム機能はSupabase Realtimeを使用

## 6. トラブルシューティング

### よくある問題

1. **認証エラー**: Supabase URLとキーを確認
2. **データベースエラー**: スキーマが正しく適用されているか確認
3. **スタイルが反映されない**: TailwindのCSS設定を確認

### ログの確認

```bash
# 開発サーバーのログ
npm run dev

# 型チェック
npm run type-check

# Lint
npm run lint
```