# TypeScript

**TypeScript**はMicrosoftによって開発された静的型付け言語です。

JavaScriptそのものは変数等に型を持たない動的型付け言語であり、すでに変数に代入されているデータと異なる型のデータを代入することが許されます。これは大規模なWebアプリケーション開発においてバグの温床となってしまいます。

TypeScriptでは変数や引数の後に` : 型`のように**型注釈(アノテーション)**を付け加えて、変数や引数に対する型を指定することができます。

型の定義以外は通常のJavaScriptと同様のルールで変数宣言等が可能です。

```
// hello.ts
function hello(name: string){  // :(コロン)の後に型を指定
    console.log(`Hello, ${name}`);
}

let name = 'katsu';
hello(name);
```

このTypeScriptのコードをJavaScriptへ変換することができ、下記のようになります。

```
// hello.js
function hello(name) {
    console.log(`Hello, ${name}`);
}
var name = 'katsu';
hello(name);
```

`hello`関数は`string`型の変数のみを受け入れることができますが、`hello`関数に誤って`number`型の引数を設定すると…

```
hello(123);
```

コンパイルした時に下記のようなエラーが発生します。

```
Argument of type 'number' is not assignable to parameter of type 'string'.
```

`number`型の引数は`string`型の引数に割当できませんというエラーが発生しています。

通常のJavaScriptコードではこれは許されてしまいますが、TypeScriptはコンパイル時にエラーとして検出することが可能であり、バグを発見しやすくなります。

また、型注釈に関するエラー以外にもJavaScriptでは実行時にエラーとして発覚するようなものもコンパイル時に検出できたりします。

## TypeScriptの導入

Next.jsなどのフレームワークでは、プロジェクトの作成時にTypeScriptを使用するオプションを指定することで、TypeScriptが使用可能となり、コンパイルも自動で行ってくれます。

あまりやりませんがTypeScript単体での使用をしたい場合、下記コマンドでインストールを行います。

```
npm install --save-dev typescript
```

これで、`tsc`コマンドが使えるようになります。

下記コマンドで、TypeScriptで書いたコードをJavaScriptに変換する事が可能です。

```
tsc hello.ts
```

## 基本的な型と機能

### プリミティブ型

プリミティブ型である文字列(`string`)、数値(`number`)、真偽値(`boolean`)等を指定する場合は単純に`変数: 型`のように記述します。

```
let name: string = "katsu";
let age: number = 37;
let isAdult: boolean = true;
```

### 配列、タプル型

JavaScriptでの配列は各要素で型が混在する場合がありますが、TypeScriptでは次のようになります。

- 全ての要素の型が同じであれば単なる**配列**
- 各要素に複数の型があり、順番が決まっていれば**タプル型**
- 各要素に複数の型があり、順番が決まっていなければ**ユニオン型の配列**

単なる配列の場合は`変数: 型[]`やジェネリックを用いて`変数: Array<型>`のように記述します。

```
const arr: string[] = ['a', 'b', 'c'];
const arr2: number[] = [1, 2, 3];
const arr3: boolean[] = [true, false, true];

// 以下でも同じ
const arr4: Array<string> = ['a', 'b', 'c'];
const arr5: Array<number> = [1, 2, 3];
const arr6: Array<boolean> = [true, false, true];
```

タプル型の場合は`変数: [型, 型, 型]`のように、各要素の位置に対応する型を記述します。

```
const tuple: [string, number, boolean] = ['a', 1, true];
```

ユニオン型の配列の場合は`変数: (型1 | 型2)[]`のように、各要素のとりうる型を記述します。

```
const union: (string | number)[] = ['a', 1, 'b', 2];
```

### ユニオン型

ユニオン(共用体)型は、複数の型のうちのいずれか一つであることを許容する型です。`型 | 型 | ...`のように`|`(パイプ)記号で型を繋げて表現します。

```
// stringまたはnumberを許容する
let value: string | number;

value = "hello"; // OK
value = 123;     // OK
// value = true; // エラー

// 引数にstringまたはnumberを許容する関数
function printId(id: string | number) {
  console.log(`ID: ${id}`);
}

// どちらも許容される
printId(101);
printId("202");
```

### リテラル型のユニオン型

`値 | 値 | ...`のように、特定の値そのものを型として扱うことができます。これにより、変数や引数に特定の値しか代入できなくなります。

```
// 文字列リテラルユニオン
let eventName: "click" | "mouseover" | "keydown";

eventName = "click"; // OK
// eventName = "keyup"; // エラー

// 数値リテラルユニオン
let dice: 1 | 2 | 3 | 4 | 5 | 6;
dice = 5; // OK
// dice = 7; // エラー
```

### インターセクション型

インターセクション(交差)型は、複数の型を一つに結合する型です。`&`(アンパサンド)記号で型を繋げて表現します。主に複数のオブジェクト型を合成するために使われます。

```
type Colorful = {
  color: string;
}

type Circle = {
  radius: number;
}

// ColorfulとCircleの両方のプロパティを持つ型
type ColorfulCircle = Colorful & Circle;

const cc: ColorfulCircle = {
  color: "red",
  radius: 10.5,
};
```

### オブジェクト型

オブジェクト型を指定する場合は、`オブジェクト変数: { キー名1: 型1; キー名2: 型2; ... }`のように記述します。

```
const obj: { name: string; age: number; isAdult: boolean } = 
{
    name: 'katsu',
    age: 37,
    isAdult: true
}
```

オブジェクト型では、オプショナル(省略可能)なプロパティを`キー名?`のように指定することができ、オプショナル指定されたプロパティは存在しなくても問題ありません。

```
const obj: { name: string; age?: number; isAdult: boolean } = 
{
    // ageプロパティは省略可能
    name: 'katsu',
    isAdult: true
}
```

### 列挙型(Enum)

列挙型では定数に名前を付けて定義することができます。実際の値は下記の例では`0`から自動的にインクリメントされて与えられます。

```
enum Fruit{
  Apple,
  Banana,
  Orange
}

console.log(Fruit.Apple); // → 0
console.log(Fruit.Banana); // → 1
console.log(Fruit.Orange); // → 2
```

値に文字列を指定することもでき、下記の様にすることが可能です。

```
enum Fruit{
  Apple = 'Apple',
  Banana = 'Banana',
  Orange = 'Orange'
}

console.log(Fruit.Apple); // → 'Apple'
console.log(Fruit.Banana); // → 'Banana'
console.log(Fruit.Orange); // → 'Orange'
```

Enumとして定義したものは型として扱うことが可能で、`変数: Enumで定義した型`のようにすることができます。

```
let myFavoriteFruit: Fruit;
```

### 関数型

関数の定義時に、次の形で、関数の引数と戻り値の型を指定することができます。

```
// 関数宣言
function 関数 (引数1: 型, 引数2: 型, ...): 戻り値の型 {
    ...
}

// アロー関数
const 関数 = (引数1: 型, 引数2: 型, ...): 戻り値の型 => {
    ...
}
```

次の関数は引数、戻り値とも`string`型です。

```
// 関数宣言
function hello (name: string): string {
    return `Hello, ${name}`;
}

// アロー関数
const hello = (name: string): string => {
    return `Hello, ${name}`;
}
```

引数にデフォルト値を指定するときは`変数: 型 = デフォルト値`のようにします。

```
// 関数宣言
function hello (name: string = 'katsu'): string {
    return `Hello, ${name}`;
}

// アロー関数
const hello = (name: string = 'katsu'): string => {
    return `Hello, ${name}`;
}
```

オプショナルな引数は`変数?: 型`のように記述します。

```
// 関数宣言
function hello (name?: string): string {
    return `Hello, ${name || 'katsu'}`;
}

// アロー関数
const hello = (name?: string): string => {
    return `Hello, ${name || 'katsu'}`;
}
```

コールバック関数の型は次の形で定義できます。

```
(引数1: 型, 引数2: 型,...) => 戻り値の型
```

ここでの引数名は実際の関数の引数名と一致する必要はありません。
これを`コールバック: `に続けて記述すればOKです。

```
function processUserInput(
  input: string,
  // callbackは、string型の引数を1つ受け取り、何も返さない(void)関数
  callback: (processedInput: string) => void
): void {
  const processed = `User entered: ${input}`;
  callback(processed);
}

// または型エイリアスで関数の型を定義
type ProcessCallback = (processedInput: string) => void;

function processUserInput(
  input: string,
  callback: ProcessCallback  // 定義した型エイリアスを指定
): void {
  const processed = `User entered: ${input}`;
  callback(processed);
}
```

### クラス

TypeScriptでは、ES2015(ES6)と同様のクラス構文を使用できます。プロパティ、コンストラクタ、メソッドに変数、関数に型注釈するの同様に型を追加することができます。

また、クラス、インスタンスを代入する変数に`変数: クラス名`のように型注釈をすることも可能です。

```
class User {
  // プロパティに型注釈
  name: string;
  private age: number;

  // コンストラクタの引数に型注釈
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  // メソッドの戻り値に型注釈
  public getProfile(): string { // public修飾子(デフォルト)
    return `Name: ${this.name}, Age: ${this.age}`;
  }
}

// クラスは型としても使用できる
const user: User = new User('katsu', 37);
console.log(user.getProfile());
```

また、後述するインターフェースを用いると、クラスに対する型のようなイメージで実装を強制させることが可能です。

### any型

`any`型を指定した変数は全ての型を許容します。特定の変数に対し、型チェックを行いたくない場合に使用します。型安全性が失われるため、安易な使用は推奨されず、後述の`unknown`を使うべきです。

```
// 次のいずれも許容される
let anyVariable: any = 123;
anyVariable = 'string';
anyVariable = true;
```

### unknown

`unknown`型は、`any`型に似ていますが、より安全な型です。`any`型と同様にどんな型の値でも代入できますが、`unknown`型は以下の特徴があります。

- 変数のプロパティにアクセスできない
- メソッドを呼び出せない
- 関数として実行できない

`unknown`型の値を使用するには、後述する型ガードや型アサーションを使って、より具体的な型に絞り込む必要があります。

```
let value: unknown;

// 下記三つ何れもOK
value = 123;
value = "hello";
value = () => console.log("I am a function");

// メソッドへのアクセスはエラーとなる
// value.toUpperCase(); // エラー: 'value' is of type 'unknown'.

// 型ガードを使って型を絞り込む
if (typeof value === "string") {
  // このブロック内ではvalueはstring型
  console.log(value.toUpperCase());
}

// 型アサーションを使ってもOK
const func = value as () => void;
func();
```

`any`型は型チェックを無効にしてしまうため、可能な限り`unknown`型を使い、安全に型を絞り込んでから使用することが推奨されます。

### never型

`never`型は、決して値を持たないことを表す型です。例えば、常に例外をスローする関数や、無限ループする関数の戻り値の型として使用されます。

```
// 常にエラーをスローするため、戻り値は存在しない
function error(message: string): never {
  throw new Error(message);
}

// 無限ループするため、関数が終了せず戻り値は存在しない
function infiniteLoop(): never {
  while (true) {}
}
```

### ジェネリック型

ジェネリックは、型を引数のように扱える機能です。これにより、様々な型に対応できる再利用性の高いコンポーネントや関数を作成できます。

クラスや関数の定義時に、`クラス・関数<型変数>`とすると、そのクラス、関数の内部で型変数(慣習的に`T`を使うことが多い)を使用できます。

例えば、引数で受け取った値をそのまま返す関数を考えます。

```
// anyを使うと、戻り値の型情報が失われてしまう
function identityAny(arg: any): any {
  return arg;
}

// ジェネリクスを使って型を受け取る
function identity<T>(arg: T): T {
  return arg;
}

// stringを渡すと、Tはstringになる
let outputString = identity<string>("myString");
// numberを渡すと、Tはnumberになる
let outputNumber = identity<number>(123);

// outputStringはstring型、outputNumberはnumber型となる
console.log(typeof outputString); // "string"
console.log(typeof outputNumber); // "number"
```

ジェネリックを使うことで、`any` のように型安全性を損なうことなく、柔軟なコードを書くことができます。