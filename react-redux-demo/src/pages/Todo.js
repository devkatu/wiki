
import { AppBar, Button, Checkbox, Container, IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, MenuItem, Select, TextField, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/styles";
import { push } from "connected-react-router";
import { useDispatch, useSelector } from "react-redux";

import Header from '../components/Header';
import DrawerMenu from "../components/DrawerMenu";
import { FullscreenExitTwoTone, TodayOutlined } from "@material-ui/icons";
import { useState } from "react";

import { todoAdd, changeComplete } from "../state/todosSlice";

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
  const todos = useSelector(state => state.todos.entities);

  const handleChangeText = (e) => {
    setInputText(e.target.value);
  }
  const handleTodoAdd = () => {
    dispatch(todoAdd(inputText));
  }
  const handleChangeCompleted = (e) => {
    dispatch(changeComplete(e.target.checked));
  }
  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <div className={classes.inputTodo}>
          <TextField placeholder="やることを入力してね" label="TODO" onChange={handleChangeText} />
          <Button
            variant="contained"
            onClick={handleTodoAdd}>
            Todoを登録する
          </Button>
        </div>
        <List>
          {todos.map((todo, index) =>
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
          )}
        </List>
      </Container>
    </>
  )
}

export default Todo;
