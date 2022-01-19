# React Navigation
webで言うところのルーティングを提供してくれるやつだよ！

## 各ナビゲータ共通項目
### インストール
`$ npm install @react-navigation/native`でインストールし、
expoを使っている場合は
`$ expo install react-native-screens react-native-safe-area-context`
で準備は完了だが、使用するナビゲーターに応じて随時パッケージをインストールする必要がある
### 使用方法
- 基本は`const Xxxxxx = createXxxxxxNavigator();`としてやると`Navigator`と`Screen`のプロパティを持つオブジェクト`Xxxxxx`が得られるので`Xxxxxx.Navigator`で複数の`Xxxxxx.Screen`を囲ってやると各ナビゲーションを使えるようになる。また全てのナビゲーター構造を`<NavigationContainer>`でラップしてあげること。
  ```
  import { NavigationContainer } from '@react-navigation/native';
  import { createStackNavigator } from '@react-navigation/stack';
  
  ...
  
  const Stack = createStackNavigator();
  
  ... 
  
  <NavigationContainer>
    <Stack.Navigator initialRouteName="画面１">
      <Stack.Screen name="画面１" component={Screen1}>
      <Stack.Screen name="画面２" component={Screen2}>
      <Stack.Screen name="画面３" component={Screen3}>
    </Stack.Navigator>
  </NavigationContainer>
  ```


- Screen間の移動は各Screenにpropsとして渡される`navigation`オブジェクトがあるのでそのメソッドである`navigation.navigate()`を用いて行う。このメソッドに渡す引数は移動したいScreenのname属性に設定されている文字列を指定する。
- `navigation.goBack()`で一つ前の画面に戻ることができる。
- 各screenを呼出す時にパラメータを指定したいときには`navigation.navigate()`の第一引数にScreenを、第二引数にオブジェクトを渡し、呼出されるScreen側に`route`引数が渡されるので、その中の`route.params`から渡されたオブジェクトを読取ることができる。
  ```javascript
    // ----- 画面の呼出し側 -----
    navigation.navigate('EditScreen', {id: 10, text: "editing"})

    // ----- 呼出される画面 -----
    const EditScreen = ({route, navigation}) => {
      // route.paramsから分割代入で画面呼出し時の追加propsを取り出す
      const {id, text} = route.params;

      ...
    }
  ```
- 各スクリーンにてパラメータを更新したいときは`navigation.setParams()`
  ただし個々の画面オプション(`<Stack.Screen>`とかのpropsの`options`にあたる)を変更したいときは`navigation.setOptions()`を使用すること
  ```javascript
  navigation.setParams({
    query: 'someText',
  });
  ```
- スクリーンの定義時に予め初期パラメータを設定しておきたい場合は下記で。呼び出し時に何もパラメータを指定しなければ初期パラメータで、指定した場合は初期パラーメータと浅くマージされたものがパラメータとなる
  ```
  <Stack.Navigator>
    <Stack.Screen
      name="Details"
      component={DetailsScreen}
      initialParams={{ itemId: 42 }}
    />
  ...
  </Stack.Navigator>
  ```
- ネストされたナビゲーターにパラメーターを渡して移動する。
  例えば以下のようにナビゲータをネストすることできる。
  Account > (Profile + Settings)
  EditPost
  ```
  function Account() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Profile" component={Profile} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    );
  }

  function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Account"
            component={Account}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="EditPost" component={EditPost} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  ```
  ```javascript
  // Account > Setting
  // にパラメータとして{user: 'jane'}を渡して画面遷移する
  navigation.navigate('Account', {
    screen: 'Settings',
    params: { user: 'jane' },
  });

  // Settincgs > Sound > Media
  // へ画面遷移する。さらにMediaに対してパラメータを指定することも可能
  navigation.navigate('Root', {
    screen: 'Settings',
    params: {
      screen: 'Sound',
      params: {
        screen: 'Media',
      },
    },
  });
  ```
- パラメータとして渡す値は画面の表示に必要な最小限のデータを渡す(色々な情報が含まれているuserオブジェクトを渡す代わりに、userのIDのみをパラメータとするとか)。URLに例えて考えることができ、パラメータにはURLに含めるべきでないデータは、除外する方が良い。クエリパラメータみたいな感じかな
  1. ユーザーID、アイテムIDなどのID。例： `navigation.navigate('Profile', { userId: 'Jane' })`
  2. アイテムのリストがある場合のデータの並べ替え、フィルタリングなどのパラメータ。 `navigation.navigate('Feeds', { sortBy: 'latest' })`
  3. タイムスタンプ、ページ番号、またはページネーション用のカーソル、例： `navigation.navigate('Chat', { beforeTime: 1603897152675 })`
  4. 何かを構成するために画面上の入力を埋めるためのデータ。 `navigation.navigate('ComposeTweet', { title: 'Hello world!' })`
- 画面コンポーネントに追加のpropsを渡したいときは以下の二つの方法がある。
  
  hint: 基本画面の呼び出し時のパラメータ付与は`navigation.navigate()`の第二引数で、初期パラメータの指定は`Xxxxx.Screen`の`initialParams`で行うが、親コンポーネントから子コンポーネント呼び出し時にpropsを渡したいときとかに使う

  1. Contextを使う。これを使えばpropsのバケツリレーもしなくて済む。 こちらが推奨されている 。
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
  2. `Screen`のpropsである`component`を指定する代わりに、レンダリングコールバックを使用する。**これを使えば`screen`の配下にさらに別の`navigator>screen`を直書きで配置することもできる。**あまり複雑なコンポーネントを作るわけでなければファイル分けるより直書きの方が見やすいと思う。
    ```
    // Stack.Screenタグに component を指定せずに、入れ子にしてコールバックを指定
    <Stack.Screen name="Home">
      {props => <HomeScreen {...props} extraData={someData} />}
    </Stack.Screen>
    ```
- `Navigator`の`screenOptions`propsや、`Screen`の`options`propsで各種の画面オプションを設定できる。`screenOptions`はナビゲーター配下の画面全部に共通の設定、`options`は各画面個別の設定となる。`options`については`navigator.setOptions()`で随時変更可能。ちなみにナビゲーターをネストした状態でこれらのpropsを変更しても全てのoptionsが変更される事はなく個別にoptionsが適用される。
よく使うのは`{headerShown: false}`でヘッダーを消したり、`{title: 'screen title'}`でスクリーンのタイトルを指定したりするやつ。4
  ```
  <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'My home' }}
      />
    </Stack.Navigator>
  ```
- ナビゲーションのライフサイクル
  該当の画面にfocusされたとき、blurしたときで各イベントが発行される。reactのuseEffect副作用のような感じで、フックを使うことができる。以下のような感じで使う。これもuseCallbackでラップしてあげてメモ化しておくとよい。
  ```javascript
  useFocusEffect(
    useCallback(() => {
      // focus時の処理

      return () => {
        // blur時の処理
      }
    },[
      // 依存関係の変数を配列で指定
    ])
  )
  ```

  focus時とblur時の依存配列を別にしたく以下のように実装したこともある。
  ```javascript
  useFocusEffect(
    // focus時のみを記述
    useCallback(() => {
      storage.load({ key: 'personalData' })
        .then(data => {
          setBodyHeight(data.bodyHeight);
          setSex(data.sex);
          setTargetBodyWeight(data.targetBodyWeight);
          setTargetFat(data.targetFat);
        })
    }, [])
  )
  useFocusEffect(
    useCallback(() => {
      return (() => {
        // blur時のみを記述
        storage.save({
          key: 'personalData',
          data: {
            bodyHeight: bodyHeight,
            sex: sex,
            targetBodyWeight: targetBodyWeight,
            targetFat: targetFat
          }
        })
      })
      // stateが変更されたらコールバックを再計算する
      // componentDidMount時と分けているのは
      // 下の依存配列を設定してしまうとsetStateしまくって無限レンダリングするから
    }, [bodyHeight, sex, targetBodyWeight, targetFat])
  )
  ```

---

## 各ナビゲーター個別の使い方
### stack  
- インストールは
  `npm install @react-navigation/stack`
  とexpoなら
  `expo install react-native-gesture-handler`
  expoでなければ
  `npm install react-native-gesture-handler`
- 上部に表示される文字は`<Stack.Screen/>`に渡す`name`propsで決まる。
- `navigation.push()`を使うとstackに新しいルートを追加する。
- `navigation.pop()`を使うと一つ前の画面に戻る。
- `navigation.popToTop()`を使うと全ての画面をポップして初期の画面に戻る。

### drawer
- インストールは
  `npm install @react-navigation/drawer`
  とexpoなら
  `expo install react-native-gesture-handler react-native-reanimated`
  expoでなければ
  `npm install react-native-gesture-handler react-native-reanimated`
- ドロワーメニューに表示される文字は`<Drawer.Screen/>`に渡す`name`propsで決まる。
- `navigation.openDrawer()`でドロワーメニューを開く。
- `navigation.closeDrawer()`でドロワーメニューを閉じる。
- `navigation.toggleDrawer()`でドロワーメニューを開閉する。
- `useDrawerStatus()`でドロワーの開閉状態を取得できる

### tab
- インストールは
  `npm install @react-navigation/bottom-tabs` とか
  `npm install @react-navigation/material-top-tabs react-native-tab-view`
- タブメニューに表示される文字は`<Tab.Screen/>`に渡す`name`propsで決まる。
- `navigation.navigate()`でスクリーン指定して遷移可能
- 以下のscreenOptionsを指定してタブのアイコンを切り替えるようにするとかっこいいかも
  ```
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === 'Home') {
        iconName = focused
          ? 'ios-information-circle'
          : 'ios-information-circle-outline';
      } else if (route.name === 'Settings') {
        iconName = focused ? 'ios-list-box' : 'ios-list';
      }

      // You can return any component that you like here!
      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: 'tomato',
    tabBarInactiveTintColor: 'gray',
  })}
  ```

---

## 使ったものやtips
### initialParams属性で初期パラメータ指定
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
### navigation.navigate()でパラーメタ指定
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
ネストするコンポーネントが大規模でなければこれでいいかも
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