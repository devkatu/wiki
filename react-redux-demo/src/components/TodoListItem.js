
import { AppBar, Button, Checkbox, Container, IconButton, InputLabel, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, MenuItem, Select, TextField, Toolbar, Typography } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from "@material-ui/styles";
import { push } from "connected-react-router";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeComplete, changeColor, updateTodo, updateComplete, updateColor, selectTodoById, changeTodos, deleteTodo } from "../state/todosSlice";
import ImageAdd from "./ImageAdd";


// todo項目一個のコンポーネント
const TodoListItem = (props) => {
  // このセレクターはpropsとして渡されたIDを元にtodoを取り出す
  const todo = useSelector(state => selectTodoById(state, props.id));
  // const [image, setImage] = useState({});
  const dispatch = useDispatch();

  // 完了フラグチェックボックスを変更したときのハンドラ
  // const handleChangeCompleted = (e) => {
  //   const newTodo = {...todo,completed: e.target.checked};
  //   dispatch(updateTodo(props.id, newTodo));
  // }
  // ↑をusecallback化したもの
  // 一つ目の引数に普通にコンポーネントに渡す感じの関数を書いて、
  // 二つ目の引数にはその依存する変数の配列を渡す。
  // 二つ目の配列の中身が変化しなければ関数の再計算はせずにキャッシュした関数の戻り値のみを使用する
  const handleChangeCompleted = useCallback(
    (e) => {
      const newTodo = { ...todo, completed: e.target.checked };
      dispatch(updateTodo(props.id, newTodo));
    },
    [todo]
  )
  // todo色の変更ハンドラ
  const handleChangeColor = (e) => {
    const newTodo = { ...todo, color: e.target.value };
    dispatch(updateTodo(props.id, newTodo));
  }
  // 画像の追加ハンドラ
  const handleImageAdd = (image) => {
    const newTodo = {...todo, image: image};
    dispatch(updateTodo(props.id, newTodo));
  }
  // todo削除ボタン押し下げ時のハンドラ
  const handleDelete = () => {
    dispatch(deleteTodo(props.id));
  }

  return (
    <ListItem>
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={todo.completed}
          disableRipple
          onChange={handleChangeCompleted}
        />
      </ListItemIcon>
      <ListItemText
        // primary={todo.text}
      >
        <a href={todo.image ? todo.image.path : null} target="_blank">
          {todo.text}
        </a>
      </ListItemText>
      <ListItemSecondaryAction>
        <Select
          edge="end"
          value={todo.color}
          onChange={handleChangeColor}
        >
          <MenuItem value={"green"}>green</MenuItem>
          <MenuItem value={"red"}>red</MenuItem>
          <MenuItem value={"blue"}>blue</MenuItem>

        </Select>
        <ImageAdd handleImageAdd={handleImageAdd} />
        <IconButton
          aria-label="delete"
          onClick={handleDelete}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default TodoListItem;
