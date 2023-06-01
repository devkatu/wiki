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

##  アセットのインポート

静的な画像ファイル等のインポートにはwebpackのインポートが使える。

画像ファイルをインポートすると、バンドル後の最終的なパスが返ってくるのでそれを`src`に指定する。

なお、10000バイト未満の画像の場合はbase64データuriが返ってくる。

```
import React from "react"
import logo from "./logo.png" // Tell webpack this JS file uses this image

console.log(logo) // /logo.84287d09.png

function Header() {
  // Import result is the URL of your image
  return <img src={logo} alt="Logo" />
}

export default Header
```

CSSでも同様。

```css
.Logo {
  background-image: url(./logo.png);
}
```

## `static`フォルダー

プロジェクトのルートに`static`フォルダーを作ると、その中に入れたファイルはビルド後に、`public`フォルダーにそのままコピーされる。

`static/sun.jpg`は`public/sun.jpg`にコピーされる。

基本的には画像はコンポーネントからインポートした方がバンドルされてネットワーク要求が減るので良い。

## グローバルCSS

グローバルCSSの適用方法には次の二通りある。

### レイアウトコンポーネントを使用する

コンテンツをラップするレイアウトコンポーネントを作成して、そこでグローバルにするCSSファイルをインポートする。

`layout.css`

```css
div {
  background: red;
  color: white;
}
```

`layout.js`

```
import React from "react"
import "./layout.css"

export default function Layout({ children }) {
  return <div>{children}</div>
}
```

`index.js`

```
import React from "react"
import Layout from "../components/layout"

export default function Home() {
  return <Layout>Hello world!</Layout>
}
```

### `gatsby-browser.js`を使用する

`gatsby-browser.js`ファイル内で、CSSファイルをインポートしてもOKです。

`global.css`

```css
html {
  background-color: peachpuff;
}

a {
  color: rebeccapurple;
}
```

`gatsby-browser.js`

```
import "./src/styles/global.css"

// or:
// require('./src/styles/global.css')
```

## コンポーネントレベルのCSS

コンポーネントレベルでのCSSにはCSSモジュールを使用することが推奨されている。

`container.module.css`

```css
.container {
  margin: 3rem auto;
  max-width: 600px;
}
```

`container.js`

```
import React from "react"
import * as containerStyles from "./container.module.css"

export default function Container({ children }) {
  return <div className={containerStyles.container}>{children}</div>
}
```

## ブログ作成時に欲しかった機能と各実装

結論、`gatsby-starter-apple`スターターが一番見た目が好みだったのと、欲しい機能がほとんど入っていたのでそれにした。

以下、欲しい機能とスターターの実装について。

### マークダウンで書きたい

`gatsby-transformer-remark`が入ってた。

mdxなら`gatsby-plugin-mdx`を使う。

### タグ、カテゴリを付けたい

入ってた。

`frontmatter`にカテゴリを書くと、TOPページでカテゴリフィルターができる。

タグ機能は無いけど、これも`frontmatter`にタグを書いて記事一覧ページで読み出したりすることで対応できそう。

### レスポンシブである

対応済みだった。

### 画像をいい感じに表示してほしい

入ってた。

`gatsby-remark-images`、`gatsby-transformer-sharp`、`gatsby-plugin-sharp`、`gatsby-plugin-image`が入っている。

画像圧縮してくれる、いい感じに表示してくれる、マークダウンから相対パスで指定しても表示してくれる。

### コードブロックのシンタックスハイライト

`gatsby-remark-vscode`が入っていたけど、イマイチだったので`gatsby-remark-prismjs`を入れた。

`gatsby-config.js`にプラグインを追加

```javascript
plugins: [
  {
    resolve: "gatsby-transformer-remark",
    options: {
      plugins: [
        {
          resolve: 'gatsby-remark-prismjs',
          options: {
            classPrefix: "language-",
            inlineCodeMarker: null,
            aliases: {},
            showLineNumbers: false,
            noInlineHighlight: false,
          }
        },
      ]
    }
  }
]
```

`gatsby-browser.js`にて次のCSSを読込

テーマは[ここ](https://github.com/PrismJS/prism/tree/1d5047df37aacc900f8270b1c6215028f6988eb1/themes)から選択でき、デモは[ここ](https://prismjs.com/)で見られる。

コマンドラインのハイライトや行番号を追加したい場合は追加でCSSを読込む。

```javascript
require("prismjs/themes/prism-tomorrow.css")
require("prismjs/plugins/line-numbers/prism-line-numbers.css")  // 行番号用のCSS
require("prismjs/plugins/command-line/prism-command-line.css")  // コマンドライン用CSS
```

通常通りマークダウンでコードブロックを書くと、テーマが適用された状態となる。

使用する言語の後に次のようにオプションを追加すると、行番号が追加となる。

````
```javascript{numberLines: true}
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        `gatsby-remark-prismjs`,
      ]
    }
  }
]
```
````

行を指定してハイライトしたい場合は次。

````
```javascript{1,5-7}
plugins: [  // ココと
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [                    // ココ
        `gatsby-remark-prismjs`,    // ココ
      ]                             // ココがハイライトされる
    }
  }
]
```
````

差分の表示をしたい場合は、言語指定の前に`diff-`を付けて、ブロック内で追加の行に`+`、削除する行の頭に`-`を付ける。

````
```diff-css
/* PC版のCSS(省略) */

@media screen and (max-width: 768px) {

  /* ヘッダーのCSS(省略) */
  
  .hero {
+    height: 50vw;
-    height: 50px;
  }
  .hero_txt {
    font-size: 4vw;
  }

}
```
````

行ハイライトのスタイルを変えたい場合は`.gatsby-highlight-code-line`を使用できる。

```css
// prism 行強調
.gatsby-highlight-code-line {
  background-color: #5c3f2f;
  display: block;
  margin-right: -1em;
  margin-left: -1em;
  padding-right: 1em;
  padding-left: 0.75em;
  border-left: 0.25em solid var(--color-accent);
}
```

適宜スタイルを調整

```css
// prism コードブロック
pre[class*="language-"] {
  border-radius: 5px;
  margin-bottom: var(--sizing-md);
}

// prism インラインコード
*:not(pre) > code[class*="language-"] {
  padding: 0.1em 0.3em;
  margin: 0 0.1em;
}
```

### コードブロックのコピー

`gatsby-remark-code-buttons`を入れた。

`gatsby-config.js`に下記のようにプラグイン追加。

```javascript
plugins: [
  {
    resolve: 'gatsby-transformer-remark',
    options: {
      plugins: [
        {
          resolve: 'gatsby-remark-code-buttons',
          options: {
            toasterText: 'コピーしました',
            tooltipText: `コピー`,
          },
        }
      ]
    }
  }
]
```

コードコピーしたときのトーストメッセージとコピーするボタンのスタイルは下記で調整。

```css
// コードコピーボタン
// グローバルで読込まないとスタイル適用されなかった…
.gatsby-code-button-toaster-text {
  width: initial;
  display: inline-block;
  border-radius: 10px;
  color: black;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  background-color: var(--color-gray-0);
  border: 1px solid black;
}
// コードコピーボタン
.gatsby-code-button-container {
  top: 40px;
  margin-right: 5px;
  fill: #eee;
  z-index: initial;
  margin-top: -30px;
}
.gatsby-code-button:after{
  font-size: 0.7rem;
}
```

### SNS共有したい

`react-share`を入れた

ページコンポーネントにて下記をインポート

```javascript
import {
  FacebookIcon,
  FacebookShareButton,
  LineIcon,
  LineShareButton,
  TwitterIcon,
  TwitterShareButton
} from "react-share"
```

`<~Button>`コンポーネントには`url`にてシェアしたいページのURLを指定する。

コンテンツとなる`<~Icon>`には`size`を指定し、`round`を指定すると、アイコンが丸く表示される。

```
<ShareButtonsWrapper>
  <ButtonWrapper>
    <FacebookShareButton url={url}>
      <FacebookIcon size={40} round />
    </FacebookShareButton>
  </ButtonWrapper>
  <ButtonWrapper>
    <LineShareButton url={url}>
      <LineIcon size={40} round />
    </LineShareButton>
  </ButtonWrapper>
  <ButtonWrapper>
    <TwitterShareButton url={url}>
      <TwitterIcon size={40} round />
    </TwitterShareButton>
  </ButtonWrapper>
</ShareButtonsWrapper>
```

### SEO対策したい

`gatsby-plugin-react-helmet`、`react-helmet`が入ってた。

`gatsby-plugin-react-helmet`は`react-helmet`をgatsbyでいい感じに使うためのものみたい。

`react-helemet`は下記のような感じ。最初からある程度いい感じになっていたけど、ogp画像とかcanonicalがいまいちだったので少し手を加えた。

```
import { Helmet } from "react-helmet"

<Helmet
  htmlAttributes={{ lang: site.lang ?? DEFAULT_LANG, prefix: "og: https://ogp.me/ns#" }}
  title={title ?? ""}
  titleTemplate={`%s | ${site.title}`}
  meta={
    [
      {
        name: "description",
        content: description,
      },
      {
        property: "og:title",
        content: title,
      },
      {
        property: "og:description",
        content: description,
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: url
      },
      {
        property: "og:site_name",
        content: siteName
      },
      {
        name: "twitter:card",
        content: "summary",
      },
      {
        name: "twitter:creator",
        content: site.author,
      },
      {
        name: "twitter:title",
        content: title,
      },
      {
        name: "twitter:description",
        content: description,
      },
      {
        property: "image",
        content: ogImageUrl,
      },
      {
        property: "og:image",
        content: ogImageUrl,
      },
      {
        property: "twitter:image",
        content: ogImageUrl,
      },
    ] as Meta
  }
// />
>
  <link rel="canonical" href={url} />
  {/* Adsense用 */}
  {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3835035638508936" crossorigin="anonymous"></script> */}
</Helmet>
  ```

### 目次つけたい

`gatsby-remark-table-of-contents`入れた。リンク生成の為に予め`gatsby-remark-autolink-headers`も必要。

```javascript
plugins: [
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          resolve: `gatsby-remark-table-of-contents`,
          options: {
            exclude: "Table of Contents",
            tight: false,
            ordered: false,
            fromHeading: 1,
            toHeading: 6,
            className: "table-of-contents"
          },
        },
        `gatsby-remark-autolink-headers`
      ],
    },
  },
],
```

目次のスタイルは下記で調整。

```css
// 目次 
.table-of-contents{
  border-top: 3px solid var(--color-accent);
  border-radius: var(--sizing-xs);
  padding: 1.45rem;
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 15%);
  background-color: var(--color-gray-0);
  margin-bottom: var(--sizing-lg);
}
.table-of-contents::before{
  font-family: "Material Icons";
  font-size: 1.4rem;
  content: "toc 目次";
  border-bottom: 1px solid var(--color-gray-3);
  display: block;
  padding-bottom: var(--sizing-sm);
  text-align: center;
}
.table-of-contents>ol, .table-of-contents>ul{
  margin-bottom: 0;
}
.table-of-contents ol, .table-of-contents ul{
  list-style: revert;
}  
.table-of-contents>ol>li>p>a, .table-of-contents>ul>li>p>a{
  font-weight: var(--font-weight-bold);
}
.table-of-contents a{
  color: var(--color-text);
}
```

マークダウン中に下記を追加すると、マークダウンファイルの見出しを抽出して、目次ブロックに変換してくれる。

````
```toc
exclude: Table of Contents
from-heading: 2
to-heading: 6
```
````

上記で`<h2>`~`<h6>`要素までを目次にしてくれる。

### PC表示では記事の右側にプロフィールとかを入れたい

`<aside>`でプロフィール、記事のカテゴリ、目次を作成。

目次については`graphql`で`edges.node.tableOfContents`で目次を取り出せたのでそれを追加。

### 他記事へのリンクをカードで表示したい

`remark-link-beautify`を入れた。

`gatsby-config.js`にてプラグイン追加。リンクをツールチップ的に表示できる機能もあるが要らないのでオプション指定。

```javascript
plugins: [
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          resolve: "gatsby-remark-link-beautify",
          options: {
            enableLinkPreview: false,
          },
        },
      ],
    },
  },
];
```

`gatsby-browser.js`にてカード用のCSSを読込む。

```javascript
import 'gatsby-remark-link-beautify/themes/notion.css';
```

マークダウンにて以下のようにリンクを作成すると、カードで表示してくれる。

```
[$card](https://github.com/gatsbyjs/gatsby/)
```

### twitterの投稿を表示したい

`gatsby-plugin-twitter`を入れた。

`gatsby-config.js`にて

```javascript
plugins: [`gatsby-plugin-twitter`]
```

あとは埋め込みコードをサイトから取得して、scriptタグを削除し、blockquoteセクションのみをマークダウンに張り付けてOK

### netlifyで自動デプロイしたい

`gatsby-plugin-netlify`を入れた。

`gatsby-config.js`にて

```javascript
plugins: [`gatsby-plugin-netlify`]
```

### グーグルアナリティクスを使いたい

`gatsby-plugin-google-gtag`を入れた。

Google Analyticsで測定IDを取得しておいて、`gatsby-config.js`にて下記のように指定するのみ。

あとはオプション色々あるけどデフォルトのまま…

```
  {
    resolve: "gatsby-plugin-google-gtag",
    options: {
      trackingIds: ["X-XXXXXXXXXX"],  // 控えておいた、測定IDを記載します。
      pluginConfig: {
        head: true  // headタグに記載されるようにコンフィグを設定します。
      }
    }
  },
```

### 記事へのコメント欄が欲しい

そもそもフロントのフレームワークなのでコメント機能は困難だけど、utteranceというものが入ってた。

新しいgithubレポジトリを作って、そこにgithubappのutteranceをインストールして、コメントするとそこのレポジトリに記録されていくようになっていた。

あとは`gatsby-config.js`でレポジトリのURLを入れるだけになっていた。

### codepenのコードを貼り付けたい

`@weknow/gatsby-remark-codepen`を入れた。

`gatsby-config.js`にて

```javascript
plugins: [
  {
    resolve: "gatsby-transformer-remark",
    options: {
      plugins: [
        {
          resolve: "@weknow/gatsby-remark-codepen",
          options: {
            theme: "dark",
            height: 400
          }
        }
      ]
    }
  }
];
```

として、マークダウン内でURLを埋め込むだけ。

