
import { AppBar, Button, Checkbox, Container, IconButton, InputLabel, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, MenuItem, Select, TextField, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/styles";
import { push } from "connected-react-router";
import { useDispatch, useSelector } from "react-redux";

import Header from '../components/Header';
import DrawerMenu from "../components/DrawerMenu";
import TodoListItem from "../components/TodoListItem"
import { FullscreenExitTwoTone, TodayOutlined } from "@material-ui/icons";
import { useState } from "react";

import { todoAdd, changeComplete, selectTodos, selectFilteredTodos, selectCompletedTodos, selectTodoIds } from "../state/todosSlice";
import { filterColorChanged, filterCompleteChanged } from "../state/filtersSlice";

const useStyles = makeStyles({
  inputTodo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }
});

const Todo = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [inputText, setInputText] = useState("");
  const todos = useSelector(selectTodos);
  const todoIds = useSelector(selectTodoIds);
  const filteredTodos = useSelector(selectFilteredTodos);
  const completedTodosCount = useSelector(selectCompletedTodos);

  const handleChangeText = (e) => {
    setInputText(e.target.value);
  }
  const handleTodoAdd = () => {
    dispatch(todoAdd(inputText));
  }
  // const handleChangeCompleted = (e) => {
  //   dispatch(changeComplete(e.target.checked));
  // }
  const handleFilterColorChanged = (e) => {
    dispatch(filterColorChanged(e.target.value));
  }
  const handleFilterCompleteChanged = (e) => {
    dispatch(filterCompleteChanged(e.target.value));
  }
  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <div>
          <p>
            完了しているやる項目数　：　{completedTodosCount}
          </p>
        </div>
        <div className={classes.inputTodo}>
          <TextField placeholder="やることを入力してね" label="TODO" onChange={handleChangeText} />
          <Button
            variant="contained"
            onClick={handleTodoAdd}>
            Todoを登録する
          </Button>
        </div>
        <List>
          {filteredTodos.map((todo, index) =>
            <TodoListItem
              key={index}
              id={todo.id}
            />
          )}

          {/* フィルター済みtodosの表示 */}
          {/* {filteredTodos.map((todo, index) =>
            <ListItem key={index}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={todo.completed}
                  disableRipple
                  onChange={handleChangeCompleted}
                />
              </ListItemIcon>
              <ListItemText primary={todo.text} />
              <ListItemSecondaryAction>
                <Select
                  edge="end"
                  value={todo.color}
                // onChange={ }
                >
                  <MenuItem value={"green"}>green</MenuItem>
                  <MenuItem value={"red"}>red</MenuItem>
                  <MenuItem value={"blue"}>blue</MenuItem>

                </Select>
              </ListItemSecondaryAction>
            </ListItem>
          )} */}
        </List>



        <InputLabel id="SelectColor">filter color</InputLabel>
        <Select
          labelId="SelectColor"
          // value={}
          onChange={handleFilterColorChanged}
          label="filter color"
        >
          <MenuItem value="none"> None </MenuItem>
          <MenuItem value="green"> Green </MenuItem>
          <MenuItem value="blue"> Blue </MenuItem>
          <MenuItem value="red"> Red </MenuItem>
        </Select>
        <InputLabel id="SelectComplete">filter complete</InputLabel>
        <Select
          labelId="SelectComplete"
          // value={}
          onChange={handleFilterCompleteChanged}
          label="filter complete"
        >
          <MenuItem value="none"> None </MenuItem>
          <MenuItem value="complete"> complete </MenuItem>
          <MenuItem value="not"> not complete </MenuItem>
        </Select>
      </Container>
    </>
  )
}

export default Todo;
