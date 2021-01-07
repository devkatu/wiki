
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

import { todoAdd, changeComplete, selectTodos, selectFilteredTodos, selectCompletedTodos, selectTodoIds, saveNewTodo, selectFetch } from "../state/todosSlice";
import { selectFilters, filterColorChanged, filterCompleteChanged } from "../state/filtersSlice";

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
  }
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

  const handleKeyDown = async (e) => {
    const trimedText = inputText.trim();
    if (e.which === 13 && trimedText){
      setSaveStatus("saving");
      await dispatch(saveNewTodo(inputText));
      setInputText("");
      setSaveStatus("idle");
    }
  }
  const handleChangeText = (e) => {
    setInputText(e.target.value);
  }
  const handleTodoAdd = async () => {
    // todoAddでdispatchするとstoreの更新するだけ
    // dispatch(todoAdd(inputText));

    // saveNewTodoでdispatchするとAPIにpostしたあと
    // responseがきたらstoreを更新する
    const trimedText = inputText.trim();
    if(trimedText){
      setSaveStatus("saving");
      await dispatch(saveNewTodo(inputText));
      setInputText("");
      setSaveStatus("idle");
    }
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
  const isSaving = saveStatus === "saving";
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
