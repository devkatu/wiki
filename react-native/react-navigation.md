# React Navigation
hint: webで言うところのルーティングを提供してくれるやつだよ！
ちょっとめんどくさい実装したところについてだけまとめているよ！

attention: いろいろと書きたいところあるはず。とくにネストしたり子要素与えたり

## 各ナビゲーターの使い方

- drawer
- stack
- tab

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