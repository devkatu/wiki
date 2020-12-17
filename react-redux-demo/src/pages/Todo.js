
import { AppBar, Button, Checkbox, Container, IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, MenuItem, Select, TextField, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/styles";
import { push } from "connected-react-router";
import { useDispatch, useSelector } from "react-redux";

import Header from '../components/Header';
import DrawerMenu from "../components/DrawerMenu";
import { TodayOutlined } from "@material-ui/icons";
import { useState } from "react";

const useStyles = makeStyles({

});

const Todo = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [inputText, setInputText] = useState("");
  const todos = useSelector(state => state.todos.entities);

  const inputTextHandler = (e) => {
    setInputText(e.target.value);
  }
  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <TextField placeholder="やることを入力してね" label="TODO" onChange={inputTextHandler}/>
        <Button
        variant="contained"
          onClick={() => { dispatch({
            type: "TODOS/TODO_ADDED",
            payload: {
              text: inputText
            }
          }) }}>
          Todoを登録する
        </Button>
        <List>
          {todos.map((todo, index) =>
            <ListItem key={index}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={todo.completed}
                  disableRipple
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
