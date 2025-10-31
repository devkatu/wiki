<!-- todo -->
<!-- TypeScript,ESLintの設定の部分、TypeScriptの記事アップしたらリンクする -->

# Next.js

## Next.jsってなに？

Next.jsは、ReactをベースにしたWebアプリケーションフレームワークです。ReactがUIを構築するためのライブラリであるのに対し、Next.jsはファイルベースのルーティング、多様なレンダリング戦略、画像最適化、APIルートなど、モダンなWeb開発に必要な機能を網羅的に提供します。

### Next.jsの特徴とReactとの差分

React単体での開発では、ルーティングやサーバーサイドレンダリング（SSR）などの機能を実装するために、複数のライブラリを自分で組み合わせて設定する必要がありました。Next.jsはこれらの機能をフレームワークレベルで統合しており、開発者はアプリケーションのロジックに集中できます。

- **ゼロコンフィグに近い開発体験**: 複雑な設定なしに、すぐに開発を始められます。
- **レンダリング戦略**: 静的サイト生成（SSG）、サーバーサイドレンダリング（SSR）、インクリメンタル静的再生成（ISR）など、ページごとに最適なレンダリング方法を選択できます。
- **ファイルベースルーティング**: ディレクトリ構造がそのままURLのパスになり、直感的なルーティングが可能です。
- **最適化機能**: 画像最適化、コード分割、プリフェッチなどが自動で行われ、高いパフォーマンスを実現します。

### ルーティング方式 App Router と Pages Router

Next.jsには2つのルーティング方式があります。

- **Pages Router**: 以前からの方式で、`pages`ディレクトリ内にファイルを作成してルーティングを定義します。
- **App Router**: Next.js 13から導入された新しい方式で、`app`ディレクトリを使用します。React Server Componentsをベースにしており、より柔軟なレイアウト設計やデータフェッチが可能です。

現在は**App Router**が推奨されており、本記事でもApp Routerを前提に解説を進めます。

## 環境構築

### `create-next-app` を使ったプロジェクト生成

Next.jsプロジェクトは、`create-next-app`コマンドで簡単に作成できます。ターミナルで以下のコマンドを実行してください。※Node.jsのバージョンアップが必要な場合があります。

```bash
npx create-next-app@latest my-next-app
```

コマンドを実行すると、次のように対話形式でプロジェクトの設定を尋ねられます。TypeScript、ESLint、Tailwind CSSなどの使用を、N/Yで選択していきましょう。

```
Would you like to use TypeScript? No / Yes
Would you like to use ESLint? No / Yes
Would you like to use Tailwind CSS? No / Yes
Would you like your code inside a `src/` directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to use Turbopack for `next dev`?  No / Yes
Would you like to customize the import alias (`@/*` by default)? No / Yes
What import alias would you like configured? @/*
```

上から、

- TypeScriptを使用するか？
- ESLintを使用するか？
- Tailwind CSSを使用するか？
- `src/`ディレクトリを使用してコードを配置するか？
- App Routerを使用するか？(No選択でPages Routerを使用)
- Turbopackを使用するか？
- パスエイリアスを使用するか？ 

を尋ねられています。

### ディレクトリ構成と初期ファイル

App Routerを選択してプロジェクトを作成すると、インストール時のオプション選択により多少異なりますが、以下のようなディレクトリ構成になります。

```
my-next-app/
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── node_modules
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── public
├── README.md
├── src
│   └── app
│       ├── layout.tsx  # 共通レイアウト
│       └── page.tsx    # トップページのUI
└── tsconfig.json
```

- **`app/`**: アプリケーションのルーティング、UI、ロジックを配置する中心的なディレクトリです。
- **`app/layout.tsx`**: 全ページで共有されるルートレイアウトです。`<html>`や`<body>`タグを含みます。
- **`app/page.tsx`**: `/`（ルートパス）にアクセスした際に表示されるページのコンポーネントです。
- **`public/`**: 画像やフォントなど、ビルド時に変換されない静的ファイルを置くフォルダです。配置したファイルは、ビルド後にルートパス（`/`）直下からそのまま参照できます。

### その他の特殊ファイル

`page.tsx`、`layout.tsx`以外にも特別な役割を持つファイルがいくつかあります。

- `template.tsx` : `layout.tsx`とほぼ同じ機能だが、画面遷移の都度、DOMが作成され、ステートが初期化される。
- `error.tsx` : `page.tsx`内でエラーが発生した際に表示されるページ
- `loading.tsx` : コンポーネントを非同期で読み出している間に表示するローディングアイコン等のコンポーネント
- `not-found.tsx` : 404 Not Found エラーが発生した際に表示されるページ

デフォルトでは同じディレクトリにこれらの特殊ファイルを配置しておくと、下記のような感じでレンダリングされます。

```
<Layout>                    // layout.tsx
  <Template>                // template.tsx
    <ErrorBoundary fallback={<Error />}>   // error.tsx
      <Suspense fallback={<Loading />}>    // loading.tsx
        <ErrorBoundary fallback={<NotFound />}> // not-found.tsx
          <Page />         // page.tsx
        </ErrorBoundary>
      </Suspense>
    </ErrorBoundary>
  </Template>
</Layout>
```

### 慣習的なフォルダー名

Next.jsに限りませんが、以下のようなフォルダー名が慣習的に使用されます。他の人のプロジェクトを見るときに参考になるかも？

| フォルダ名             | 意味・目的                                  | 備考                                   |
| ----------------- | -------------------------------------- | ------------------------------------ |
| **`components/`** | 再利用可能なUIコンポーネント群                       | ボタン・モーダルなど共通UI                       |
| **`ui/`**         | `components`の代替。デザインシステム指向のプロジェクトで好まれる | Tailwind + shadcn/uiなどでよく見る          |
| **`hooks/`**      | カスタムフック群                               | 例：`useUser.ts`, `useScroll.ts`       |
| **`context/`**    | React Contextをまとめる                     | 例：`ThemeContext.tsx`                 |
| **`lib/`**        | 汎用的な関数・設定を置く                           | APIクライアント、フォーマッタなど                   |
| **`utils/`**      | `lib`と似ているがより小粒な関数群                    | 命名・日付フォーマットなど                        |
| **`types/`**      | TypeScriptの型定義                         | APIレスポンス型、共通インターフェイスなど               |
| **`data/`**         | 一時的なJSONやモックデータ                | プロトタイプやデモ段階で使用        |
| **`styles/`** | CSS / SCSS / Tailwindの設定など | `globals.css` などを配置  |
| **`assets/`** | 画像・フォント・動画など               | `public/`とは別で管理したいとき |
| **`actions/`**      | `"use server"` を使った **サーバーアクション関数** をまとめる | フォーム送信・DB操作・認証処理など、API Routeの代替として利用される。App Routerでは一般的。例：`app/actions/user.ts` |

### 開発サーバー起動、ホットリロード確認

作成したプロジェクトのディレクトリに移動し、以下のコマンドで開発サーバーを起動します。

```bash
cd my-next-app
npm run dev
```

サーバーが起動すると、`http://localhost:3000` のようなURLが表示されます。ブラウザでアクセスすると、作成したアプリケーションが表示されます。
開発サーバーが起動している間は、ソースコードを編集して保存すると、変更が即座にブラウザに反映されます（ホットリロード）。

### TypeScript、ESLintの設定

TypeScriptの設定は`tsconfig.json`ファイルにて行います。(パスエイリアスの設定もこちらです。)

下記の記事が参考になります。

<!-- todo -->

ESLintの設定は`eslint.config.mjs`等のファイルにて行います。

下記の記事が参考になります。

<!-- todo -->

## ルーティングとレイアウト設計（App Router）

### `app` ディレクトリ構造

App Routerでは、`app`ディレクトリ内のフォルダ構造がURLのパスに対応します。各フォルダに`page.tsx`ファイルを作成することで、そのパスに対応するページを定義します。

```
app
├── about
│   └── page.tsx
├── dashboard
│   ├── layout.tsx
│   ├── page.tsx
│   └── settings
│       ├── layout.tsx
│       └── page.tsx
└── page.tsx
```

- `app/page.tsx` → `http://{サーバ名}/`
- `app/about/page.tsx` → `http://{サーバ名}/about`
- `app/dashboard/settings/page.tsx` → `http://{サーバ名}/dashboard/settings`

`page.tsx`を配置しなければ、そのパスにルーティングされることはないので、`app`ディレクトリ内に、コンポーネントやライブラリを入れておくディレクトリを配置する事も可能です。

```
├── about
│   └── page.tsx
├── components
│   └── button.tsx
├── dashboard
│   ├── layout.tsx
│   ├── page.tsx
│   └── settings
│       ├── layout.tsx
│       └── page.tsx
├── lib
│   └── utils.ts
└── page.tsx
```

### `page.tsx`と`layout.tsx`

- **`page.tsx`**  
    該当するページのUIを定義するファイルです。Reactコンポーネントを`export default`します。これが無いとページは表示されません。
- **`layout.tsx`**  
    複数のページで共有されるUIを定義するファイルです。`children` propsを受け取り、その中に同階層の`page.tsx`や、下層の`layout.tsx`や`page.tsx`を描画します。ヘッダーやフッター、サイドバーなどの共通部分を`layout.tsx`でまとめ、ページ毎の内容を`page.tsx`に分離することができます。
- **`template.tsx`**
    `layout.tsx`とほぼ同じ機能だが、画面遷移の都度、DOMが作成され、ステートが初期化されます。画面遷移時にレイアウトに埋め込んだフォームを初期化したい場合や、アニメーションの表示を行う等の場合はこちらを使用します。

例えば、ダッシュボード関連のページで共通のサイドバーを持つレイアウトを適用したい場合、以下のようにファイルを配置します。

```
app
  └── dashboard
      ├── layout.tsx
      └── page.tsx
```      

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children, // page.tsx やネストされたレイアウトが入る
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* ここにサイドバーなどの共通UIを配置 */}
      <nav>Dashboard Sidebar</nav>
      {children}
    </section>
  );
}
```

```tsx
// app/dashboard/page.tsx
export default function DashboardPage() {
  return <h1>Dashboard Home</h1>;
}
```

この構成により、`/dashboard`にアクセスすると`DashboardLayout`の中に`DashboardPage`が描画されます。

```
<section>
  <nav>Dashboard Sidebar</nav>
  <h1>Dashboard Home</h1>
</section>
```

ネストされたルートの場合は、親ルートの`layout.tsx`が自ルートの`layout.tsx`をラップし、さらに自ルートの`page.tsx`をラップします。

例として先の`app/dashboard`ディレクトリと、次のようにネストされた`app/dashboard/settings`とがある場合、

```
app
  └── dashboard
      ├── layout.tsx
      ├── page.tsx
      └── settings
          ├── layout.tsx
          └── page.tsx
```

追加するsettings以下は次のようにします。

```tsx
// app/dashboard/settings/layout.tsx
export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2>Settings</h2>
      {children}
    </div>
  );
}
```

```tsx
// app/dashboard/settings/page.tsx
export default function SettingsPage() {
  return <p>設定ページ</p>
}
```

レンダリングされる要素は次のようになります。

```
<section>
  <nav>Dashboard Sidebar</nav>
  <div>
    <h2>Settings</h2>
    <p>設定ページ</p>
  </div>
</section>
```

`<section>`、`<nav>`が`app/dashboard/layout.tsx`でレンダリングされる要素であり、その子要素として`app/dashboard/settings/layout.tsx`、`app/dashboard/settings/page.tsx`がレンダリングされます。

### 動的ルート

`[folderName]`のようにフォルダ名を角括弧で囲むと、動的なURLセグメントを作成できます。例えば、`app/blog/[slug]/page.tsx`は`/blog/first-post`や`/blog/another-post`など、任意の投稿IDに対応します。

[`generateStaticParams`](#generatestaticparams-等動的ルートでの処理)関数と組み合わせて使用します。

    ```tsx
    // app/blog/[slug]/page.tsx
    export default function PostPage({ params }: { params: { slug: string } }) {
      return <div>Post: {params.slug}</div>;
    }
    ```

### ルートグループ

`(folderName)`のようにフォルダ名を丸括弧で囲むと、そのフォルダ名はURLのパスに影響を与えずにルーティングをグループ化できます。

次のようなケースで役に立ちます。

- ルーティングに影響を与えずにフォルダ整理を行える  
    通常はフォルダ構造がそのままURLとなりますが、`(folderName)`としたものはURLに影響しません
    ```
    app
    ├── (group1)
    │   ├── about      → /aboutでアクセス可能
    │   │   └── page.tsx
    │   └── blog       → /blogでアクセス可能
    │       └── page.tsx
    └── (group2)
        └── account    → /accountでアクセス可能
            └── page.tsx
    ```
- `layout.tsx`の影響範囲を分割する  
    以下のようなフォルダ構造にすると特定のルートのみに対応する`layout.tsx`が有効となります
    ```
    app
    ├── (group1)
    │   ├── about
    │   │   └── page.tsx
    │   ├── blog
    │   │   └── page.tsx
    │   └── layout.tsx    → /about, /blogにのみ有効
    └── (group2)
        ├── account
        │   └── page.tsx
        └── layout.tsx    → /accountにのみ有効
    ```

### プライベートフォルダ

フォルダ名に先頭にアンダースコアを付けて`_folder`のようにすると、そのフォルダと下層のサブフォルダ全てをルーティングから除外します。

エディタなどでのファイルのソートや、ページとその他コンポーネントの明確化などに便利です。

```
app
├── dashboard
│   ├── layout.tsx
│   ├── page.tsx
│   └── settings
│       ├── layout.tsx
│       └── page.tsx
├── _lib
│   └── pagex.tsx  → pges.tsxを配置しても/_lib/にはアクセスできない
│   └── utils.ts
└── page.tsx
```

### ページ間リンク

ページ間の遷移には、`<a>`タグの代わりにNext.jsが提供する`<Link>`コンポーネントを使用します。これにより、ページ全体をリロードすることなく、クライアントサイドで高速な画面遷移が実現できます。

また、`<Link>`コンポーネントがブラウザのビューポート内に入ると、Next.jsは遷移先のページをバックグラウンドで自動的にプリフェッチ（事前読み込み）します。これにより、ユーザーがリンクをクリックした際の遷移が非常に高速になります。

```tsx
import Link from 'next/link'
 
export default async function Post({ post }) {
  const posts = await getPosts()
 
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

ボタンを押したとき等、任意のタイミングでリンク先へ飛びたい場合は`use router`を使用します。

```tsx
'use client'
 
import { useRouter } from 'next/navigation'
 
export default function Page() {
  const router = useRouter()
 
  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  )
}
```

## サーバーコンポーネント と クライアントコンポーネント

App Routerでは、サーバーコンポーネント・コンポーネントとがあり、コンポーネント単位でサーバー・クライアント側での実行を切り替えることができます。

Pages Routerではページ単位で切り替えていたものがこの技術により改善されています。

### サーバーコンポーネント

App Routerでは、コンポーネントはデフォルトで**サーバーコンポーネント**として扱われます。

サーバーコンポーネントは、サーバー側でデータ取得・レンダリング等の処理を極力実行することで、クライアントへ送るJavaScriptの量を削減するとともに、レンダリング済みの結果を送ることで初期読込時間を短縮します。

次のような特徴があります。

1. 実行場所はサーバー
2. サーバーリソースへ直接アクセス可能
    - ファイルシステムやデータベースなど、サーバー側のリソースに直接アクセスすることでクライアントからのリクエストを削減でき、時間短縮が可能。
    - レンダリングに必要なデータ処理を先に行うので、クライアントに送信されるJavaScriptバンドルサイズを小さくできる。
    - 処理結果のみをクライアントに送信するので、APIキーなどの機密データが漏れるリスクが少ない。
3. サーバー側でHTMLを生成
    - クライアント側でそのまま表示可能できるため、初期表示が高速。
    - クローラーが直接認識できるのでSEOに強い。
4. `useState`や`useEffect`などのフックや、イベントハンドラ（`onClick`など）は使用できない。(クライアントコンポーネントで使用可能)
5. ストリーミングと呼ばれる仕組みで、下層の重い処理をするコンポーネントがあっても、準備のできたコンポーネントから順次表示することが可能。

### クライアントコンポーネント

ファイルの先頭に`"use client";`と記述することで、そのファイル内のすべてのコンポーネントと、インポートするコンポーネントが**クライアントコンポーネント**として扱われます。

基本的には従来のReactコンポーネントと似ていますが、サーバーコンポーネントと比べて次のような特徴があります。

- `useState`、`useEffect`等のReactフックが使用可能
- `onClick`、`onChange`等のイベントリスナーが使用可能
- `localStorage`等のブラウザAPIが使用可能

```tsx
// components/Counter.tsx
"use client";  // ファイルの先頭に記述

import { useState } from "react";

export default function Counter() {
  // useState等が使用可能
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

### クライアントコンポーネントでサーバー関数を呼び出す

クライアントコンポーネントからサーバー関数を呼び出したいときには`use server`を使用します。

ファイルの先頭に記述した場合はそのファイル内のすべてのコンポーネントがサーバー上で安全に実行されるようになります。

```ts
// app/actions.ts
"use server";  // サーバー上で実行されるよう指定

export async function addTodo(formData: FormData) {
  const title = formData.get("title");
  await db.todo.create({ title });
}
```

```tsx
// クライアントコンポーネント
"use client";

import { addTodo } from "../actions";

export default function TodoForm() {
  return (
    <form action={addTodo}>
      <input name="title" />
      <button type="submit">追加</button>
    </form>
  );
}
```

`<form>`の`action={addTodo}`が呼ばれた瞬間、ブラウザ→サーバーにデータが送信され Next.jsがサーバー上で`addTodo()`を実行します。

任意の関数内の先頭で記述した場合はその関数のみがサーバー上で実行されます。同一ファイル内にサーバー関数とクライアント関数を混在させることができます。

```tsx
// app/actions.ts

export async function submitForm(formData: FormData) {
  // この関数はサーバー上で実行される
  "use server";
  await db.user.create({ name: formData.get("name") });
}

export function formatDate(date: Date) {
  // これはクライアントでも使える
  return date.toLocaleString("ja-JP");
}
```

### サーバーコンポーネントとクライアントコンポーネントの使い分け

一般的なパターンとして、ページ全体は極力サーバーコンポーネントで構成し、インタラクティブな部分だけをクライアントコンポーネントとして切り出してインポートします。

```tsx
// app/page.tsx (サーバーコンポーネント)
import Counter from "@/components/Counter"; // クライアントコンポーネントをインポート

export default function Home() {
  return (
    <main>
      <h1>Welcome to my app</h1>
      <p>This is a server component.</p>
      
      {/* インタラクティブな部分はクライアントコンポーネントに任せる */}
      <Counter />
    </main>
  );
}
```

## データフェッチとレンダリング戦略

コンポーネントのレンダリングに必要なデータをフェッチする際の方法がいくつかあります。

基本的にはデータフェッチはサーバーコンポーネントで行います。

### サーバーコンポーネントでのデータフェッチ

サーバーコンポーネントでのデータフェッチは、`async/await`を使います。

これにより

1. サーバー側でデータフェッチ
2. データを取得したらコンポーネントをレンダリング
3. クライアントへ送信

となります。

```tsx
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts');
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <ul>
      {posts.map((post: any) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

データベース等にアクセスする際も、データベース呼び出しを`await`することで同様の動作となります。

データフェッチ中のコンポーネントがあっても、ストリーミングにより、`layout.tsx`等の先に表示可能なコンポーネントは先にクライアント側に表示されます。その後データフェッチの終わったコンポーネントも、順次クライアント側に表示されます。

### クライアントコンポーネントにフェッチしたデータを渡す

サーバーコンポーネントでデータフェッチしたものをクライアントコンポーネントに渡す際に、`use`フックを使用することができます。`use`フックは、親から子コンポーネントへ`Promise`を渡すことが出来ます。

親のサーバーコンポーネントでデータをフェッチし、子のクライアントコンポーネントの`props`へ`Promise`を渡します。なお、フェッチする際は`await`を使いません。

これにより、

1. 親サーバーコンポーネントがデータフェッチを開始(`await`無し)
2. `Promise`をそのまま子クライアントコンポーネントに渡す
3. Reactが`Promise`を検出し、フォールバックを表示
4. `Promise`が解決されたらレンダリング

となります。  

サーバーコンポーネント側では以下のようになります。

```tsx
import Posts from '@/app/ui/posts
import { Suspense } from 'react'
 
export default function Page() {
  // awaitを使わずに非同期関数を呼び出す
  // const posts = await getPosts()
  const posts = getPosts()
 
  return (
    // Promiseが解決されるまでフォールバックが表示される
    <Suspense fallback={<div>Loading...</div>}>
      <Posts posts={posts} />
    </Suspense>
  )
}
```

クライアントコンポーネントでは`use`フックを使用して`Promise`を読み取ります。

```tsx
'use client'
import { use } from 'react'
 
export default function Posts({
  posts,
}: {
  posts: Promise<{ id: string; title: string }[]>
}) {
  // useフックでpropsに渡されたPromiseを読み取る
  const allPosts = use(posts);
 
  return (
    // Promiseが解決されたらレンダリング
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### `fetch`のキャッシュ戦略

Next.jsは、サーバーコンポーネントで使われる`fetch` APIを拡張しており、サーバー側のキャッシュや再検証の動作をコンポーネント単位で柔軟に制御できます。

Pages Routerでは`getServerSideProps`や`getStaticProps`を用いてページ単位で行っていたSSG（静的サイト生成）、SSR（サーバーサイドレンダリング）、ISR（インクリメンタル静的再生成）といったレンダリング戦略の切り替えを、App Routerではより細かな粒度で実装できるようになった形です。

`fetch`の挙動は第二引数に渡すオプションで変更でき、省略した場合はデータはキャッシュされず、リクエスト時に最新のデータを取得します。

- デフォルト動作  
  デフォルトではサーバー側でキャッシュをせずにビルド時に最新のデータを取得し静的なHTMLを生成します。レンダリング中にDynamic API(`coockies`、`headers`等)が検出されたらその都度最新のデータを取得します。
  ```ts
  fetch('https://...');
  ```  

- データをキャッシュさせない(SSR相当)  
  リクエストごとに常に最新のデータを取得します。ユーザー情報や、在庫情報等の最新性が求められるコンテンツ向きです。
  ```ts
  fetch('https://...', { cache: 'no-store' });
  ```

- データをキャッシュさせる(SSG相当)  
  ビルド時にデータを取得・サーバー側でキャッシュし、静的なHTMLを生成します。ブログ記事・ドキュメント等の更新頻度の低いコンテンツ向きです。
  ```ts
  fetch('https://...', { cache: 'force-cache' }); // デフォルト
  ```

- キャッシュに寿命を設定する(ISR相当)  
  指定した秒数でデータを再検証し、サーバー側キャッシュを更新します。普段はキャッシュから高速にレスポンスが返され、定期的にデータを最新の値で更新します。SSR,SSGの中間の用な感じ
  ```ts
  // 60秒ごとにデータを再検証
  fetch('https://...', { next: { revalidate: 60 } });
  ```

- キャッシュをタグ付けして管理する  
  サーバー側キャッシュに対してタグ付けし、任意のタイミングでタグ指定によるキャッシュ無効化をすることができます。無効化されたキャッシュは次回のリクエスト時に最新データを取得します。ブログ記事や商品一覧など、複数のページで共通データをキャッシュしている、一部データの更新をトリガーに、関連するキャッシュを自動リフレッシュしたい場合等に有効です。
  ```tsx
  // データ取得＆キャッシュにpostsタグを付ける(配列で複数指定可能)
  fetch(`https://...`, { next: { tags: ['posts'] } })
  ```
  ```ts
  import { revalidateTag } from "next/cache";

  export async function POST(req: Request) {
    // DB 更新処理など
    await db.update(...);

    // "posts" タグ付きキャッシュを全て無効化
    revalidateTag("posts");
    return NextResponse.json({ ok: true });
  }
  ```

SSG、ISR等のビルド等のタイミングでキャッシュされたデータを配信するものはスタティックレンダリング(静的レンダリング)とも呼ばれ、SSR等のリクエスト時に最新のデータを取得するものはダイナミックレンダリング(動的レンダリング)とも呼ばれます。

### 動的ルートでの処理(`generateStaticParams`)

動的ルート（例: `app/blog/[slug]/page.tsx`）を静的生成する場合、`generateStaticParams`関数を使ってビルド時に生成するページのパスパラメータ（`slug`）のリストを定義します。

```tsx
// app/blog/[slug]/page.tsx

// ビルド時にパスの[slug]の部分に当てはめるリストを返す
// ページコンポーネントのparamsとしても渡される
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json());

  return posts.map((post: any) => ({
    // パスの[]の部分をプロパティ名、[]内に入れる値をプロパティ値とする
    slug: post.slug,
  }));
}

// generateStaticParamsが返すparamsで
// 下記ページコンポーネントが静的生成される
export default function PostPage({ params }: { params: { slug: string } }) {
  // ...
  return <div>Post: {params.slug}</div>;
}
```

## データの更新

レンダリングに必要なデータを更新する際の方法がいくつかあります。

### フォームの使用

サーバー関数の呼び出しとして、フォームの使用があります。`<form>`要素が拡張され、`action`というプロパティが使用可能となっており、これにサーバー関数を割り当てることが出来ます。フォームがサブミットされると、`action`に指定したサーバー関数が呼び出されます。

呼出されたサーバー関数では`FormData`オブジェクトを受け取り、`get`メソッドにより入力されたデータを参照可能となります。

```tsx
// app/ui/form.tsx

import { createPost } from '@/app/actions'
 
export function Form() {
  return (
    // actionプロパティにサーバー関数を指定
    <form action={createPost}>
      <input type="text" name="title" />
      <input type="text" name="content" />
      <button type="submit">Create</button>
    </form>
  )
}
```

```ts
// app/actions.ts

// サーバー関数はFormDataオブジェクトを受け取る
export async function createPost(formData: FormData) {
  // getメソッドで入力されたデータを参照可能
  const title = formData.get('title')
  const content = formData.get('content')

  // 入力されたデータで後続処理
  await db.post.create({ title, content })
}
```

### イベントハンドラ

クライアントコンポーネントから、`onClick`等のイベントハンドラを使用してサーバー関数を呼び出し、データの更新を行うことも可能です。

```tsx
// app/LikeButton.tsx
'use client'
 
import { incrementLike } from './actions'
import { useState } from 'react'
 
export default function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes)
 
  return (
    <>
      <p>Total Likes: {likes}</p>
      <button
        onClick={async () => {
          // 非同期でサーバー関数を呼び出す
          const updatedLikes = await incrementLike()
          setLikes(updatedLikes)
        }}
      >
        Like
      </button>
    </>
  )
}
```

### サーバー関数の処理中表示

`useActionState`フックで、サーバー関数を実行している間、読み込みインジケータを表示することが可能です。

`useActionState`フックの第一引数に処理したいサーバー関数、第二引数に初期stateを渡すと、次の配列を返します。

1. 現在のstate。初回レンダリングでは第二引数に渡した初期値となっており、サーバー関数が完了すると、その戻り値が入る。
2. サーバー関数が入っている。`<form>`の`action`プロパティ、`<button>`の`formAction`プロパティなどに渡す。
3. サーバー関数の実行状態を示す`boolean`フラグ

```tsx
'use client'
 
import { useActionState } from 'react'
import { createPost } from '@/app/actions'
import { LoadingSpinner } from '@/app/ui/loading-spinner'
 
export function Button() {
  // useActionStateにサーバー関数を渡す
  const [state, action, pending] = useActionState(createPost, false)
 
  return (
    // buttonクリックにてサーバー関数を実行
    // サーバー関数実行中はLoadingSpinnerが表示され、
    // 完了したらCreate Postを表示
    <button onClick={async () => action()}>
      {pending ? <LoadingSpinner /> : 'Create Post'}
    </button>
  )
}
```

### サーバー側キャッシュのクリア

`revalidatePath`や、`revalidateTag`でNext.jsサーバー側のキャシュをクリアすることができます。

キャッシュがクリアされると、次回アクセス時に最新のデータを取得するようになります。

```tsx
import { revalidatePath } from 'next/cache'
 
export async function createPost(formData: FormData) {
  'use server'
  // Update data
  // ...
 
  // /postsパスに対応するキャッシュをクリア
  revalidatePath('/posts')
}
```

```ts
import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  // DB 更新処理など
  await db.update(...);

  // fetch時に指定した"posts" タグ付きキャッシュを全て無効化
  revalidateTag("posts");
  return NextResponse.json({ ok: true });
}
```

### リダイレクト

データの更新後にリダイレクトをしたい場合は、サーバー関数内で`redirect`を使用します。

```tsx
'use server'
 
import { redirect } from 'next/navigation'
 
export async function createPost(formData: FormData) {
  // Update data
  // ...
 
  redirect('/posts')
}
```

## ローディング表示とエラーハンドリング

`loading.tsx`、`error.tsx`、`not-found.tsx`ファイルで、ローディング表示、エラーハンドリングの仕組みが簡単に実装できます。Reactの`Suspense`や`Error Boundary`といった高度な機能を、Next.jsが裏側で自動的に組み込んでくれます。

### ストリーミングとサスペンスによるローディングUI (`loading.tsx`)

`loading.tsx`で、React Suspenseを利用したローディングUIを簡単に実装できます。

`page.tsx`で読込に時間のかかるコンポーネントを呼出す場合、同じディレクトリに`loading.tsx`を配置すると、そのディレクトリ内の`page.tsx`やその子コンポーネントが読み込まれるまでの間、`loading.tsx`のコンポーネントが自動的に表示されます。

```
app
  └── dashboard
      ├── layout.tsx
      ├── loading.tsx  // /dashboard 以下のページで有効なローディングUI
      ├── page.tsx
      └── settings
          └── page.tsx
```

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  // スピナーやスケルトンスクリーンなどのコンポーネントを返す
  return <p>Loading...</p>;
}
```

このように配置すると、`/dashboard`や`/dashboard/settings`にアクセスした際、データの準備が整うまで`Loading...`と表示されます。`layout.tsx`が`loading.tsx`をラップする構造になるため、共通のレイアウトを維持したままローディング中のコンテンツ部分だけを差し替える動作になります。

配下の各コンポーネントは、データ取得が終わり、準備が整ったものから順次クライアントに送信されることとなります。これがストリーミングと呼ばれるものです。

また、Reactの`<Suspense>`を使用して、ページ内のどの部分にローディング表示を適用するかを指定することも可能です。

```tsx
import { Suspense } from 'react'
import BlogList from '@/components/BlogList'
import BlogListSkeleton from '@/components/BlogListSkeleton'
 
export default function BlogPage() {
  return (
    <div>
      {/* このコンテンツはすぐにクライアントに送信されます */}
      <header>
        <h1>ブログへようこそ</h1>
        <p>以下で最新の投稿をお読みください。</p>
      </header>
      <main>
        {/* <Suspense>ラップされた部分はローディング表示が適用されます */}
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList />
        </Suspense>
      </main>
    </div>
  )
}
```

### 予期されるエラーの処理

フェッチのリクエストエラー、バリデーションエラー等の予期されるエラーは自前で準備する必要があります。※予期せぬエラーの場合は`error.tsx`によって処理されます。

サーバー関数での予期されるエラーの処理には`useActionState`を用いることができます。`useActionState`の返す`state`をサーバー関数の返すエラーメッセージとして用います。

```ts
// app/actions.ts
'use server'
 
export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')
 
  const res = await fetch('https://api.vercel.app/posts', {
    method: 'POST',
    body: { title, content },
  })
  const json = await res.json()
 
  if (!res.ok) {
    // fetchが失敗した(レスポンスが200番台以外だった)場合にメッセージを返す
    return { message: 'Failed to create post' }
  }
}
```

```tsx
// app/ui/form.tsx
'use client'
 
import { useActionState } from 'react'
import { createPost } from '@/app/actions'
 
const initialState = {
  message: '',
}
 
export function Form() {
  const [state, formAction, pending] = useActionState(createPost, initialState)
 
  // エラーメッセージ(state.message)があれば表示
  return (
    <form action={formAction}>
      <label htmlFor="title">Title</label>
      <input type="text" id="title" name="title" required />
      <label htmlFor="content">Content</label>
      <textarea id="content" name="content" required />
      {state?.message && <p aria-live="polite">{state.message}</p>}
      <button disabled={pending}>Create Post</button>
    </form>
  )
}
```

また、サーバーコンポーネント内でデータをフェッチする場合は、レスポンスを使用してそのエラーを表示します。

```tsx
export default async function Page() {
  const res = await fetch(`https://...`)
  const data = await res.json()
 
  // fetchが失敗した(レスポンスが200番台以外だった)場合のエラーハンドリング
  if (!res.ok) {
    return 'エラーが発生しました'
  }
 
  return '...'
}
```

### エラーバウンダリによるエラーUI (`error.tsx`)

コンポーネントのレンダリング中にエラーが発生した場合、アプリケーション全体がクラッシュするのを防ぎ、代わりにエラー専用のUIを表示する仕組みがエラーバウンダリです。`error.tsx`ファイルでこれを実現します。

`error.tsx`は、同じ階層の`page.tsx`やその子コンポーネントで発生したエラーを捕捉します。重要な点として、**`error.tsx`は必ずクライアントコンポーネントでなければなりません**。そのため、ファイルの先頭に`"use client";`を記述する必要があります。

```
app
  └── dashboard
      ├── error.tsx    // /dashboard 以下でエラーが発生した際に表示
      ├── page.tsx
      └── ...
```

```tsx
// app/dashboard/error.tsx
"use client"; // クライアントコンポーネントとしてマーク

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーをロギングサービスに送信するなどの処理
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // セグメントの再レンダリングを試みる
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
```

`error.tsx`は2つのpropsを受け取ります。
- `error`: 発生したエラーオブジェクトです。`error.message`でエラーメッセージにアクセスしたりできます。
- `reset`: エラーから復帰を試みるための関数です。これを呼び出すと、エラーが発生したコンポーネントの再レンダリングが試行されます。

### 404 Not Found ページ (`not-found.tsx`)

存在しないURLにアクセスされた場合に表示する404ページも、`not-found.tsx`ファイルで簡単にカスタマイズできます。`app`ディレクトリのルートに配置するのが一般的です。

```tsx
// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>リクエストされたリソースが見つかりません</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
```

また、`next/navigation`からインポートできる`notFound()`関数をサーバーコンポーネント内で呼び出すことで、意図的に404ページを表示させることも可能です。例えば、動的ルートでデータが見つからなかった場合などに使用します。

```tsx
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/posts'

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getPostBySlug(slug);

  if (!post) {
    // postが見つからなければ404 ページを表示する
    notFound()
  }

  return <div>{post.title}</div>
}
```

## UI とスタイリングの導入

### 様々なスタイリング手段

Next.jsでは様々なスタイリング手法が利用できます。

- **Global CSS**: `app/globals.css`のように、アプリケーション全体に適用するスタイルです。
- **CSS Modules**: `[name].module.css`という形式のファイル。コンポーネントごとにスコープが限定されたスタイルを記述できます。
- **CSS-in-JS**: `styled-components`や`Emotion`など。サーバーコンポーネントとの互換性に注意が必要です。
- **Tailwind CSS**: `create-next-app`時に導入できる人気のCSSフレームワーク。ユーティリティクラスを使ってHTML内で直接スタイルを記述します。

### Global CSS

アプリ全体に共通するスタイル（リセットCSS、ベースカラー、フォント設定など）で、通常、`app/globals.css`を用意して、`app/layout.tsx`でインポートします。

```tsx
// app/layout.tsx
import './globals.css'

export default function RootLayout({ children }) {
  return <html><body>{children}</body></html>
}
```

特徴:
- 全ページで共有される。
- クラス名の衝突が起きやすいので、限定的に使う。
- Tailwind CSSも内部的にはこの仕組みを使っている。

### CSS Modules

特定コンポーネント専用のCSS。スコープが自動的に閉じているため安全。

```css
/* components/Button.module.css */
.button {
  background-color: blue;
  color: white;
  border-radius: 6px;
}
```

```tsx
// components/Button.tsx
import styles from './Button.module.css'

export function Button() {
  return <button className={styles.button}>Click</button>
}
```

特徴:
- クラス名がハッシュ化されて衝突しない。
- コンポーネント単位のスタイルに最適。
- シンプルかつNext.js標準サポート。

### CSS-in-JS

コンポーネントにスタイルを直接埋め込みたいとき、動的スタイルを扱いたいときに使えます。

```tsx
export default function Title({ color }) {
  return (
    <h1>
      Hello
      <style jsx>{`
        h1 {
          color: ${color};
        }
      `}</style>
    </h1>
  )
}
```

以下は外部ライブラリの`styled-components`を使う方法です。


```tsx
import styled from 'styled-components'

const Button = styled.button`
  background: ${({ primary }) => (primary ? 'blue' : 'gray')};
  color: white;
  border-radius: 6px;
`

export function App() {
  return <Button primary>Click</Button>
}
```

特徴:
- コンポーネントのロジックとスタイルをまとめられる。
- 変数や`props`に応じて動的にスタイル変更できる。
- パフォーマンスと構成が少し複雑になることも。

### Tailwind CSS

`create-next-app`でTailwind CSSを選択すると、必要な設定が自動で行われます。

1.  **導入**: `create-next-app`時に`Yes`を選択。
2.  **設定**: `tailwind.config.ts`と`postcss.config.js`が自動生成されます。
3.  **実用例**: コンポーネントの`className`にユーティリティクラスを記述してスタイリングします。

```tsx
// app/page.tsx
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-blue-500">
        Hello, Tailwind CSS!
      </h1>
    </main>
  );
}
```

Tailwind CSSでは`tailwind.config.ts`でテーマ（色、フォントサイズ、スペーシングなど）をカスタマイズできます。

```ts
// tailwind.config.ts
module.exports = {
  theme: {
    colors: {
      gray: colors.coolGray,
      blue: colors.lightBlue,
      red: colors.rose,
      pink: colors.fuchsia,
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  }
}
```

また、複数のユーティリティクラスをまとめるには、`@apply`ディレクティブをCSSファイル内で使用するか、コンポーネントを分割して再利用するなどの方法があります。

```css
/* 既存のユーティリティクラスを纏めて新しいクラスを作る */
.btn {
  @apply font-bold py-2 px-4 rounded;
}
.btn-blue {
  @apply bg-blue-500 hover:bg-blue-700 text-white;
}
```

## 画像・フォントの最適化

Next.jsは、Webサイトのパフォーマンスとユーザー体験を向上させるための、画像とフォントの最適化機能を標準で提供しています。

### `next/image` による画像最適化

従来の`<img>`タグの代わりにNext.jsでは`<Image>`コンポーネントが用意されています。`src`プロパティにはローカル画像、リモート画像を指定可能です。

```tsx
import Image from 'next/image'
 
export default function Page() {
  return <Image src="" alt="" />
}
```

`<Image>`コンポーネントを使用することで、以下のような最適化が自動的に行われます。

- **サイズ最適化**: デバイスの画面サイズに応じて、適切なサイズの画像を自動的に生成・配信します。
- **フォーマット最適化**: ブラウザが対応していれば、WebPのようなモダンな画像フォーマットに自動で変換し、ファイルサイズを削減します。
- **遅延読み込み (Lazy Loading)**: 画面外の画像は、ユーザーがスクロールしてビューポートに入るまで読み込みを遅らせ、初期表示を高速化します。
- **CLS (Cumulative Layout Shift) の防止**: 画像の表示領域を事前に確保するため、読み込み中にレイアウトがガタつくのを防ぎます。

ローカル画像を使用する場合は、`import`文を使って画像を直接インポートし、`src`プロパティに指定します。インポートした画像から自動的に`width`と`height`が設定され、レイアウトシフトを防止します。

```tsx
// app/page.tsx
import Image from 'next/image'
import profilePic from '../public/me.png'
 
export default function Page() {
  return (
    <Image
      src={profilePic}
      alt="Picture of the author"
      // widthとheightは自動で設定される
      // placeholder="blur" // ぼかし効果のプレースホルダーを追加可能
    />
  )
}
```

外部サーバーにあるリモート画像を表示する場合、`src`にURLを指定します。ビルド時にはリモート画像にアクセスできず、`width`、`height`は手動で設定する必要があります。

```tsx
import Image from 'next/image'
 
export default function Page() {
  return (
    <Image
      src="https://s3.amazonaws.com/my-bucket/profile.png"
      alt="著者の写真"
      width={500}
      height={500}
    />
  )
}
```

また、リモート画像を使用する場合は、セキュリティのため使用するドメインを`next.config.ts`に登録する必要があります。

```js
// next.config.ts
import { NextConfig } from 'next'
 
const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
        search: '',
      },
    ],
  },
}
 
export default config
```

### `next/font` によるフォント最適化

`next/font`は、Google Fontsやローカルフォントを効率的に読み込むための機能です。ビルド時にフォントファイルをダウンロードしてセルフホストするため、プライバシーとパフォーマンスが向上します。

Google Fontsの利用を利用する場合は、`next/font/google`から使いたいフォントをインポートし、`layout.tsx`などで適用します。

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'

// フォントのサブセットやウェイトなどを設定
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body>タグにclassNameを適用する */}
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

プロジェクト内のフォントファイルを使う場合は`next/font/local`を使用します。

```tsx
// app/layout.tsx
import localFont from 'next/font/local'

// フォントファイルを指定
const myFont = localFont({ src: './my-font.woff2' })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={myFont.className}>{children}</body>
    </html>
  )
}
```

## Route Handlers 

Pages Routerでは、クライアント側（ブラウザ）から`fetch`を使ってAPIにアクセスし、その中でデータベース操作などを行うのが一般的でした。

一方、App Routerでは サーバーコンポーネントの登場により、コンポーネント内で直接データベースにアクセスできるようになりました。これにより、API経由にせずともサーバーサイドでデータ取得を完結させることが可能です。

そのため、App RouterではAPI Routesは主に外部からのアクセス(他サービスやクライアントアプリからのリクエスト)に利用されるケースが多くなっています。

### app/api ディレクトリでのエンドポイント定義

`app`ディレクトリ内に`route.ts`ファイルを作成することで、APIエンドポイントを定義できます。フォルダ構造がそのままAPIのパスになります。

例えば、`app/api/users/route.ts`は`/api/users`というエンドポイントを作成します。

但し、同じ階層に`route.ts`と`page.ts`を同時に配置することはできません。

### HTTP メソッド対応、レスポンス構造

`route.ts`ファイル内では、`GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `HEAD`, `OPTIONS`の各HTTPメソッドに対応する名前の関数をエクスポートします。ここで定義した関数が、該当するルートに各種リクエストをした際の処理となります。

各関数は、引数として`NextRequest`オブジェクトを受け取り、レスポンスは`NextResponse`オブジェクトを使って生成します。

```ts
// app/api/hello/route.ts
import type { NextRequest, NextResponse } from 'next/server';
 
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello, World!' });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  return NextResponse.json({ received: data });
}
```

また、`context`オブジェクトを受け取り、動的ルートパラメータを受け取ることができます。

```ts
// app/api/posts/[slug]/route.ts
import type { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: RouteContext<'/posts/[slug]'>
){
  const { slug } = await context.params;
  return NextResponse.json({ slug });
}
```

クエリパラメータを含むリクエストの場合は、`request.nextUrl.searchParams`で取得できます。

```ts
// app/api/posts/route.ts
// GET /api/posts?query=hoge
import type { NextRequest, NextResponse } from 'next/server';
 
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = params.get('query');  // hogeとなる
  ...
}
```

フォームからのデータを取得するには`request.formData()`を使用します。

```ts
import type { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  return NextResponse.json({ name、email })
}
```

### クライアント側からAPIを叩く

作成したAPIは、クライアントコンポーネントから`fetch`を使って呼び出すことができます。

```tsx
"use client";

import { useEffect, useState } from 'react';

export default function UserProfile() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return <div>{data ? data.message : 'Loading...'}</div>;
}
```

## デプロイメント

### Vercel を使った自動デプロイ手順

Next.jsの開発元であるVercelは、最も簡単なデプロイ先です。

1. GitHub, GitLab, BitbucketのいずれかにNext.jsプロジェクトのリポジトリをプッシュします。
2. Vercelにサインアップし、アカウントをGitプロバイダーと連携します。
3. Vercelのダッシュボードから「Import Project」を選択し、デプロイしたいリポジトリを選びます。
4. フレームワークのプリセットとして「Next.js」が自動で選択されるので、そのまま「Deploy」ボタンをクリックします。

これだけでビルドとデプロイが自動的に実行されます。以降、メインブランチにプッシュするたびに本番環境へ自動でデプロイされます。

また、次の特徴があります。

- **環境変数**: APIキーなどの機密情報は、Vercelのプロジェクト設定画面から環境変数として登録します。
- **ビルド設定**: `next.config.mjs`での設定は、Vercelのビルドプロセスに自動で適用されます。
- **リソース制限**: Vercelのプランによって、サーバーレス関数の実行時間や帯域幅などに制限があります。

Vercel以外にも、Netlify, Cloudflare Pages, AWS Amplifyなど、多くのホスティングサービスがNext.jsのデプロイに対応しています。各サービスで設定方法は異なりますが、多くはGitリポジトリと連携した自動デプロイをサポートしています。