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
基本は`const Xxxxxx = createXxxxxxNavigator();`としてやると`Navigator`と`Screen`のプロパティを持つオブジェクト`Xxxxxx`が得られるので`Xxxxxx.Navigator`で複数の`Xxxxxx.Screen`を囲ってやると各ナビゲーションを使えるようになる

### stack  
子スクリーンへ遷移したあと、端末の戻るボタン等を押し下げると前のスクリーンに戻る。webブラウザのようなイメージのもの。
### drawer
ドロワーメニューを使えるようになる。ドロワーメニューに表示される文字は　で決まる。
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