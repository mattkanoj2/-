# ヒトコト 完全セットアップガイド 🚀

## 📋 目次
1. [前提条件](#1-前提条件)
2. [アカウント準備](#2-アカウント準備)
3. [ローカル開発環境の構築](#3-ローカル開発環境の構築)
4. [Supabaseプロジェクトのセットアップ](#4-supabaseプロジェクトのセットアップ)
5. [環境変数の設定](#5-環境変数の設定)
6. [アプリケーションの起動](#6-アプリケーションの起動)
7. [Vercelへのデプロイ](#7-vercelへのデプロイ)
8. [トラブルシューティング](#8-トラブルシューティング)

---

## 1. 前提条件

### 必要なソフトウェア

#### Node.js（必須）
1. [Node.js公式サイト](https://nodejs.org/ja/)にアクセス
2. **LTS版（推奨版）** をダウンロード
3. インストーラーを実行し、すべてデフォルトで進める
4. インストール確認：
   ```bash
   node --version
   npm --version
   ```
   - Node.js 18.x以上であることを確認
   - npm 9.x以上であることを確認

#### Git（必須）
1. [Git公式サイト](https://git-scm.com/)からダウンロード
2. インストーラーを実行（すべてデフォルトでOK）
3. 確認：
   ```bash
   git --version
   ```

#### コードエディタ（推奨）
- [Visual Studio Code](https://code.visualstudio.com/)を推奨
- 以下の拡張機能をインストール：
  - TypeScript and JavaScript Language Features（標準）
  - Tailwind CSS IntelliSense
  - Prettier - Code formatter
  - ESLint

---

## 2. アカウント準備

### 2.1 GitHubアカウント
1. [GitHub](https://github.com/)でアカウント作成
2. このリポジトリをフォークまたはクローン

### 2.2 Supabaseアカウント
1. [Supabase](https://supabase.com/)にアクセス
2. 「Start your project」をクリック
3. **GitHubアカウントでサインアップ**を選択（推奨）
4. 認証を完了

### 2.3 Vercelアカウント
1. [Vercel](https://vercel.com/)にアクセス
2. 「Sign Up」をクリック
3. **GitHubアカウントでサインアップ**を選択
4. 認証を完了

---

## 3. ローカル開発環境の構築

### 3.1 プロジェクトのクローン
```bash
# GitHubからクローン
git clone https://github.com/[あなたのユーザー名]/hitokoto.git
cd hitokoto
```

### 3.2 依存関係のインストール
```bash
# パッケージのインストール（少し時間がかかります）
npm install
```

**⚠️ エラーが出た場合：**
```bash
# キャッシュをクリアしてから再試行
npm cache clean --force
npm install
```

---

## 4. Supabaseプロジェクトのセットアップ

### 4.1 新しいプロジェクトの作成

1. **Supabaseダッシュボードにログイン**
   - [app.supabase.com](https://app.supabase.com/)にアクセス

2. **「New project」をクリック**

3. **プロジェクト情報の入力**
   - **Name**: `hitokoto-app`（または任意の名前）
   - **Database Password**: 強力なパスワードを設定（必ずメモ！）
   - **Region**: `Northeast Asia (Tokyo)`を選択
   - **Pricing plan**: `Free`を選択

4. **「Create new project」をクリック**
   - プロジェクトの作成に1-2分かかります

### 4.2 データベーススキーマのセットアップ

1. **SQL Editorを開く**
   - 左サイドバーの「SQL Editor」をクリック

2. **スキーマファイルの実行**
   - プロジェクトの`supabase/schema.sql`ファイルを開く
   - **ファイル全体の内容をコピー**
   - Supabase SQL Editorに**貼り付け**
   - **「Run」ボタンをクリック**

3. **実行結果の確認**
   - 緑色の「Success」メッセージが表示されることを確認
   - エラーが出た場合は、[トラブルシューティング](#8-トラブルシューティング)を参照

### 4.3 認証設定

1. **Authentication設定を開く**
   - 左サイドバーの「Authentication」をクリック
   - 「Settings」タブを選択

2. **Email認証の有効化**
   - 「Auth Providers」セクションで「Email」が有効になっていることを確認
   - 「Confirm email」が有効になっていることを確認

3. **Google OAuth設定（オプション）**
   - 「Auth Providers」で「Google」を探す
   - 「Enable Google provider」をオンにする
   - 以下を設定：
     ```
     Client ID: (Google Cloud Consoleで作成)
     Client Secret: (Google Cloud Consoleで作成)
     ```
   
   **Google OAuth設定手順：**
   1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
   2. 新しいプロジェクトを作成
   3. 「APIs & Services」→「Credentials」
   4. 「Create Credentials」→「OAuth 2.0 Client IDs」
   5. Application type: 「Web application」
   6. Authorized redirect URIs: `https://[YOUR_SUPABASE_URL]/auth/v1/callback`

### 4.4 プロジェクト情報の取得

1. **Project Settings**を開く
   - 歯車アイコン（Settings）をクリック
   - 「API」タブを選択

2. **重要な情報をコピー**（後で使用します）
   - **Project URL**: `https://[プロジェクトID].supabase.co`
   - **anon public key**: `eyJ...`で始まる長い文字列

---

## 5. 環境変数の設定

### 5.1 環境ファイルの作成

```bash
# .env.localファイルを作成
cp .env.example .env.local
```

### 5.2 環境変数の設定

`.env.local`ファイルを開いて以下のように設定：

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://[あなたのプロジェクトID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ[あなたのAnonキー]

# アプリケーション設定
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ 注意点：**
- `[あなたのプロジェクトID]`と`[あなたのAnonキー]`は実際の値に置き換え
- 他の人にこのファイルを共有しない
- GitHubにコミットしない（`.gitignore`で除外済み）

---

## 6. アプリケーションの起動

### 6.1 開発サーバーの起動

```bash
# 開発サーバーを起動
npm run dev
```

### 6.2 動作確認

1. **ブラウザで確認**
   - [http://localhost:3000](http://localhost:3000)にアクセス
   - ヒトコトのログイン画面が表示されることを確認

2. **機能テスト**
   - 新規アカウント登録を試す
   - メール認証を完了
   - ログイン/ログアウトを試す
   - ステータス更新を試す

### 6.3 その他の便利なコマンド

```bash
# 型チェック
npm run type-check

# リンター実行
npm run lint

# ビルドテスト
npm run build
```

---

## 7. Vercelへのデプロイ

### 7.1 Vercelプロジェクトの作成

1. **Vercelダッシュボードにアクセス**
   - [vercel.com/dashboard](https://vercel.com/dashboard)

2. **「New Project」をクリック**

3. **GitHubリポジトリをインポート**
   - 「Import Git Repository」でヒトコトプロジェクトを選択
   - 「Import」をクリック

4. **プロジェクト設定**
   - **Project Name**: `hitokoto-app`（または任意）
   - **Framework Preset**: `Next.js`（自動検出される）
   - **Root Directory**: `./`（デフォルト）

### 7.2 環境変数の設定

1. **Environment Variables**セクションで以下を追加：

   ```
   NEXT_PUBLIC_SUPABASE_URL = https://[あなたのプロジェクトID].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ[あなたのAnonキー]
   NEXT_PUBLIC_APP_URL = https://[あなたのVercelドメイン].vercel.app
   ```

2. **「Deploy」をクリック**

### 7.3 デプロイ確認

1. **デプロイ完了まで待機**（通常1-3分）

2. **デプロイされたアプリを確認**
   - 提供されたURLにアクセス
   - 本番環境での動作を確認

### 7.4 カスタムドメイン設定（オプション）

1. **Project Settings**→**Domains**
2. **「Add Domain」**で独自ドメインを追加
3. DNS設定を更新

---

## 8. トラブルシューティング

### よくある問題と解決方法

#### 🚨 問題1: `npm install`でエラーが出る

**症状:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**解決方法:**
```bash
# Node.jsのバージョンを確認
node --version  # 18.x以上である必要

# npmキャッシュをクリア
npm cache clean --force

# node_modulesを削除して再インストール
rm -rf node_modules
npm install

# それでもダメな場合
npm install --legacy-peer-deps
```

#### 🚨 問題2: Supabaseに接続できない

**症状:**
- ログイン画面で「Network Error」
- コンソールに「Failed to fetch」エラー

**解決方法:**
1. **.env.localファイルを確認**
   ```bash
   cat .env.local
   ```
   - URLとキーが正しく設定されているか確認

2. **Supabaseプロジェクトの確認**
   - プロジェクトが正常に作成されているか
   - スキーマが正しく実行されているか

3. **ブラウザのデベロッパーツールで確認**
   - F12→Networkタブでエラー詳細を確認

#### 🚨 問題3: 認証メールが届かない

**症状:**
- サインアップ後、確認メールが届かない

**解決方法:**
1. **迷惑メールフォルダを確認**

2. **Supabase Authentication設定を確認**
   - Email認証が有効になっているか
   - Template設定が正しいか

3. **開発環境の場合**
   - Supabaseダッシュボード→Authentication→Usersで手動でメール確認

#### 🚨 問題4: Vercelデプロイでエラー

**症状:**
```
Build failed with error: ...
```

**解決方法:**
1. **ローカルでビルドテスト**
   ```bash
   npm run build
   ```

2. **環境変数を確認**
   - Vercel Dashboardで環境変数が正しく設定されているか

3. **ログを確認**
   - Vercel Dashboard→Deployments→エラーログを確認

#### 🚨 問題5: TypeScriptエラー

**症状:**
```
Type error: Cannot find module '@/lib/utils'
```

**解決方法:**
```bash
# TypeScript設定を確認
cat tsconfig.json

# パス設定を修正（必要に応じて）
npm run type-check
```

### ログの確認方法

#### 開発環境
```bash
# 開発サーバーのログ
npm run dev

# 詳細ログ
DEBUG=* npm run dev
```

#### 本番環境（Vercel）
1. Vercel Dashboard→Project→Functions
2. ログを確認

### さらにヘルプが必要な場合

1. **GitHub Issues**
   - プロジェクトのGitHub Issuesで質問

2. **公式ドキュメント**
   - [Next.js Documentation](https://nextjs.org/docs)
   - [Supabase Documentation](https://supabase.com/docs)
   - [Vercel Documentation](https://vercel.com/docs)

3. **コミュニティ**
   - [Next.js Discord](https://discord.gg/nextjs)
   - [Supabase Discord](https://discord.supabase.com/)

---

## 🎉 セットアップ完了！

おめでとうございます！ヒトコトアプリケーションのセットアップが完了しました。

### 次のステップ

1. **フレンドを招待**してアプリをテスト
2. **ステータス更新**機能を試す
3. **カスタマイズ**やｆunctionを追加する
4. **フィードバック**を共有する

### 開発を続ける場合

- `src/`フォルダ内のファイルを編集
- 変更は自動的にリロードされます
- Git commit/pushでVercelに自動デプロイ

**Happy Coding! 🚀**