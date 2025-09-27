# TypeScript

**TypeScript**はMicrosoftによって開発された静的型付け言語です。

JavaScriptそのものは変数等に型を持たない動的型付け言語であり、すでに変数に代入されているデータと異なる型のデータを代入することが許されます。これは大規模なWebアプリケーション開発においてバグの温床となってしまいます。

TypeScriptでは変数や引数の後に` : 型`のように**型注釈(アノテーション)**を付け加えて、変数や引数に対する型を指定することができます。

型の定義以外は通常のJavaScriptと同様のルールで変数宣言等が可能です。

```ts
// hello.ts
function hello(name: string){  // :(コロン)の後に型を指定
    console.log(`Hello, ${name}`);
}

let name = 'katsu';
hello(name);
```

このTypeScriptのコードをJavaScriptへ変換することができ、下記のようになります。

```js
// hello.js
function hello(name) {
    console.log(`Hello, ${name}`);
}
var name = 'katsu';
hello(name);
```

`hello`関数は`string`型の変数のみを受け入れることができますが、`hello`関数に誤って`number`型の引数を設定すると…

```js
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

```ts
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

```ts
const arr: string[] = ['a', 'b', 'c'];
const arr2: number[] = [1, 2, 3];
const arr3: boolean[] = [true, false, true];

// 以下でも同じ
const arr4: Array<string> = ['a', 'b', 'c'];
const arr5: Array<number> = [1, 2, 3];
const arr6: Array<boolean> = [true, false, true];
```

タプル型の場合は`変数: [型, 型, 型]`のように、各要素の位置に対応する型を記述します。

```ts
const tuple: [string, number, boolean] = ['a', 1, true];
```

ユニオン型の配列の場合は`変数: (型1 | 型2)[]`のように、各要素のとりうる型を記述します。

```ts
const union: (string | number)[] = ['a', 1, 'b', 2];
```

### ユニオン型

ユニオン(共用体)型は、複数の型のうちのいずれか一つであることを許容する型です。`型 | 型 | ...`のように`|`(パイプ)記号で型を繋げて表現します。

```ts
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

```ts
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

```ts
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

```ts
const obj: { name: string; age: number; isAdult: boolean } = 
{
    name: 'katsu',
    age: 37,
    isAdult: true
}
```

オブジェクト型では、オプショナル(省略可能)なプロパティを`キー名?`のように指定することができ、オプショナル指定されたプロパティは存在しなくても問題ありません。

```ts
const obj: { name: string; age?: number; isAdult: boolean } = 
{
    // ageプロパティは省略可能
    name: 'katsu',
    isAdult: true
}
```

### 列挙型(Enum)

列挙型では定数に名前を付けて定義することができます。実際の値は下記の例では`0`から自動的にインクリメントされて与えられます。

```ts
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

```ts
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

```ts
let myFavoriteFruit: Fruit;
```

### 関数型

関数の定義時に、次の形で、関数の引数と戻り値の型を指定することができます。

```ts
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

```ts
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

```ts
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

```ts
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

```ts
(引数1: 型, 引数2: 型,...) => 戻り値の型
```

ここでの引数名は実際の関数の引数名と一致する必要はありません。
これを`コールバック: `に続けて記述すればOKです。

```ts
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

```ts
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

```ts
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

```ts
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

```ts
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

```ts
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

## 型の機能

### 型エイリアス

`type`キーワードを使うと、複雑な型に別名を付けることができます。これにより、同じ型定義を何度も書く手間が省け、コードの可読性が向上します。オブジェクト型やユニオン型によく使われます。

`type 新しく定義する型 = 型`のように記述します。
```ts
// オブジェクトの型に名前を付ける
type UserProfile = {
  id: number;
  name: string;
  isAdmin: boolean;
  email?: string; // オプショナル
};

const user1: UserProfile = {
  id: 1,
  name: 'Taro',
  isAdmin: true,
};

// ユニオン型に名前を付ける
type StringOrNumber = string | number;

let value: StringOrNumber = 'hello';
value = 123;
```

### インターフェース

`interface`キーワードは、オブジェクトの構造を定義するための強力な方法です。型エイリアス（`type`）と似ていますが、主にオブジェクトの形状を記述するために使用され、クラスに実装（`implements`）させることもできます。

`interface 新しく定義するインターフェース { キー名: 型; キー名: 型; ... }`のように記述します。

```ts
interface User {
  readonly id: number; // 読み取り専用プロパティ
  name: string;
  age?: number; // オプショナルプロパティ
  getProfile(): string; // メソッド
}

// interfaceをクラスに実装する
class UserAccount implements User {
  readonly id: number;
  name: string;
  age?: number;

  constructor(id: number, name: string, age?: number) {
    this.id = id;
    this.name = name;
    this.age = age;
  }

  getProfile(): string {
    return `ID: ${this.id}, Name: ${this.name}`;
  }
}

const account: User = new UserAccount(1, 'Alice');
console.log(account.getProfile());
// account.id = 2; // エラー: Cannot assign to 'id' because it is a read-only property.

// interfaceは継承(extends)も可能
interface AdminUser extends User {
  isAdmin: true;
}

const admin: AdminUser = {
  id: 99, name: 'Admin', isAdmin: true, getProfile: () => 'I am admin'
};
```

また、`interface`は同じ名前で複数回宣言することができ、その場合は宣言が自動的にマージされます。これは`type`にはない特徴です。

Googleでは`type`はプリミティブ型、ユニオン型、タプル等に、`interface`はオブジェクトの型に使う事を推奨しています。

### 型推論

TypeScriptでは、型注釈を明記しなくても、変数の初期値などからコンパイラが自動的に型を推論してくれます。

```ts
// let message: string = "Hello, World!"; と書いたのと同じ
let message = "Hello, World!";
// message = 123; // エラー: Type 'number' is not assignable to type 'string'.

// 関数の戻り値も推論される
// function add(a: number, b: number) : number { と書いたのと同じ
function add(a: number, b: number) {
  return a + b; // 戻り値はnumber型と推論される
}
```

このように、型推論のおかげで、すべての変数に型注釈を付ける必要はなく、コードを簡潔に保つことができます。

### 型アサーション

型アサーションは、プログラマがコンパイラよりも型について詳しい場合に、特定の変数の型を強制的に上書きする機能です。`as`キーワードまたは山括弧`<型>`を使います。JSX/TSXを使う場合は山括弧がタグと混同されるため、`as`キーワードが推奨されます。

```ts
let someValue: any = "this is a string";

// as構文
let strLength: number = (someValue as string).length;

// 山括弧構文
let strLength2: number = (<string>someValue).length;
```

例として、`document.GetElementById`でDOMを取得する場合を考えます。`document.GetElementById`で取得する要素が`div`なのか、`canvas`なのかはTypeScriptにはわからず、`HTMLElement`もしくは`null`であるということしかわかりません。

そのため、取得する要素の型を開発者が明示的に指定する必要があります。

```ts
// DOM APIでよく使われる例
// getElementByIdはHTMLElement | nullを返す
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

この型アサーションが認められるのは、サブタイプとスーパータイプの関係にある型の間のみです。なので複雑なアサーションを行いたい場合に上手くいかないことがあります。このような場合は一旦`any`に変換してから目的の型に変換する方法があります。※但し型チェックが行われず、実行時エラーが起こる可能性がある

```ts
const result = (response as any) as User;
```

また、型アサーションは型変換とは異なり、実行時のチェックは行われません。あくまでコンパイル時の型情報を上書きするだけです。

### オプショナルチェーン

オプショナルチェーン (`プロパティ名?.`) は、ネストされたオブジェクトのプロパティにアクセスする際に、途中のプロパティが `null` や `undefined` であってもエラーを起こさずに安全にアクセスするための機能です。もし参照が `null` または `undefined` の場合、式はそこで中断され `undefined` を返します。

従来のJavaScriptだと、`obj.プロパティ名1 && obj.プロパティ名1.プロパティ名2`のように書いたり、`null`、`undefined`をチェックするif文を書いていたものを短く記述できます。

```ts
// profile,profile.addressプロパティはオプショナル
type User = {
  name: string;
  profile?: {
    email: string;
    address?: {
      city: string;
    }
  }
};

const user1: User = {
  name: 'Taro',
  profile: {
    email: 'taro@example.com'
  }
};

const user2: User = {
  name: 'Jiro'
};

// 従来のJavaScriptでの書き方
// const email1 = user1.profile && user1.profile.address && user1.profile.address.city;

// user1にはprofile.addressがないが、エラーにならない
const city1 = user1.profile?.address?.city; // undefined

// user2にはprofile自体がないが、エラーにならない
const city2 = user2.profile?.address?.city; // undefined

// オプショナルチェーンがない場合、エラーが発生する可能性がある
// const city3 = user2.profile.address.city;
```

### 非Nullアサーション

非Nullアサーション (`変数!`) は、ある変数が `null` や `undefined` ではないことをTypeScriptコンパイラに伝えるための機能です。変数の後ろに `!` を付けることで、その変数の型から `null` と `undefined` を除外します。

これは、開発者がコンパイラよりもその値の存在を確信している場合に使用します。

```ts
function greet(name: string | null | undefined) {
  // ここでname!とすることで、'name'はnullでもundefinedでもないと主張している
  const greeting = "Hello, " + name!;
  console.log(greeting);
}

// 開発者が'Taro'がnullでないことを知っている
greet('Taro');

// 注意: もし値が実際にnullやundefinedだった場合、実行時エラーが発生する
// 'toLowerCase'など、プロパティにアクセスしようとするとエラー
// greet(null);
```

非Nullアサーションはコードの安全性を低下させる可能性があるため、使用は慎重に行うべきです。可能な限り、後述する型ガードなどで型の絞り込みを行うことが推奨されます。

### 型ガード

型ガードは、特定のスコープ内で変数の型をより具体的な型に絞り込むための仕組みです。`if`や`switch`文などの条件分岐で型のチェックを行うと、その条件分岐ブロック以降で変数の型を絞り込む推論が行われ、ユニオン型などを安全に扱うことができます。

代表的な型ガードには `typeof`、`instanceof`、`in` 演算子などがあります。

```ts
// typeof を使った型ガード
function printValue(value: string | number) {
  if (typeof value === "string") {
    // このブロック内では、valueはstring型として扱われる
    console.log(value.toUpperCase());
  } else {
    // このブロック内では、valueはnumber型として扱われる
    console.log(value.toFixed(2));
  }
}

// instanceof を使った型ガード
class Fish {
  swim() { console.log("Swimming..."); }
}
class Bird {
  fly() { console.log("Flying..."); }
}

function move(animal: Fish | Bird) {
  if (animal instanceof Fish) {
    // animalはFish型
    animal.swim();
  } else {
    // animalはBird型
    animal.fly();
  }
}

// in を使った型ガード
interface Admin {
  name: string;
  privileges: string[];
}
interface Employee {
  name: string;
  startDate: Date;
}

function printEmployeeInfo(emp: Admin | Employee) {
  console.log("Name: " + emp.name);
  if ("privileges" in emp) {
    // empはAdmin型
    console.log("Privileges: " + emp.privileges);
  }
  if ("startDate" in emp) {
    // empはEmployee型
    console.log("Start Date: " + emp.startDate);
  }
}
```

また、`is`キーワードを使ってユーザー定義の型ガード関数を作成することもできます。

### keyofオペレーター

`keyof`オペレーターは、オブジェクトの型を受け取り、その型のすべての公開プロパティ名の文字列リテラルユニオン型を生成します。

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

// UserKeysは "id" | "name" | "email" というユニオン型になる
type UserKeys = keyof User;

const key1: UserKeys = "name"; // OK
// const key2: UserKeys = "age"; // エラー: Type '"age"' is not assignable to type 'keyof User'.

// ジェネリクスと組み合わせて、オブジェクトのプロパティを安全に取得する関数
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = {
  id: 1,
  name: "katsu",
  email: "katsu@example.com",
};

const userName = getProperty(user, "name"); // string型
const userEmail = getProperty(user, "email"); // string型
// const userAge = getProperty(user, "age"); // エラー: Argument of type '"age"' is not assignable to parameter of type 'keyof User'.
```

`keyof`を使うことで、存在しないプロパティ名へのアクセスをコンパイル時に防ぐことができます。

### インデックス型

インデックス型（インデックスシグネチャ）は、オブジェクトのキーの型と値の型を定義する方法です。これにより、キーの名前が事前にわからないが、どのようなキーと値を持つかがわかっているオブジェクト（辞書や連想配列など）の型を表現できます。

構文は `[キー名: キーの型]: 値の型` です。

```ts
// キーがstring型で、値がnumber型のオブジェクト
interface NumberDictionary {
  [key: string]: number;  // string型のキー、number型の値を持つ
  length: number; // 他のプロパティも定義できるが、値の型はインデックスシグネチャの型と互換性がなければならない
}

const scores: NumberDictionary = {
  math: 90,
  science: 85,
  length: 2,
};

scores["english"] = 88; // OK
// scores["history"] = "A"; // エラー: Type 'string' is not assignable to type 'number'.

// インデックスアクセス型
// T[K] のように、型TのプロパティKの型を取得できる
type User = {
  id: number;
  name: string;
};

type UserNameType = User["name"]; // string型
```

### readonly

`readonly`修飾子は、プロパティを読み取り専用にするための機能です。`readonly`が付与されたプロパティは、オブジェクトの初期化時にのみ値を代入でき、その後は変更することができなくなります。

```ts
interface Point {
  readonly x: number;
  readonly y: number;
}

const p1: Point = { x: 10, y: 20 }; // OK
// p1.x = 5; // エラー: Cannot assign to 'x' because it is a read-only property.

class Animal {
  readonly name: string;
  constructor(name: string) {
    this.name = name; // コンストラクタ内では代入可能
  }

  changeName(newName: string) {
    // this.name = newName; // エラー: Cannot assign to 'name' because it is a read-only property.
  }
}

const cat = new Animal("Whiskers");
// cat.name = "Paws"; // エラー
```

`readonly`はイミュータブル（不変）なデータ構造を作るのに役立ち、意図しない副作用を防ぎます。

### Async/Awaitの書き方

TypeScriptでは、ES2017で導入された`async/await`構文を型安全に利用できます。`async`関数は常に`Promise`を返すため、戻り値の型は`:Promise<T>`のように注釈します。`T`は`Promise`が解決（resolve）したときの値の型です。

```ts
// ユーザー情報を取得する非同期関数
interface User {
  id: number;
  name: string;
}

// 戻り値の型は Promise<User>
async function fetchUser(userId: number): Promise<User> {
  // fetchはPromise<Response>を返す
  const response = await fetch(`https://api.example.com/users/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user.');
  }
  // response.json()もPromiseを返す
  const user: User = await response.json();
  return user;
}

// async関数を呼び出す
async function displayUser() {
  try {
    const user = await fetchUser(1);
    console.log(`User Name: ${user.name}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}

displayUser();
```

`await`は`Promise`が解決されるまで関数の実行を一時停止し、解決された値を取り出します。`try...catch`ブロックを使うことで、`Promise`が拒否（reject）された場合のエラーをハンドリングできます。

## 開発時の設定等

### 型定義ファイル

TypeScriptはJavaScriptのスーパーセットですが、既存の膨大なJavaScriptライブラリ（例: jQuery, Lodash）には型情報が含まれていません。そのままTypeScriptプロジェクトで使おうとすると、型チェックの恩恵を受けられず、`any`型として扱われてしまいます。

そこで使われるのが**型定義ファイル**（`.d.ts`ファイル）です。これは、JavaScriptで書かれたコードの型情報を宣言するためだけのファイルです。

多くの人気ライブラリでは、コミュニティによって型定義が**DefinitelyTyped**というリポジトリで管理されており、npmの`@types`スコープ(`@types/ライブラリ名`)から簡単にインストールできます。

例えば、`lodash`というライブラリの型定義をインストールするには、以下のコマンドを実行します。

```bash
npm install --save-dev @types/lodash
```

これをインストールするだけで、TypeScriptコンパイラは`lodash`の関数やオブジェクトの型を認識できるようになり、コード補完や型チェックが機能するようになります。

```ts
import _ from 'lodash';

// _.chunkの引数や戻り値の型が正しく推論される
const chunkedArray = _.chunk(['a', 'b', 'c', 'd'], 2);
// chunkedArrayは [['a', 'b'], ['c', 'd']] となり、型は string[][] となる
```

ただし、ライブラリ自体に型定義ファイルが同梱されている場合もあり、その場合は別途`@types`パッケージのインストールは不要です。

また、もし型定義ファイルが提供されていないライブラリを使う場合は、自分で`.d.ts`という拡張子のファイルを作成、型定義をして、読込むことも可能です。

```ts
// my-untyped-library.d.ts
// declare moduleは、コンパイラに型の宣言をするだけのもの
declare module 'my-untyped-library' {
  // export 型 のように、使いたいライブラリの型定義を書いていく
  export function someFunction(arg: string): number;
  export const someValue: number;
}
```

作成した型定義ファイルを次のように使うことができます。

```ts
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

```json
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

```javascript
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

```json
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

```javascript
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

```json
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

```json
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
