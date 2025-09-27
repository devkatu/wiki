# TypeScript

## 型の機能

### 型エイリアス

`type`キーワードを使うと、複雑な型に別名を付けることができます。これにより、同じ型定義を何度も書く手間が省け、コードの可読性が向上します。オブジェクト型やユニオン型によく使われます。

`type 新しく定義する型 = 型`のように記述します。
```
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

```
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

```
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

```
let someValue: any = "this is a string";

// as構文
let strLength: number = (someValue as string).length;

// 山括弧構文
let strLength2: number = (<string>someValue).length;
```

例として、`document.GetElementById`でDOMを取得する場合を考えます。`document.GetElementById`で取得する要素が`div`なのか、`canvas`なのかはTypeScriptにはわからず、`HTMLElement`もしくは`null`であるということしかわかりません。

そのため、取得する要素の型を開発者が明示的に指定する必要があります。

```
// DOM APIでよく使われる例
// getElementByIdはHTMLElement | nullを返す
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

この型アサーションが認められるのは、サブタイプとスーパータイプの関係にある型の間のみです。なので複雑なアサーションを行いたい場合に上手くいかないことがあります。このような場合は一旦`any`に変換してから目的の型に変換する方法があります。※但し型チェックが行われず、実行時エラーが起こる可能性がある

```
const result = (response as any) as User;
```

また、型アサーションは型変換とは異なり、実行時のチェックは行われません。あくまでコンパイル時の型情報を上書きするだけです。

### オプショナルチェーン

オプショナルチェーン (`プロパティ名?.`) は、ネストされたオブジェクトのプロパティにアクセスする際に、途中のプロパティが `null` や `undefined` であってもエラーを起こさずに安全にアクセスするための機能です。もし参照が `null` または `undefined` の場合、式はそこで中断され `undefined` を返します。

従来のJavaScriptだと、`obj.プロパティ名1 && obj.プロパティ名1.プロパティ名2`のように書いたり、`null`、`undefined`をチェックするif文を書いていたものを短く記述できます。

```
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

```
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

```
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

```
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

```
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

```
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

```
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