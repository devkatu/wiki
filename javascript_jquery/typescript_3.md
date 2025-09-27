# TypeScript

## 開発時の設定等

### 型定義ファイル

TypeScriptはJavaScriptのスーパーセットですが、既存の膨大なJavaScriptライブラリ（例: jQuery, Lodash）には型情報が含まれていません。そのままTypeScriptプロジェクトで使おうとすると、型チェックの恩恵を受けられず、`any`型として扱われてしまいます。

そこで使われるのが**型定義ファイル**（`.d.ts`ファイル）です。これは、JavaScriptで書かれたコードの型情報を宣言するためだけのファイルです。

多くの人気ライブラリでは、コミュニティによって型定義が**DefinitelyTyped**というリポジトリで管理されており、npmの`@types`スコープ(`@types/ライブラリ名`)から簡単にインストールできます。

例えば、`lodash`というライブラリの型定義をインストールするには、以下のコマンドを実行します。

```
npm install --save-dev @types/lodash
```

これをインストールするだけで、TypeScriptコンパイラは`lodash`の関数やオブジェクトの型を認識できるようになり、コード補完や型チェックが機能するようになります。

```
import _ from 'lodash';

// _.chunkの引数や戻り値の型が正しく推論される
const chunkedArray = _.chunk(['a', 'b', 'c', 'd'], 2);
// chunkedArrayは [['a', 'b'], ['c', 'd']] となり、型は string[][] となる
```

ただし、ライブラリ自体に型定義ファイルが同梱されている場合もあり、その場合は別途`@types`パッケージのインストールは不要です。

また、もし型定義ファイルが提供されていないライブラリを使う場合は、自分で`.d.ts`という拡張子のファイルを作成、型定義をして、読込むことも可能です。

```
// my-untyped-library.d.ts
// declare moduleは、コンパイラに型の宣言をするだけのもの
declare module 'my-untyped-library' {
  // export 型 のように、使いたいライブラリの型定義を書いていく
  export function someFunction(arg: string): number;
  export const someValue: number;
}
```

作成した型定義ファイルを次のように使うことができます。

```
// index.ts
import { someFunction, someValue } from 'my-untyped-library';

// 下記はコンパイルエラーとなる
const result = someFunction(1);
someValue = 'hello';
```

### tsconfig.json

`tsconfig.json`ファイルは、TypeScriptプロジェクトのルートに配置される設定ファイルです。このファイルが存在するディレクトリは、TypeScriptプロジェクトのルートディレクトリであるとみなされます。

Next.js等のプロジェクトでTypeScriptを使う設定にすると必ず作成されるファイルです。(TypeScript単独で使う場合は`tsc --init`で自動生成されます)

このファイルでは、TypeScriptコンパイラ（`tsc`）がソースコードをどのようにコンパイルするかを細かく設定できます。

以下は、Next.jsプロジェクトなどで見られる基本的な`tsconfig.json`の例です。

```
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

特に重要なのは`compilerOptions`で、ここでプロジェクトの要件に合わせて様々な設定を行います。特に重要なものをいくつか紹介します。

#### `strict`
このオプションを`true`にすると、TypeScriptが推奨する一連の厳格な型チェックがすべて有効になります。バグを未然に防ぐために、特別な理由がない限り`true`にすることが強く推奨されます。
`strict`が有効にする主なオプションには以下のようなものがあります。

- **`noImplicitAny`**: 型が明示的に指定されておらず、型推論もできない場合に`any`型とみなすことを禁止します。すべての変数に型が付くことを保証します。
- **`strictNullChecks`**: `null`と`undefined`を他の型（例: `string`）に代入できなくします。これにより、「undefinedのプロパティを読み取れません」といった実行時エラーを大幅に減らすことができます。値を扱う際は、`string | null`のように明示的に許容する必要があります。
- **`strictFunctionTypes`**: 関数の引数の型チェックをより厳格にします。
- **`noImplicitThis`**: `this`の型が不明な場合にエラーにします。

#### `target`
コンパイル後に生成されるJavaScriptのバージョンを指定します。`"ES5"`を指定すれば古いブラウザでも動作するコードが生成され、`"ES2020"`などを指定すればよりモダンな構文を活かしたコードが生成されます。

#### `module`
生成されるJavaScriptがどのモジュールシステムを使用するかを指定します。ブラウザ向けなら`"ESNext"`、Node.js向けなら`"CommonJS"`などがよく使われます。

#### `lib`
コンパイル時に参照するライブラリの型定義を指定します。例えば、ブラウザ環境でコードを動かすなら`"DOM"`を、`Promise`などES2015の機能を使うなら`"ES2015"`を含める必要があります。

#### `sourceMap`
これを`true`にすると、コンパイル後のJavaScriptファイルに対応するソースマップファイル（`.js.map`）が生成されます。これにより、ブラウザの開発者ツールでデバッグする際に、実行されているJavaScriptコードではなく、元のTypeScriptコードを表示させることができます。

### ESLint

**ESLint**は、JavaScriptおよびTypeScriptのコードを静的に解析し、問題のあるパターンを見つけ出すための**リンティングツール**です。バグにつながる可能性のあるコードや、推奨されない書き方を警告・エラーとして表示してくれます。

大体のフロントエンドフレームワークで同梱されています。

#### Next.jsプロジェクトでESLintを使う

Next.jsを使う場合はプロジェクトの作成時にオプションでESLintを選択する事が可能です。

`create-next-app`を実行するときにESLintを用いるか尋ねられるので`Yes`を選択するだけで、必要な設定が自動的に行われ、Lintがインストールされます。

また、既存のNext.jsプロジェクトにESLintを導入する場合は、`eslint-config-next`をインストールするのみでOKです。

プロジェクトのルートにある`eslintrc.config.mjs`等のファイルに、ESLintの設定が記述されています。  
※ESLint9より古いバージョンの場合は`.eslintrc.js`等が設定ファイルとなっており、これとは違う形式になります。

例として下記のような設定ファイルが生成されます。

```
// eslintrc.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    // ここでルールが設定されている
    "next/core-web-vitals",
    "next/typescript"
  ),
];

export default eslintConfig;
```

上記の例だと、

1. `next/core-web-vitals` : Next.jsが提供する推奨ルールセット
    - `img`タグの使用禁止→`next/image`を使用する
    - `a`タグの使用禁止→`next/link`を使用する
    - `script`タグの使用禁止→`next/script`を使用する
    - `alt`属性無し画像検出
    - 等々...
2. `next/typescript` : Next.jsに合わせたTypeScriptのルールセット
    - 型の未使用検出
    - `any`の使用禁止
    - 等々...

のようなチェックが適用されます。

これにより、開発時や、プロジェクトのビルド時などに`eslint.config.mjs`での設定に基づいたチェックが行われるようになります。

また、`package.json`に`lint`が追加されているので、`npm run lint`コマンドでESLintを実行することも可能です。

```
// package.json
{
  // 省略
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  // 省略
}
```

#### Prettierとの連携

ESLint（リンター）とPrettier（フォーマッター）を併用する場合、フォーマットに関するルールが競合する場合があります。併用する場合は、`eslint-config-prettier` を使用すると、ESLintのフォーマットルールを無視して、Prettierにフォーマットを任せることが可能です。

下記コマンドで`eslint-config-prettier`をインストールします。

```
npm install --save-dev eslint-config-prettier
```

インストール後、`eslintrc.config.mjs`の`extends`**配列の最後**に`prettier`を追加します。これにより、他の設定を上書きして競合を回避できます。

```
// eslintrc.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "prettier" // ← Prettier を最後に追加
  ),
];

export default eslintConfig;
```

### Prettier

**Prettier**は、コードのスタイルを統一するための**コードフォーマッター**です。インデントの幅、シングルクォートかダブルクォートか、行末のセミコロンの有無など、コーディングスタイルに関するルールを自動で適用してくれます。

プロジェクトに導入することで、開発者ごとに書き方がバラバラになるのを防ぎ、コードの可読性を高めることができます。

#### インストール

下記コマンドでPrettierをインストールします。

```
npm install --save-dev --save-exact prettier
```

`--save-exact`は、Prettierのバージョンを固定し、フォーマット結果の差異を防ぐために推奨です。

#### 設定ファイルの作成

インストール後、プロジェクトのルートに`.prettierrc`や`.prettierrc.json`などの設定ファイルを作成し、ルールを定義します。ここではjson形式での設定の例を挙げます。

```
// .prettierrc.json
{
  "printWidth": 80,
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "arrowParens": "always"
}
```

主要な設定は次の通りです。

- `printWidth`: 1行の最大文字数。これを超えると自動的に改行されます。
- `tabWidth`: インデントのスペース数。
- `semi`: `true`にすると文末にセミコロンを付けます。
- `singleQuote`: `true`にすると文字列をシングルクォートで囲みます。
- `trailingComma`: オブジェクトや配列の末尾のカンマを指定します。
    - `"es5"`: ES5で有効な場所（オブジェクト、配列など）に付けます。
    - `"all"`: 関数の引数など、可能な限り付けます。
    - `"none"`: 付けません。
- `arrowParens`: アロー関数の引数の括弧をどうするか指定します。
    - `"always"`: `(x) => x` のように常に括弧を付けます。
    - `"avoid"`: `x => x` のように引数が一つの場合は省略します。

#### フォーマット対象外の指定

フォーマットしてほしくないファイルはプロジェクトルートに`.prettierignore`ファイルを作成し、ファイルやディレクトリを指定します。`.gitignore`と似た書式です。

```
# .prettierignore
node_modules
.next
dist
build
```

#### package.jsonへのスクリプト追加

`package.json`にスクリプトを追加し、コマンドラインでPrettierを実行できるようにします。

```
// package.json
"scripts": {
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

上記のnpmスクリプトでは、

- `npm run format`: プロジェクト全体のファイルを整形します。
- `npm run format:check`: 整形が必要なファイルがないかチェックします。CI/CDで実行すると便利です。

VSCodeなどのエディタ拡張機能と組み合わせることで、ファイルを保存したタイミングで自動的にフォーマットをかける設定がよく使われます。これにより、開発者はフォーマットを意識することなくコーディングに集中できます。
