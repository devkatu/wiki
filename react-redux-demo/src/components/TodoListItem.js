
import { AppBar, Button, Checkbox, Container, IconButton, InputLabel, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, MenuItem, Select, TextField, Toolbar, Typography } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';
import { makeStyles } from "@material-ui/styles";
import { push } from "connected-react-router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeComplete, changeColor, updateTodo, updateComplete, updateColor, selectTodoById, changeTodos } from "../state/todosSlice";

const TodoListItem = (props) => {
  const todo = useSelector(state => selectTodoById(state, props.id));
  const [todoState, setTodoState] = useState(todo);
  console.log(todoState);
  const dispatch = useDispatch();
  const handleChangeCompleted = (e) => {
    // dispatch(changeComplete(props.id, e.target.checked));
    // dispatch(updateComplete(props.id, e.target.checked));
    dispatch(updateTodo(props.id, todoState));
  }
  const handleChangeColor = (e) => {
    // dispatch(changeColor(props.id, e.target.value));
    dispatch(updateColor(props.id, e.target.value))
  }

  return (
    <ListItem>
      <ListItemIcon>
        <Checkbox
          edge="start"
          // checked={props.todo.completed}
          // checked={todo.completed}
          checked={todoState.completed}
          disableRipple
          onChange={handleChangeCompleted}          
        />
      </ListItemIcon>
      <ListItemText
        // primary={props.todo.text}
        // primary={todo.text}
        primary={todoState.text}
      />
      <ListItemSecondaryAction>
        <Select
          edge="end"
          // value={props.todo.color}
          // value={todo.color}
          value={todoState.color}
          onChange={handleChangeColor}
        >
          <MenuItem value={"green"}>green</MenuItem>
          <MenuItem value={"red"}>red</MenuItem>
          <MenuItem value={"blue"}>blue</MenuItem>

        </Select>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default TodoListItem;
