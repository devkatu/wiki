# gatsbyについてのメモ

## 導入

- `$ gatsby new`で新規作成。対話形式でオプションを選択していく
- `$ gatsby develop`でローカルサーバー立ち上げ
- `src/pages`にあるファイル名でルーティングが構成される
- 開発宙に変な挙動があれば`$ gatsby clean`するといいかも
- `$ gatsby develop -H xxx.xxx.xxx.xxx`でスマホ等の外部からアクセスできるようになる

## ページコンポーネント

- `/src/pages`フォルダーにあるpageコンポーネントからデフォルトエクスポートで`<body>`に入るコンテンツがエクスポートされる(普通のreactコンポーネント)。
- また、pageコンポーネントから、名前付きエクスポートで`Head`をエクスポートすると`<head>`内に入れる`<title></title>`とかのメタデータをページに追加できる。pageコンポーネントjsファイルのトップレベルでエクスポートしたほうがいいみたい

```
AboutPage = () => {
...
}

export const Head = () => <title>About Me</title>  // ここ
export default AboutPage
```

- `<Link>`を使うとサイト内のリンクができる。サイト外へのリンクは通常の`<a>`を使う。`to`でpagesフォルダ内のルートからのパスを指定するみたい

```
import * as React from 'react'
import { Link } from 'gatsby'

const IndexPage = () => {
return (
    <main>
    <h1>Welcome to my Gatsby site!</h1>
    <Link to="/about">About</Link>
    <p>I'm making this by following the Gatsby Tutorial.</p>
    </main>
)
}
```

- module.cssを使うと、cssファイル側で指定したクラス名がケバブケースの場合、自動的にjsファイルで使えるようにキャメルケースに直してくれる

## プラグイン

様々な機能を提供するプラグインが用意されている

- プラグインは[ここ](https://www.gatsbyjs.com/plugins)から検索できる
- プラグインを入れるときは
  1. 上記からほしいプラグインを探して、`npm install`
  2. `gatsby-config.js`ファイルに構成を記述する  

      ```javascript
      module.exports = {
        siteMetadata: {
          title: "My First Gatsby Site",
        },
        plugins: [
          "gatsby-plugin-image",
          "gatsby-plugin-sharp",
        ],
      };
      ```

  3. プラグインによっては下記のようにするものもある。プラグインのreadmeに大体書いてあるはず。`__dirname`はnode.jsの変数で、ディレクトリの絶対パスとなる。 

      ```javascript
      module.exports = {
        siteMetadata: {
          title: "My First Gatsby Site",
        },
        plugins: [
          "gatsby-plugin-image",
          "gatsby-plugin-sharp",
          {
            resolve: "gatsby-source-filesystem",
            options: {
              name: `blog`,
              path: `${__dirname}/blog`,
            }
          },
        ],
      };
      ```

## graphql

graphqlは色々なデータをソースプラグインからデータレイヤーに追加し、そのデータレイヤーからクエリを用いてデータを引き出す

- `http://localhost:8000/___graphql`でデータレイヤーを検索するデータクエリを作成できる。`graphiql`と呼ばれ、ここでデータクエリを作成して、ページクエリ等に使用することができる。
- クエリは自分で編集することもできるし、エクスプローラのペインをクリックしていき、アコーディオンを展開したり、チェックボックスを入れたりすると、勝手に作成されていく(下記の例では`gatsby-config.js`ファイルの`siteMetadata.title`を取ってくる)。尚、`MyQuery`が先頭に追加されているが、実際にページクエリ等に追加するときは、`MyQuery`を削除すること

```javascript
query MyQuery {
site {
    siteMetadata {
    title
    }
}
}
```

- クエリを実行すると、実行結果としてjsonが表示される
- 実際にコンポーネントでクエリを使用するときは、**ページコンポーネント(pagesフォルダに入っているコンポーネント)では`useStaticQuery`を使わず、コンポーネント外でクエリを投げる。** クエリで取得したデータは該当コンポーネントに`data`として渡されることとなる。この方法は`Head`方でも使うことができる。

  ```
  const HomePage = ({ data }) => {
    return (
      <p>
        {data.site.siteMetadata.description}
      </p>
    )
  }

  export const query = graphql`
    query {
      site {
        siteMetadata {
          description
        }
      }
    }
  `

  export const Head = ({data}) => <title>{data.site.siteMetadata.title}</title>
  export default HomePage
  ```

- **ページコンポーネント以外(ブロックコンポーネント)**で使用する時は`useStaticQuery`と`graphql`を使用する(`graphql`はその後ろにクエリをテンプレートリテラルで続けて書き、投げる)。
  ```
  // コンポーネント内でuseStaticQuery
  ...

    const data = useStaticQuery(graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `)

  ...

  <h1>{data.site.siteMetadata.title}</h1>
  ```
- コンテンツ以外の周囲の要素は`src/components/layout.js`に`Layout`コンポーネントに纏められ、`props.children`にて表示するように纏めていた
- `<head>`に使用するようなものも色々使いまわすので`Seo`コンポーネントに纏められていた

## gatsby-source-filesystem

`gatsby-source-filesystem`はgraphqlのデータレイヤーにfileノードを作成する。これにより、graphqlクエリで`file`,`allFile`フィールドを指定できるようになる。

- 一旦プロジェクトトップに`blog`フォルダーを作り、そこにmdxファイルを作成して記事とする(mdxはマークダウンの拡張したもの)
- `blog`フォルダーのファイル名を取得するために、`gatsby-source-filesystem`をインストールする。(このプラグインだけではファイル内容を取得したりできない)

  ```
  $ npm install gatsby-source-filesystem
  ```

- `gatsby-source-filesystem`使用するときに、`gatsby-config.js`のpluginに以下のように設定する。`name`はgraphqlクエリを作成するときに使用、`path`はファイル操作する対象のディレクトリパスを設定し、データレイヤーに追加することができる。

  ```javascript
  // gatsby-config.js抜粋
  ...
  {
    resolve: "gatsby-source-filesystem",
    options: {
      name: `blog`,
      path: `${__dirname}/blog`,
    }
  },
  ...
  ```
  次のようなクエリを投げると、
  ```
  query MyQuery {
    allFile {
      nodes {
        name
      }
    }
  }
  ```

  帰ってくるJSONは次のような感じ。上の`gatsby-config.js`ファイルのオプションで指定したディレクトリのファイル名が`name`プロパティを持つオブジェクト配列で取得できる

  ```javascript
  {
    "data": {
      "allFile": {
        "nodes": [
          {
            "name": "my-first-post"   // 
          },
          {
            "name": "another-post"
          },
          {
            "name": "yet-another-post"
          }
        ]
      }
    }
  }
  ```

- なお、`gatsby-config.js`で`options.name`に設定したものは`sourceInstanceName`の各フィールドに設定され、クエリに次のようなフィルターをかけることができる。

  ```
  query {
    allFile(filter: {sourceInstanceName: {eq: "blog"}}) {
      nodes {
        name
      }
    }
  }
  ```

## gatsby-plugin-mdx

`gatsby-source-filesystem`はgraphqlのデータレイヤーにfileノードを作成し、`gatsby-plugin-mdx`はそのfileノードをMDXノードに変換する。これにより、graphqlクエリの`allMdx`,`mdx`のフィールドが指定できるようになる。

- ブログ内容を取得するために`gatsby-plugin-mdx`とその依存関係をインストール。

  ```
  $ npm install gatsby-plugin-mdx @mdx-js/react
  ```

- `gatsby-config.js`の`plugin`にも記述を追加しておく

  ```
  module.exports = {
    siteMetadata: {
      title: `KatuDevBlog`,
      siteUrl: `https://www.yourdomain.tld`
    },
    plugins: [
      ...
      "gatsby-plugin-mdx",
      ...
    ]
  };
  ```

- 次のクエリを投げる。
  - frontmatter(ファイルのメタデータ)から日付を形式指定で、及びタイトルを取得する。
  - IDは後で要素をイテレートするときにkeyとして使用する
  - excerptは投稿コンテンツのプレビュー(bodyだと生のmdをとってくる)

  ```
  query MyQuery {
    allMdx(sort: { frontmatter: { date: DESC } }) {
      nodes {
        frontmatter {
          date(formatString: "MMMM D, YYYY")
          title
        }
        id
        excerpt
      }
    }
  }
  ```

  次のようなJSONが返ってくる

  ```
  {
    "data": {
      "allMdx": {
        "nodes": [
          {
            "frontmatter": {
              "date": "July 23, 2021",
              "title": "My First Post"
            },
            "id": "55047615-7f9e-5d68-abcd-66711602ddbd",
            "excerpt": "This is my first blog post! Isn't it great? Some of my favorite things are:\n\nPetting dogsSingingEating potato-based foods"
          },
          {
            "frontmatter": {
              "date": "July 24, 2021",
              "title": "Another Post"
            },
            "id": "0e3e4ec2-5262-543e-811d-c6f26d9772a4",
            "excerpt": "Here's another post! It's even better than the first one!"
          }
        ]
      }
    },
    "extensions": {}
  }
  ```

- ちなみに、fileノードからMDXノードを作成してアクセスできるようになるが、クエリに`parent`フィールドを指定すると、変換元のfileノードと一緒に使用することができる。次のクエリで元のファイルの更新時刻を取得することができる。

  ```
  query MyQuery {
    allMdx {
      nodes {
        parent {
          ... on File {
            modifiedTime(formatString: "MMMM D, YYYY")
          }
        }
      }
    }
  }
  ```

- ページコンポーネントで`graphql`でMDXノード配列を読みだし、mapして表示する。

  ```
  const Blog = ({ data }) => {
    return (
      <Layout pageTitle="post list">
        {
          data.allMdx.nodes.map(node => 
            <article key={node.id}>
              <h2>{node.frontmatter.title}</h2>
              <p>post: {node.frontmatter.date}</p>
              <p>{node.excerpt}</p>
            </article>
          )
        }
      </Layout>
    )
  }

  export const query = graphql`
  query {
    allMdx(sort: { frontmatter: { date: DESC }}) {
      nodes {
        frontmatter {
          date(formatString: "MMMM D, YYYY")
          title
        }
        id
        excerpt
      }
    }
  }
  `

  export const Head = () => <Seo title="my blog page post" />

  export default Blog;
  ```

## MDXについて

- mdxはマークダウンの拡張でfrontmatterなる、ファイルのメタデータが追加できる。mdxファイルの先頭に`---`で囲んだ部分を作りそこに投稿日時とかを記述できる。

```
---
name: "Fun Facts about Red Pandas"
datePublished: "2021-07-12"
author: "1 Red Panda Fan"
---
```

- なお、mdxに機能追加するのに便利なプラグインが`gatsby-remark-`で始まるパッケージに色々ある(remarkはMDXを解釈するパーサーらしい)
  - `gatsby-remark-images` :レスポンシブ画像を使える
  - `gatsby-remark-prismjs` :コードブロックに構文の強調を使える
  - `gatsby-remark-autolink-headers` :コンテンツのすべてのヘッダへのリンクを生成
- MDXにはJSXコンポーネント次のようにをインポートすることもできる。frontmatterを先頭に書き、その後にimportを書くこと。

```
---
title: Importing Components Example
---

import { Message } from "theme-ui"

You can import your own components.

<Message>MDX gives you JSX in Markdown!</Message>
```

## ファイルシステムルートAPI

ページコンポーネントをテンプレートとして動的なルートを作ることができる。

- `src/pages/`ディレクトリに`{nodeType.field}.js`のような命名規則のコンポーネントを作成すると、動的なルートを作ることができる
- `{}`をつけるのを忘れずに。`nodeType`でノードの種類を`field`でノードの中のどのフィールドをルート(URL)にするのかを決定する
- `MDX`ノードの`slug`を動的ルートにする場合は、`src/pages`内に`{mdx.frontmatter__slug}.js`という名前のファイルを作成する
- SEO的には`src/pages`ディレクトリに`blog`フォルダーを作成して、その中に、`index`と`{nodeType.field}.js`を作成して、全ての投稿が`blog/`から始まるようにすると良いみたい
- 開発中に404ページにアクセスすると今までのファイルシステムルートを含む全てのページが表示される

## gatsby-node.js

`src/pages`下でのルーティング、ファイルシステムルートAPIの他に、`gatsby-node.js`ファイル内での`createPages`関数を使う事でも、ルーティングが可能となる。これを使うと、`pageContext`を介してデータを渡したり、パスを変更する等の特別な制御ができる。ファイルシステムルートAPIは最近追加された機能で、以前はこっちで動的なルートを作成していたみたい。基本はファイルシステムルートAPIでよさそうだけど、そのうち使いたくなるかも？？

```javascript
// gatsby-node.js
exports.createPages = async function ({ actions, graphql }) {
  const { data } = await graphql(`
    query {
      allMarkdownRemark {
        nodes {
          fields {
            slug
          }
        }
      }
    }
  `)
  data.allMarkdownRemark.nodes.forEach(node => {
    const slug = node.fields.slug
    actions.createPage({
      path: slug,
      component: require.resolve(`./src/templates/blog-post.js`),
      context: { slug: slug },
    })
  })
}
```

## クエリ変数
graphqlクエリに変数を導入することができる。これはページコンポーネントの中でのみ使用でき、ブロックコンポーネントでの`useStaticQuery`フックとは併用できない。

- クエリテンプレートの中で、変数の先頭に`$`をつけるとクエリ変数となる
- `graphiql`でクエリ変数を渡すときは変数名をキー、変数の値を設定したJSONをクエリ編集ペイン下部のVariablesのところに記述する。下記例では`$slug`としてクエリ変数が使用できる

  ```javascript
  {
    "slug": "another-post"
  }
  ```
  上記クエリ変数を設定した状態で以下のようにクエリを投げる
  ```
  query MyQuery($slug: String) {
    mdx(frontmatter: { slug: { eq: $slug } }) {
      frontmatter {
        title
      }
    }
  }
  ```
  `slug`が`another-post`のものが帰ってくる
  ```
  {
    "data": {
      "mdx": {
        "frontmatter": {
          "title": "Another Post"
        }
      }
    },
    "extensions": {}
  }
  ```

- ファイルシステムルートAPIを使用していると、次のpropsが**自動的に追加**され、クエリ変数として使えるようになる
  - ページ作成に使われるノードの`id`
  - ルートの動的部分を作成するために使用したフィールド。`{nodeType.field}.js`の`field`の部分
- ページで使用できるようにすると以下のような感じ。前述通り`id`は自動的に使える。`MDX`ノードのファイルシステムルートAPIにて渡された`id`を用いて、`title`と`date`を持ってくるクエリを作成している。

  ```
  // src/pages/blog/{mdx.frontmatter__slug}.js
  import * as React from 'react'
  import { graphql } from 'gatsby'
  import Layout from '../../components/layout'
  import Seo from '../../components/seo'

  const BlogPost = ({ data, children }) => {
    return (
      <Layout pageTitle={data.mdx.frontmatter.title}>
        <p>{data.mdx.frontmatter.date}</p>
        {children}
      </Layout>
    )
  }

  export const query = graphql`
    query ($id: String) {
      mdx(id: {eq: $id}) {
        frontmatter {
          title
          date(formatString: "MMMM D, YYYY")
        }
      }
    }
  `

  export const Head = ({ data }) => <Seo title={data.mdx.frontmatter.title} />

  export default BlogPost
  ```

- 各ブログ記事へのリンクは`src/pages/blog/index.js`にて以下のように。すべてのMDXノードを`frontmatter`の`date`降順で、`date`,`title`,`slug`,`id`をでとりだすクエリとなっている。
- `slug`でリンクを作る→ファイルシステムルートAPIで作られた動的ルート`/blog/各記事`へルーティングされる→ルーティングされるとき、該当のMDXノードの`id`が一緒に記事コンポーネントに渡され、記事コンポーネントにて該当のMDXノードの内容を読み出すことができる。

  ```
  import * as React from 'react'
  import { Link, graphql } from 'gatsby'
  import Layout from '../../components/layout'
  import Seo from '../../components/seo'

  const BlogPage = ({ data }) => {
    return (
      <Layout pageTitle="My Blog Posts">
        {
          data.allMdx.nodes.map(node => (
            <article key={node.id}>
              <h2>
                <Link to={`/blog/${node.frontmatter.slug}`}>
                  {node.frontmatter.title}
                </Link>
              </h2>
              <p>Posted: {node.frontmatter.date}</p>
            </article>
          ))
        }
      </Layout>
    )
  }

  export const query = graphql`
    query {
      allMdx(sort: { frontmatter: { date: DESC }}) {
        nodes {
          frontmatter {
            date(formatString: "MMMM D, YYYY")
            title
            slug
          }
          id
        }
      }
    }
  `

  export const Head = () => <Seo title="My Blog Posts" />

  export default BlogPage
  ```

## 動的画像
ブログ投稿にヒーローイメージを追加したい場合など、動的(画像ソースがpropsとして渡される場合とか)に画像を挿入したい場合に`GatsbyImage`を使う事ができる。静的な画像ソースとしては`StaticImage`が適している。  

例としてブログ記事の各MDXのfrontmatterにヒーローイメージ画像のパスを追加し、記事ページからfrontmatterを読出して、imageのパスに設定する。  

`gatsby-transformer-sharp`を使用すと、これにより、`gatsby-source-filesystem`によって作られたfileノードから、imagesharpノードを作りだす。`GatsbyImage`コンポーネントで使う事ができる。

- `gatsby-transformer-sharp`をインストール

  ```
  npm install gatsby-transformer-sharp
  ```
  `gatsby-config.js`にプラグイン構成を記述
  ```
  module.exports = {
    siteMetadata: {
      title: "My First Gatsby Site",
    },
    plugins: [
      // ...existing plugins
      "gatsby-plugin-sharp",
      "gatsby-transformer-sharp",
    ],
  }
  ```

- `/blog`フォルダー内の各MDX記事ファイルを、それぞれの記事毎にフォルダーを作成し、記事ファイルの名前に変更し、もとのMDXファイルを`index.mdx`にリネーム、同じフォルダにヒーローイメージ用画像を入れておく
- 各`/blog/{article}/index.mdx`のfrontmatterに`hero_image`,`hero_image_alt`,`hero_image_credit_text`,`hero_image_credit_link`の各フィールドを追加する。

```
---
title: "Another Post"
date: "2021-07-24"
slug: "another-post"
hero_image: "./anthony-duran-eLUBGqKGdE4-unsplash.jpg"
hero_image_alt: "A grey and white pitbull wading happily in a pool"
hero_image_credit_text: "Anthony Duran"
hero_image_credit_link: "https://unsplash.com/photos/eLUBGqKGdE4"
---
...
```

- 設定したfrontmatterを読み出すクエリを作成。なお、frontmatterで任意のフィールドを追加でき、その値はgraphqlのスキーマを作成する際に推論される。

```
query ($id: String) {
mdx(id: {eq: $id}) {
    frontmatter {
    title
    date(formatString: "MMMM D, YYYY")
    hero_image_alt
    hero_image_credit_link
    hero_image_credit_text
    hero_image {
        childImageSharp {
        gatsbyImageData
        }
    }
    }
}
}
```

  次のようなJSONが返ってくる。`hero_image`には画像パス含むいろいろ入っているので省略

```
{
"data": {
    "mdx": {
    "frontmatter": {
        "title": "My First Post",
        "date": "July 23, 2021",
        "hero_image_alt": "A gray pitbull relaxing on the sidewalk with its tongue hanging out",
        "hero_image_credit_link": "https://unsplash.com/photos/ocZ-_Y7-Ptg",
        "hero_image_credit_text": "Christopher Ayme",
        "hero_image": {
        ...
        }
    }
    }
},
"extensions": {}
}
```

- ブログ記事ページにコードを追加する  
  `getImage`は引数に
  `data.mdx.frontmatter.hero_image.childImageSharp.gatsbyImageDate`と書かなくて良くなるヘルパー関数

```
// src/pages/blog/{mdx.frontmatter__slug}.js
import * as React from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import Layout from '../../components/layout'
import Seo from '../../components/seo'

const BlogPost = ({ data, children }) => {
const image = getImage(data.mdx.frontmatter.hero_image)
return (
    <Layout pageTitle={data.mdx.frontmatter.title}>
    <p>Posted: {data.mdx.frontmatter.date}</p>
    <GatsbyImage
        image={image}
        alt={data.mdx.frontmatter.hero_image_alt}
    />
    <p>
        Photo Credit:{" "}
        <a href={data.mdx.frontmatter.hero_image_credit_link}>
        {data.mdx.frontmatter.hero_image_credit_text}
        </a>
    </p>
    {children}
    </Layout>
)
}

export const query = graphql`
query($id: String) {
    mdx(id: {eq: $id}) {
    frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        hero_image_alt
        hero_image_credit_link
        hero_image_credit_text
        hero_image {
        childImageSharp {
            gatsbyImageData
        }
        }
    }
    }
}
`

export const Head = ({ data }) => <Seo title={data.mdx.frontmatter.title} />

export default BlogPost
```

## ほしい機能

- [x] マークダウンで書きたい
  `gatsby-transformer-remark`  
  mdxなら`gatsby-plugin-mdx`
- [x] タグ  
  - 入ってた。もしやるならfrontmatterにタグを付けて記事一覧ページで読み出したりする
- [x] レスポンシブ、ハンバーガー
  - 入ってた
- [x] 画像をいい感じに
  - 入ってた
  - `gatsby-transformer-sharp`
  - `gatsby-plugin-sharp`
- [x] シンタックスハイライト
  - `gatsby-gatsby-remark-prismjs` 入れてok
  - `gatsby-remark-vscode`もあったけどなんかいまいちだった
- [x] SNS共有 
  - `react-share`入れた
- [x] SEO、OGPタグ生成
  -  `gatsby-plugin-react-helmet` `react-helmet`が入ってた
  - [x] 内容確認ogpタグ少し追加
- [x] 目次  タグと似たような感じでできるかな`toc`ある
  - `gatsby-remark-table-of-contents`入れた
  - [x] あとスタイリングどうするかな
- [x] コードコピーのスタイリング
- [x] リストとか各スタイルの見直し
- [x] 記事の余白もっと撮りたい
- [x] レイアウトとして右側にプロフとか入れときたい
  - [x] プロフ下にposition: sticky;な目次もいれたい
  - [x] カテゴリ―追加したのでリンクを作成
  - [x] レスポンシブ化する
    - [x] ハンバーガーメニューないへ目次実装中
  - [ ] asideリファクタリング(ちゃんとtypescriptにする)
- [x] 他記事へのリンクをカードで表示
  - 自分で実装したほうがよさげ？外部へのリンクを貼るなら別にいらないけど内部リンクで記事見てほしいのでクエリで画像取り出して自分でカード実装する。記事の関連リンクでも使いたいがコンポーネント化できる？
  - remark-link-beautifyを追加した。[$card](リンクするURL)だけでOK
- 強調する感じのリストデザインほしい
- [x] twitterの投稿表示
  - 埋め込みコードをサイトから取得して、scriptタグを削除してOK
- [x] netlifyへのデプロイ`gatsby-plugin-netlify`
- [x] OGPタグがちゃんと設定されていないかも。デプロイしたら確認する
- [ ] SEOについてまだなんかあるはず
  - [ ] robot.txtは一旦インデックスしないようにconfigで設定している
  - [ ] metaデータをちゃんと直す事。サイトurlとかutteranceとか
  - [ ] ドメインちゃんとしたのにする
- [x] グーグルアナリティクス`gatsby-plugin-google-gtag`
- [ ] アフィリエイト追加
  - [ ] アフィリエイトやってる旨ブログ免責事項とか追加

**ここのやることメモはupnoteへ移行済み**
