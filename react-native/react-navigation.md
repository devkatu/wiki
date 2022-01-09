# React Navigation
webで言うところのルーティングを提供してくれるやつだよ！
ちょっとめんどくさい実装したところについてだけまとめているよ！

attention: いろいろと書きたいところあるはず。とくにネストしたり子要素与えたり

## インストール
`$ npm install @react-navigation/native`でインストールし、
expoを使っている場合は
`$ expo install react-native-screens react-native-safe-area-context`
で準備は完了だが、使用するナビゲーターに応じて随時パッケージをインストールする必要がある

## 各ナビゲーターの使い方

- 基本は`const Xxxxxx = createXxxxxxNavigator();`としてやると`Navigator`と`Screen`のプロパティを持つオブジェクト`Xxxxxx`が得られるので`Xxxxxx.Navigator`で複数の`Xxxxxx.Screen`を囲ってやると各ナビゲーションを使えるようになる
  ```
  const Stack = createStackNavigator();
  ... 
  <Stack.Navigator initialRouteName="画面１">
    <Stack.Screen name="画面１" component={Screen1}>
    <Stack.Screen name="画面２" component={Screen2}>
    <Stack.Screen name="画面３" component={Screen3}>
  </Stack.Navigator>
  ```
- 画面に追加のpropsを渡したいときは
  1. Contextを使う。これを使えばpropsのバケツリレーもしなくて済む。  
    ```
    // ---------- js中のルート ----------
    // 共有するコンテキスト変数を作成する
    const TrainingPlanContext = createContext();


    // ---------- コンテキスト中に囲まれた子スクリーン ----------
    const EditScreen = ({ route, navigation }) => {

    // 共有されたコンテキストを取り出す
    const { trainingPlanLists,
      setTrainingPlanLists,
      trainingContentsLists,
      setPlanAccordionsOpen } = useContext(TrainingPlanContext);
    ...

    // ---------- 親のナビゲーター ----------
    {/* コンテキストプロバイダーコンポーネントで囲い、コンテキストの共有を行う。プロバイダーで囲われた中で、コンテキストの読出しを行うことができる */}
    ...
    <TrainingPlanContext.Provider
      value={{
        trainingPlanLists,
        setTrainingPlanLists,
        trainingContentsLists,
        setPlanAccordionsOpen
      }}
    >
      <Tab.Navigator>
        <Tab.Screen name="トレーニング予定" component="TrainingPlan">
        <Tab.Screen name="プランの編集">
          {() => {
            return (
              <Stack.Navigator
                // ヘッダー非表示とする
                screenOptions={{ headerShown: false }}
                initialRouteName="プラン一覧"
              >
                <Stack.Screen name="プラン一覧" component={ListScreen} />
                <Stack.Screen name="プラン編集" component={EditScreen} />
              </Stack.Navigator>
            )
          }}
        </Tab.Screen>
      </Tab.Navigator>
    </TrainingPlanContext.Provider>
    ...
    ```
  2. `Screen`のpropsである`component`を指定する代わりに、レンダリングコールバックを使用する。**これを使えば`screen`の配下にさらに別の`navigator>screen`を配置することもできる**
    ```
    <Stack.Screen name="Home">
      {props => <HomeScreen {...props} extraData={someData} />}
    </Stack.Screen>
    ```

- Screen間の移動は各Screenにpropsとして渡される`navigation`オブジェクトがあるのでそのメソッドである`navigation.navigate()`を用いて行う。このメソッドに渡す引数は移動したいScreenのname属性に設定されている文字列を指定する。
- `navigation.goBack()`で一つ前の画面に戻ることができる。
- 各screenを呼出す時に追加でpropsを渡したいときには`navigation.navigate()`の第一引数にScreenを、第二引数にオブジェクトを渡し、呼出されるScreen側に`route`引数が渡されるので、その中の`route.params`から渡されたオブジェクトを読取ることができる。
  ```
    // ----- 画面の呼出し側 -----
    navigation.navigate('EditScreen', {id: 10, text: "editing"})

    // ----- 呼出される画面 -----
    const EditScreen = ({route, navigation}) => {
      // route.paramsから分割代入で画面呼出し時の追加propsを取り出す
      const {id, text} = route.params;

      ...
    }
  ```

attention: ここまで
- パラメータを更新する
- 初期パラメータを渡す
- ネストされたナビゲーターにパラメーターを渡す

### stack  
- `npm install @react-navigation/////`インストール
子スクリーンへ遷移したあと、端末の戻るボタン等を押し下げると前のスクリーンに戻る。webブラウザのようなイメージのもの。

- `navigation.push()`を使うとstackに新しいルートを追加する。
- `navigation.pop()`を使うと一つ前の画面に戻る。

### drawer
ドロワーメニューを使えるようになる。ドロワーメニューに表示される文字は　で決まる。

- `navigation.openDrawer()`でドロワーメニューを開く。
- `navigation.closeDrawer()`でドロワーメニューを閉じる。
- `navigation.toggleDrawer()`でドロワーメニューを開閉する。

### tab
タブ切替が使えるようになる。タブメニューに表示される文字は　で決まる。

### ナビゲーターによるコンポーネントへの初期パラメーターの設定
#### initialParams属性で指定
``` 
<Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen name="ホーム" component={Home} />
    <Drawer.Screen name="トレーニングを開始する" component={Start_traning}
        initialParams={{
        trainingTitle: "",
        trainingMenu: [{ name: '', weight: '', reps: '', remarks: "" }]
        }}
    />
</Drawer.Navigator>
```
#### navigator()で引数に指定
```
const Screen = ({route, navigation}) => {
...
return (
    <Icon
        name="edit"
        type="MaterialIcons"
        onPress={() => {
            navigation.navigate("プラン編集", { editNo: index + 1 });
        }}
    />
)
...
}
```
### 各ナビゲーター配下のスクリーンへの子コンポーネントの追加

attention: この方法で追加のpropsを渡す事もできる
[https://reactnavigation.org/docs/hello-react-navigation/#passing-additional-props](https://reactnavigation.org/docs/hello-react-navigation/#passing-additional-props)

```
<Tab.Navigator>
    <Tab.Screen name="トレーニング予定">
    {() => {
        return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="トレーニング予定">
            <Stack.Screen name="トレーニング予定" component={ScheduleScreen} />
            <Stack.Screen name="トレーニング予定編集" component={ScheduleEditScreen} />
        </Stack.Navigator>
        )
    }}
    </Tab.Screen>
    <Tab.Screen name="プランの編集">
    {() => {
        return (
        <Stack.Navigator
            // ヘッダー非表示とする
            screenOptions={{ headerShown: false }}
            initialRouteName="プラン一覧"
        >
            <Stack.Screen name="プラン一覧" component={ListScreen} />
            <Stack.Screen name="プラン編集" component={EditScreen} />
        </Stack.Navigator>
        )
    }}
    </Tab.Screen>
</Tab.Navigator>
```

### 画面上部のヘッダーを消す

attention: この他にも様々なオプションあり。Screen側に付ける個別のoptionもあり
[https://reactnavigation.org/docs/hello-react-navigation/#specifying-options](https://reactnavigation.org/docs/hello-react-navigation/#specifying-options)

```
<Stack.Navigator
    // ヘッダー非表示とする
    screenOptions={{ headerShown: false }}
    initialRouteName="プラン一覧"
>
    <Stack.Screen name="プラン一覧" component={ListScreen} />
    <Stack.Screen name="プラン編集" component={EditScreen} />
</Stack.Navigator>
```