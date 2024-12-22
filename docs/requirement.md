以下では、「PoC専門のマッチングプラットフォーム」を Vercel 上で実装することを想定したシステム要件定義のドラフトを提示します。実際のプロジェクト規模・チーム体制・詳細要件に合わせて、必要な部分を取捨選択・拡張してください。

1. 事業概要・想定ユーザー
事業概要:

企業（クライアント）が「生成AIで○○を試したい」というPoCを依頼し、エンジニアが提案・開発を行うためのマッチングプラットフォーム。
PoCだけを短期的に実施し、本格開発は行わない形を想定。
想定ユーザー:

企業 (Client): PoC案件を投稿し、エンジニアからの提案を受ける。
エンジニア (Engineer): PoC案件に提案・見積もりを出し、選定後PoCを実施する。
管理者 (Admin): プラットフォームを監視し、不正利用やユーザーサポート等を行う。

2. 機能一覧
以下の機能を実装する想定です。

ユーザー認証・会員管理

メールアドレス+パスワードによるユーザー登録・ログイン・ログアウト
プロフィール編集（表示名、アイコン、自己紹介など）
ユーザータイプの切り替え（エンジニア⇔企業）
（将来的に）SNSログイン対応可

検索機能

企業検索（企業名、業界、規模など）
エンジニア検索（スキル、経験年数、評価など）
案件検索（キーワード、予算、技術スタックなど）

PoC案件管理

企業がPoC案件を新規投稿
投稿内容（タイトル、概要、予算、納期希望など）の編集・削除
案件一覧・詳細閲覧（エンジニア・他の企業も閲覧可能か検討）

提案(Proposal) / 応募機能

エンジニアがPoC案件に対して提案を登録（提案内容・金額・スケジュール案など）
企業が提案一覧を閲覧、比較、選定（採用・却下）
採用されたら「成約」状態となり、PoC開始
提案後は即座にメッセージでのやり取りが可能

決済 (Stripe Connect)

PoCプロジェクトの支払い(企業→プラットフォーム)
エンジニアへの送金(プラットフォーム→エンジニア)
Stripe Connect / Webhook対応
支払い状態の管理（成功・失敗など）

メッセージ / チャット機能

企業・エンジニア間の個別メッセージ送受信
提案段階からのやり取り可能
成約後のやりとりをプラットフォーム内で完結させる
既読管理、添付ファイル送信など

レビュー機能

プロジェクト完了後に企業がエンジニアに対してレビューを投稿
5段階評価とコメントを記録
スキル別の評価集計と表示
レビュー一覧表示（企業・エンジニアごと）
バッジ機能との連携（高評価獲得でバッジ付与）

バッジ / 実績機能

条件達成でバッジを付与（初めてのプロジェクト完了、高評価獲得など）
バッジ一覧表示
プロフィールページでのバッジ表示

ミーティング調整

日時候補を提案/選択し、オンライン会議URLを登録（Zoom/Google Meetなど外部サービス）
簡易的なスケジュール連携

ブログ機能 (記事投稿)

エンジニア・企業ともに記事投稿が可能
AI/PoC関連の記事でSEO流入を狙う
記事一覧・記事詳細・コメント（オプション）
プロフィールページでの記事一覧表示
記事の編集・削除機能

管理者機能

ユーザー管理（BAN、ロール変更など）
PoC案件/投稿の管理（違反投稿の非公開/削除など）
決済状況の参照・キャンセル処理

通知機能 (オプション)

提案があった時、メッセージが来た時、承認された時などにメール/プッシュ通知
レビュー投稿時の通知
バッジ獲得時の通知

3. データベース設計 (例: RDB, PostgreSQL想定)
Vercel はDBを直接提供しないため、外部DB (Railway, Supabase, PlanetScaleなど) もしくは AWS RDS 等を利用すると想定します。以下はテーブル例。

■ users
- id (PK)
- role (enum) : 'client' / 'engineer' / 'admin'
- email (unique)
- password (ハッシュ)
- display_name
- profile_image_url
- skills (jsonb) // エンジニアのスキルセット（技術名: 経験年数）
- company_info (jsonb) // 企業情報（業界、規模など）
- stripe_connect_id // Stripe Connect用のアカウントID
- created_at
- updated_at

■ projects  (PoC案件)
- id (PK)
- user_id (FK -> users.id)     // 投稿した企業のユーザーID
- title
- description (text)
- budget (int)                 // 希望予算
- status (enum) : 'open', 'in_progress', 'closed'
- created_at
- updated_at

■ proposals (提案)
- id (PK)
- project_id (FK -> projects.id)
- engineer_id (FK -> users.id) // 提案したエンジニアのユーザーID
- proposal_text (text)         // 提案内容
- proposed_budget (int)
- proposed_timeline (varchar)
- status (enum) : 'submitted', 'accepted', 'rejected'
- created_at
- updated_at

■ contracts (契約/成約)
- id (PK)
- project_id (FK -> projects.id)
- proposal_id (FK -> proposals.id)
- contract_amount (int)
- start_date
- end_date
- status (enum): 'active','completed','cancelled'
- created_at
- updated_at

■ messages (チャット/メッセージ)
- id (PK)
- proposal_id (FK -> proposals.id) // 提案段階のメッセージ用
- contract_id (FK -> contracts.id) // 契約後のメッセージ用
- sender_id (FK -> users.id)
- message_body (text)
- created_at

■ reviews (レビュー)
- id (PK)
- contract_id (FK -> contracts.id)
- reviewer_id (FK -> users.id)  // レビューを書いたユーザー
- reviewee_id (FK -> users.id)  // レビューされたユーザー
- rating (int)                  // 5段階評価
- comment (text)
- created_at

■ user_badges (バッジ)
- id (PK)
- user_id (FK -> users.id)
- badge_type (enum)            // 'FIRST_PROJECT', 'FIVE_PROJECTS', 'TOP_RATED' など
- awarded_at (timestamp)

■ blog_posts
- id (PK)
- author_id (FK -> users.id)
- title
- content (text)
- published_at (nullable)
- created_at
- updated_at

■ blog_comments (オプション)
- id (PK)
- blog_post_id (FK -> blog_posts.id)
- user_id (FK -> users.id)
- comment_text (text)
- created_at

■ payments (Stripe連携)
- id (PK)
- contract_id (FK -> contracts.id)
- stripe_payment_intent_id
- stripe_transfer_id           // エンジニアへの送金ID
- amount
- fee_amount                   // プラットフォーム手数料
- currency
- status (enum): 'pending','succeeded','failed'
- created_at

■ notifications (通知)
- id (PK)
- user_id (FK -> users.id)
- type (enum)                  // 'NEW_PROPOSAL', 'NEW_MESSAGE', 'REVIEW_RECEIVED' など
- title (varchar)
- body (text)
- read_at (timestamp, nullable)
- created_at

4. ストレージ設計
Vercel自体はファイルストレージを持たないので、下記いずれかの外部ストレージを利用:
AWS S3: 画像や資料、ユーザーアイコン、添付ファイルを格納
Cloudinary / Firebase Storage / Supabase Storage などのSaaSストレージ
メッセージ添付ファイルやアイコン画像などは、アップロード→URLをDBに保存→CDN経由で配信 という流れを想定。

5. ユースケース図
