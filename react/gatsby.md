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

### google-font使いたい

`gatsby-config.js`にプラグインを追加

```
plugins: [
  {
    resolve: "gatsby-plugin-google-fonts",
    options: {
      fonts: [
        "Inter",
        "material icons",
        "roboto: 300,400,500,700"
      ]
    }
  }
]
```

これで使えるようになるので、`<body>`に`font-family`を追加する。

また、アイコンは、`className="material-icons"`とし、使いたいアイコンを[ここ](https://fonts.google.com/icons)から探してしていする。

```
<div className="material-icons">edit</div>
```

cssからも次のようにすると使える。

```css
.table-of-contents::before{
  font-family: "Material Icons";
  font-size: 1.4rem;
  content: "toc 目次";
  display: block;
}
```

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

### HEADを弄りたい

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

ブランチ切ったら、プレビュービルド※記事の追加くらいなら開発環境だけで良いが、その他の変更の場合はあると便利かも

* netlify上で `Settings` > `Build & deploy` > `Deploy contexts` > `Branch deploys` の `Let me add individual branches` へデプロイしたいブランチを指定 `staging`等
* 指定したブランチ名に`push`するとビルドが行われ、`staging--マスター`のurlへデプロイが行われる
* stagingブランチをビルドデプロイするように追加している

### グーグルアナリティクスを使いたい

`gatsby-plugin-google-gtag`を入れた。

Google Analyticsで測定IDを取得しておいて、`gatsby-config.js`にて下記のように指定するのみで、自動的にアナリティクスタグが埋め込まれる。

あとはオプション色々あるけどデフォルトのまま…

```
plugins: [
  {
    resolve: "gatsby-plugin-google-gtag",
    options: {
      trackingIds: ["X-XXXXXXXXXX"],  // 控えておいた、測定IDを記載します。
      pluginConfig: {
        head: true  // headタグに記載されるようにコンフィグを設定します。
      }
    }
  },
]
```

プライバシーポリシー、免責事項も追加している。

### Adsenseをいれたい

`@isamrish/gatsby-plugin-google-adsense`を入れた。

アドセンスのアカウントを作ってから、IDを取得し、`gatsby-config.js`にて下記のようにプラグイン追加。

```
plugins: [
  {
    resolve: '@isamrish/gatsby-plugin-google-adsense',
    options: {
      googleAdClientId: 'pub-xxxxxxxxxxxxxxxx',
    }
  }
]
```

このあと、審査を申し込み。

審査が終わったら自動広告を開始すればOK…のハズだったけど、表示されず。

Adsenseコンポーネントを作成して追加した。

```
import React, { useEffect } from 'react'

const Adsense = ({path}) => {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  }, [path])

  return (
    <ins
      className="adsbygoogle"
      style={{ "display": "block", textAlign: "center" }}
      data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
      data-ad-slot="xxxxxxxxxx"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}

export default Adsense;
```

要素そのものはAdsenseのサイトからコードを取得して一部改変し入れている。

プライバシーポリシー、免責事項も追加している。

### サーチコンソール使いたい

特段gatsby側でやることはないけど、所有権の確認が必要(該当のWEBサイトの管理者かどうか確認が必要)。これはアナリティクスタグを先に登録しておけば自動的に検出してくれるので楽ちん。

アナリティクスと連携すると検索キーワードやクリック数とかの情報をアナリティクス側で確認することができる(URLプレフィックスでの登録のみ可能)

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

### SEO関連

#### 一時的にrobots.txtを弄りたい

`gatsby-plugin-robots-txt`が入っていた。

オプションの所で、環境次第でクロールする、しないを切り替えるようにした。

```javascript
plugins: [
  {
    resolve: "gatsby-plugin-robots-txt",
    options: {
      host: 'https://katsu-dev.netlify.app/',
      sitemap: 'https://katsu-dev.netlify.app/sitemap-index.xml',
      env: {
        development: {
          policy: [{ userAgent: '*', disallow: '/' }]
        },
        production: {
          policy: [{ userAgent: '*', allow: '/' }]
          // policy: [{ userAgent: '*', disallow: '/' }]
        }
      },
    }
  },
]
```

#### sitemap.xmlが欲しい

`gatsby-plugin-sitemap`が入ってた。

`gatsby-config.js`にて、

```javascript
{
  siteMetadata: {
    // If you didn't use the resolveSiteUrl option this needs to be set
    siteUrl: `https://www.example.com`,
  },
  plugins: [`gatsby-plugin-sitemap`]
}
```

とするだけで、最低限の`sitemap-index.xml`と、`sitemap-X.xml`が出力される。

尚、netlifyの `add notifications` から `outgoing webhook` を選択して、 `deploy succeeded` のイベントにて `http://www.google.com/ping?sitempap=https://サイトマップのURL` とすればデプロイが終わった時点でサイトマップを自動送信してくれるらしい。

#### URL正規化

重複するコンテンツについて正規のURLを示す

先の`react-helmet`で

```
<link rel=”canonical” href=”正規のurl”/>
```

#### リッチリザルト(検索結果の上の方に出てくる見栄えのいいやつ)

JsonLdコンポーネントを作成した。

必要な構造化データをJSON形式で編集して`react-helmet`で`<head>`に入れてあげる。

```
import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "@reach/router";
import { useStaticQuery, graphql } from "gatsby";
import defaultOpenGraphImage from "../images/default_ogpimage.jpg";

const JsonLd = ({ title, description, featuredImage, date, update }) => {
  const { pathname } = useLocation();
  const { site } = useStaticQuery(query);

  const {
    siteUrl,
    // defaultImage,
    author,
  } = site.siteMetadata;

  const jsonLdStructuredData = {
    "@context": "https://schema.org/",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": siteUrl,  // 適宜調節してください。
    },
    author: {
      "@type": "Person",
      name: author,
      url: siteUrl,
      // image: siteUrl,  // 適宜調節してください。
    },
    publisher: {
      "@type": "Person",
      name: author,
      url: siteUrl,
      // logo: {
      //   "@type": "ImageObject",
      //   url: siteUrl, // 適宜調節してください。
      //   width: 300,
      //   height: 300
      // }
    },
    headline: title,
    // image: featuredImage ? featuredImage : defaultImage,
    image: featuredImage ? featuredImage :defaultOpenGraphImage,
    url: `${siteUrl}${pathname}`,
    description: description,
    datePublished: date,
    dateCreated: date,
    dateModified: update,
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLdStructuredData)}</script>
    </Helmet>
  );
};

export default JsonLd;

// const query = graphql`
//   query Metadata {
//     site {
//       siteMetadata {
//         siteUrl
//         defaultImage
//       }
//     }
//   }
// `
const query = graphql`
  query Metadata {
    site {
      siteMetadata {
        author
        siteUrl
      }
    }
  }
`
```

### アフィリエイト

基本はA8、もしもアフィリエイト等のASPでアカウント作成して、広告リンクや商品リンクを貼り付ける。

広告リンクはプログラム提携して貼り付けるだけ。

商品リンクはA8はツール→Amazonや楽天のツールで、もしもはかんたんリンクで商品を検索してコードを生成できるが、gatsbyでは`<script>`タグをマークダウンにいれられないみたい。

なので、[カエレバ](https://kaereba.com/)でASP毎の楽天やAmazonのアフィリエイトIDを入力すればリンクを生成してくれる。

生成したリンクはシンプルなデザインなので以下のコードを頂戴した。

```css
/*=================================================================================
	カエレバ・ヨメレバ・トマレバ
=================================================================================*/

.cstmreba {
	width:98%;
	height:auto;
	margin:36px auto;
	font-family:'Lucida Grande','Hiragino Kaku Gothic ProN',Helvetica, Meiryo, sans-serif;
	line-height: 1.5;
	word-wrap: break-word;
	box-sizing: border-box;
	display: block;
}
/* WordPressで自動挿入されるPタグの余白を対処 */
.cstmreba p {
	margin: 0;
	padding: 0;
}
.cstmreba a {
	transition: 0.8s ;
	color:#285EFF; /* テキストリンクカラー */
}
.cstmreba a:hover {
	color:#FFCA28; /* テキストリンクカラー(マウスオーバー時) */
}
.cstmreba .booklink-box,
.cstmreba .kaerebalink-box,
.cstmreba .tomarebalink-box {
	width: 100%;
	background-color: #fafafa; /* 全体の背景カラー */
	overflow: hidden;
	border-radius: 0px;
	box-sizing: border-box;
	padding: 12px 8px;
	box-shadow: 0px 2px 5px 0 rgba(0,0,0,.26);
}
/* サムネイル画像ボックス */
.cstmreba .booklink-image,
.cstmreba .kaerebalink-image,
.cstmreba .tomarebalink-image {
	width:150px;
	float:left;
	margin:0 14px 0 0;
	text-align: center;
	background: #fff;
}
.cstmreba .booklink-image a,
.cstmreba .kaerebalink-image a,
.cstmreba .tomarebalink-image a {
	width:100%;
	display:block;
}
.cstmreba .booklink-image a img,
.cstmreba .kaerebalink-image a img,
.cstmreba .tomarebalink-image a img {
	margin:0 ;
	padding: 0;
	text-align:center;
	background: #fff;
}
.cstmreba .booklink-info,.cstmreba .kaerebalink-info,.cstmreba .tomarebalink-info {
	overflow:hidden;
	line-height:170%;
	color: #333;
}
/* infoボックス内リンク下線非表示 */
.cstmreba .booklink-info a,
.cstmreba .kaerebalink-info a,
.cstmreba .tomarebalink-info a {
	text-decoration: none;
}
/* 作品・商品・ホテル名 リンク */
.cstmreba .booklink-name>a,
.cstmreba .kaerebalink-name>a,
.cstmreba .tomarebalink-name>a {
	border-bottom: 1px solid ;
	font-size:16px;
}
/* powered by */
.cstmreba .booklink-powered-date,
.cstmreba .kaerebalink-powered-date,
.cstmreba .tomarebalink-powered-date {
	font-size:10px;
	line-height:150%;
}
.cstmreba .booklink-powered-date a,
.cstmreba .kaerebalink-powered-date a,
.cstmreba .tomarebalink-powered-date a {
	color:#333;
	border-bottom: none ;
}
.cstmreba .booklink-powered-date a:hover,
.cstmreba .kaerebalink-powered-date a:hover,
.cstmreba .tomarebalink-powered-date a:hover {
	color:#333;
	border-bottom: 1px solid #333 ;
}
/* 著者・住所 */
.cstmreba .booklink-detail,.cstmreba .kaerebalink-detail,.cstmreba .tomarebalink-address {
	font-size:12px;
}
.cstmreba .kaerebalink-link1 div img,.cstmreba .booklink-link2 div img,.cstmreba .tomarebalink-link1 div img {
	display:none !important;
}
.cstmreba .kaerebalink-link1, .cstmreba .booklink-link2,.cstmreba .tomarebalink-link1 {
	display: inline-block;
	width: 100%;
	margin-top: 5px;
}
.cstmreba .booklink-link2>div,
.cstmreba .kaerebalink-link1>div,
.cstmreba .tomarebalink-link1>div {
	float:left;
	width:24%;
	min-width:128px;
	margin:0.5%;
}
/***** ボタンデザインここから ******/
.cstmreba .booklink-link2 a,
.cstmreba .kaerebalink-link1 a,
.cstmreba .tomarebalink-link1 a {
	width: 100%;
	display: inline-block;
	text-align: center;
	box-sizing: border-box;
	margin: 1px 0;
	padding:3% 0.5%;
	border-radius: 8px;
	font-size: 13px;
	font-weight: bold;
	line-height: 180%;
	color: #fff;
	box-shadow: 0px 2px 4px 0 rgba(0,0,0,.26);
}
/* トマレバ */
.cstmreba .tomarebalink-link1 .shoplinkrakuten a {background: #76ae25; border: 2px solid #76ae25; }/* 楽天トラベル */
.cstmreba .tomarebalink-link1 .shoplinkjalan a { background: #ff7a15; border: 2px solid #ff7a15;}/* じゃらん */
.cstmreba .tomarebalink-link1 .shoplinkjtb a { background: #c81528; border: 2px solid #c81528;}/* JTB */
.cstmreba .tomarebalink-link1 .shoplinkknt a { background: #0b499d; border: 2px solid #0b499d;}/* KNT */
.cstmreba .tomarebalink-link1 .shoplinkikyu a { background: #bf9500; border: 2px solid #bf9500;}/* 一休 */
.cstmreba .tomarebalink-link1 .shoplinkrurubu a { background: #000066; border: 2px solid #000066;}/* るるぶ */
.cstmreba .tomarebalink-link1 .shoplinkyahoo a { background: #ff0033; border: 2px solid #ff0033;}/* Yahoo!トラベル */
.cstmreba .tomarebalink-link1 .shoplinkhis a { background: #004bb0; border: 2px solid #004bb0;}/*** HIS ***/
/* カエレバ */
.cstmreba .kaerebalink-link1 .shoplinkyahoo a {background:#ff0033; border:2px solid #ff0033; letter-spacing:normal;} /* Yahoo!ショッピング */
.cstmreba .kaerebalink-link1 .shoplinkbellemaison a { background:#84be24 ; border: 2px solid #84be24;}	/* ベルメゾン */
.cstmreba .kaerebalink-link1 .shoplinkcecile a { background:#8d124b; border: 2px solid #8d124b;} /* セシール */
.cstmreba .kaerebalink-link1 .shoplinkwowma a { background:#ea5404; border: 2px solid #ea5404;} /* Wowma */
.cstmreba .kaerebalink-link1 .shoplinkkakakucom a {background:#314995; border: 2px solid #314995;} /* 価格コム */
/* ヨメレバ */
.cstmreba .booklink-link2 .shoplinkkindle a { background:#007dcd; border: 2px solid #007dcd;} /* Kindle */
.cstmreba .booklink-link2 .shoplinkrakukobo a { background:#bf0000; border: 2px solid #bf0000;} /* 楽天kobo */
.cstmreba .booklink-link2  .shoplinkbk1 a { background:#0085cd; border: 2px solid #0085cd;} /* honto */
.cstmreba .booklink-link2 .shoplinkehon a { background:#2a2c6d; border: 2px solid #2a2c6d;} /* ehon */
.cstmreba .booklink-link2 .shoplinkkino a { background:#003e92; border: 2px solid #003e92;} /* 紀伊國屋書店 */
.cstmreba .booklink-link2 .shoplinkebj a { background:#f8485e; border: 2px solid #f8485e;} /* ebookjapan */
.cstmreba .booklink-link2 .shoplinktoshokan a { background:#333333; border: 2px solid #333333;} /* 図書館 */
/* カエレバ・ヨメレバ共通 */
.cstmreba .kaerebalink-link1 .shoplinkamazon a,
.cstmreba .booklink-link2 .shoplinkamazon a {
	background:#FF9901;
	border: 2px solid #ff9901;
} /* Amazon */
.cstmreba .kaerebalink-link1 .shoplinkrakuten a,
.cstmreba .booklink-link2 .shoplinkrakuten a {
	background: #bf0000;
	border: 2px solid #bf0000;
} /* 楽天 */
.cstmreba .kaerebalink-link1 .shoplinkseven a,
.cstmreba .booklink-link2 .shoplinkseven a {
	background:#225496;
	border: 2px solid #225496;
} /* 7net */
/****** ボタンカラー ここまで *****/

/***** ボタンデザイン　マウスオーバー時ここから *****/
.cstmreba .booklink-link2 a:hover,
.cstmreba .kaerebalink-link1 a:hover,
.cstmreba .tomarebalink-link1 a:hover {
	background: #fff;
}
/* トマレバ */
.cstmreba .tomarebalink-link1 .shoplinkrakuten a:hover { color: #76ae25; }/* 楽天トラベル */
.cstmreba .tomarebalink-link1 .shoplinkjalan a:hover { color: #ff7a15; }/* じゃらん */
.cstmreba .tomarebalink-link1 .shoplinkjtb a:hover { color: #c81528; }/* JTB */
.cstmreba .tomarebalink-link1 .shoplinkknt a:hover { color: #0b499d; }/* KNT */
.cstmreba .tomarebalink-link1 .shoplinkikyu a:hover { color: #bf9500; }/* 一休 */
.cstmreba .tomarebalink-link1 .shoplinkrurubu a:hover { color: #000066; }/* るるぶ */
.cstmreba .tomarebalink-link1 .shoplinkyahoo a:hover { color: #ff0033; }/* Yahoo!トラベル */
.cstmreba .tomarebalink-link1 .shoplinkhis a:hover { color: #004bb0; }/*** HIS ***/
/* カエレバ */
.cstmreba .kaerebalink-link1 .shoplinkyahoo a:hover {color:#ff0033;} /* Yahoo!ショッピング */
.cstmreba .kaerebalink-link1 .shoplinkbellemaison a:hover { color:#84be24 ; }	/* ベルメゾン */
.cstmreba .kaerebalink-link1 .shoplinkcecile a:hover { color:#8d124b; } /* セシール */
.cstmreba .kaerebalink-link1 .shoplinkwowma a:hover { color:#ea5404; } /* Wowma */
.cstmreba .kaerebalink-link1 .shoplinkkakakucom a:hover {color:#314995;} /* 価格コム */
/* ヨメレバ */
.cstmreba .booklink-link2 .shoplinkkindle a:hover { color:#007dcd;} /* Kindle */
.cstmreba .booklink-link2 .shoplinkrakukobo a:hover { color:#bf0000; } /* 楽天kobo */
.cstmreba .booklink-link2 .shoplinkbk1 a:hover { color:#0085cd; } /* honto */
.cstmreba .booklink-link2 .shoplinkehon a:hover { color:#2a2c6d; } /* ehon */
.cstmreba .booklink-link2 .shoplinkkino a:hover { color:#003e92; } /* 紀伊國屋書店 */
.cstmreba .booklink-link2 .shoplinkebj a:hover { color:#f8485e; } /* ebookjapan */
.cstmreba .booklink-link2 .shoplinktoshokan a:hover { color:#333333; } /* 図書館 */
/* カエレバ・ヨメレバ共通 */
.cstmreba .kaerebalink-link1 .shoplinkamazon a:hover,
.cstmreba .booklink-link2 .shoplinkamazon a:hover {
	color:#FF9901; } /* Amazon */
.cstmreba .kaerebalink-link1 .shoplinkrakuten a:hover,
.cstmreba .booklink-link2 .shoplinkrakuten a:hover {
	color: #bf0000; } /* 楽天 */
.cstmreba .kaerebalink-link1 .shoplinkseven a:hover,
.cstmreba .booklink-link2 .shoplinkseven a:hover {
	color:#225496;} /* 7net */
/***** ボタンデザイン　マウスオーバー時ここまで *****/
.cstmreba .booklink-footer {
	clear:both;
}

/*****  解像度768px以下のスタイル *****/
@media screen and (max-width:768px){
	.cstmreba .booklink-image,
	.cstmreba .kaerebalink-image,
	.cstmreba .tomarebalink-image {
		width:100%;
		float:none;
	}
	.cstmreba .booklink-link2>div,
	.cstmreba .kaerebalink-link1>div,
	.cstmreba .tomarebalink-link1>div {
		width: 32.33%;
		margin: 0.5%;
	}
	.cstmreba .booklink-info,
	.cstmreba .kaerebalink-info,
	.cstmreba .tomarebalink-info {
	  text-align:center;
	  padding-bottom: 1px;
	}
}

/*****  解像度480px以下のスタイル *****/
@media screen and (max-width:480px){
	.cstmreba .booklink-link2>div,
	.cstmreba .kaerebalink-link1>div,
	.cstmreba .tomarebalink-link1>div {
		width: 49%;
		margin: 0.5%;
	}
}
```