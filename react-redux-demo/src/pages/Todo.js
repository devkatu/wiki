
import { AppBar, Button, Checkbox, Container, IconButton, InputLabel, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, MenuItem, Select, TextField, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate"
import { makeStyles } from "@material-ui/styles";
import { push } from "connected-react-router";
import { useDispatch, useSelector } from "react-redux";

import Header from '../components/Header';
import DrawerMenu from "../components/DrawerMenu";
import TodoListItem from "../components/TodoListItem"
import { FullscreenExitTwoTone, TodayOutlined } from "@material-ui/icons";
import { useCallback, useEffect, useState } from "react";

import { todoAdd, changeComplete, selectTodos, selectFilteredTodos, selectCompletedTodos, selectTodoIds, saveNewTodo, selectFetch, fetchTodos } from "../state/todosSlice";
import { selectFilters, filterColorChanged, filterCompleteChanged } from "../state/filtersSlice";

import { storage } from "../firebase"

// スタイルの読込
// module.cssを以下のように読込んで使用すると、適用されるクラス名は一意のハッシュが付加される。
// これにより他のファイルで同じクラス名が定義されていても名前の衝突が起きない
// 以下のふたつのファイルでcompleteTodoクラスが定義されている
import styles from '../assets/css/todo/Todo.module.css';
import '../assets/css/todo/Todo.css';

const useStyles = makeStyles({
  inputTodo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  filters: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around"
  },
});

const Todo = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [inputText, setInputText] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const todos = useSelector(selectTodos);
  const todoIds = useSelector(selectTodoIds);
  const filteredTodos = useSelector(selectFilteredTodos);
  const completedTodosCount = useSelector(selectCompletedTodos);
  const fetchState = useSelector(selectFetch);
  const filters = useSelector(selectFilters);

  useEffect(() => {
    dispatch(fetchTodos());
  },[])

  // 新規todoテキストでのkeydownハンドラ
  const handleKeyDown = async (e) => {
    const trimedText = inputText.trim();
    // e.whitchはエンターキーのこと
    // このif文の中身はhandleTodoAddと同じ
    if (e.which === 13 && trimedText){
      setSaveStatus("saving");
      await dispatch(saveNewTodo(inputText));
      setInputText("");
      setSaveStatus("idle");
    }
  }
  // 新規todoテキストonchangeハンドラ
  const handleChangeText = (e) => {
    setInputText(e.target.value);
  }
  // 新規todo登録ボタンのonClickハンドラ
  const handleTodoAdd = async () => {
    // todoAddをdispatchすると自分のstoreの更新するだけ
    // dispatch(todoAdd(inputText));

    // saveNewTodoでdispatchするとAPIにpostしたあと
    // responseがきたらstoreを更新する
    // なお、このコンポーネントでも自分でstateを持って
    // dispatch開始と終了によってsaving状態にしてtextareaをdisableにしている
    const trimedText = inputText.trim();
    if(trimedText){

      // まずsaveStatusをsavingにして新規todoのinputをdisableにする
      setSaveStatus("saving");
      
      // dispatchするものがアクションオブジェクトでなく、関数ならそのままその実行する
      // ここで実行する関数はasync functionなので(async function はpromiseを返すので)
      // その関数が終了するまで↓のawaitは待機する
      await dispatch(saveNewTodo(inputText)); 

      // apiリクエストが正常に終わったらinputを空にしてsaveStatusをidleにする
      setInputText("");
      setSaveStatus("idle");
    }
  }

  // フィルターする色を変更するハンドラ
  const handleFilterColorChanged = (e) => {
    dispatch(filterColorChanged(e.target.value));
  }
  // フィルターするフラグを変更するハンドラ
  const handleFilterCompleteChanged = (e) => {
    dispatch(filterCompleteChanged(e.target.value));
  }
  const isSaving = saveStatus === "saving";

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        {/* 通常のcssで読込したときは上ので。module.cssの時は下で */}
        {/* <div className="completeTodo"> */}
        <div className={styles.completeTodo}>
          <p>
            完了しているやる項目数　：　{completedTodosCount}
          </p>
        </div>
        <div className={classes.inputTodo}>
          <TextField
            placeholder="やることを入力してね"
            label="TODO"
            value={inputText}
            onKeyDown={handleKeyDown}
            onChange={handleChangeText}
            disabled={isSaving} />
          <Button
            variant="contained"
            onClick={handleTodoAdd}>
            Todoを登録する
          </Button>
        </div>
        {
          fetchState.fetching && <p>fetch中です!</p>
        }
        <List>
          {filteredTodos.map((todo, index) =>
            <TodoListItem
              key={index}
              id={todo.id}
            />
          )}
        </List>


        <div className={classes.filters}>
          <div>
            <InputLabel id="SelectColor">filter color</InputLabel>
            <Select
              labelId="SelectColor"
              value={filters.filterColor}
              onChange={handleFilterColorChanged}
              label="filter color"
            >
              <MenuItem value="none"> None </MenuItem>
              <MenuItem value="green"> Green </MenuItem>
              <MenuItem value="blue"> Blue </MenuItem>
              <MenuItem value="red"> Red </MenuItem>
            </Select>
          </div>
          <div>
            <InputLabel id="SelectComplete">filter complete</InputLabel>
            <Select
              labelId="SelectComplete"
              value={filters.filterComplete}
              onChange={handleFilterCompleteChanged}
              label="filter complete"
            >
              <MenuItem value="none"> None </MenuItem>
              <MenuItem value={true}> complete </MenuItem>
              <MenuItem value={false}> not complete </MenuItem>
            </Select>
          </div>
        </div>
      </Container>
    </>
  )
}

export default Todo;
