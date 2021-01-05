
import { AppBar, Button, Checkbox, Container, IconButton, InputLabel, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, MenuItem, Select, TextField, Toolbar, Typography } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from "@material-ui/styles";
import { push } from "connected-react-router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeComplete, changeColor, updateTodo, updateComplete, updateColor, selectTodoById, changeTodos, deleteTodo } from "../state/todosSlice";


const TodoListItem = (props) => {
  const todo = useSelector(state => selectTodoById(state, props.id));
  const dispatch = useDispatch();

  const handleChangeCompleted = (e) => {
    const newTodo = {...todo,completed: e.target.checked};
    dispatch(updateTodo(props.id, newTodo));
  }
  const handleChangeColor = (e) => {
    const newTodo = {...todo,color: e.target.value};
    dispatch(updateTodo(props.id, newTodo));
  }
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
        primary={todo.text}
      />
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
        <IconButton
          aria-label="delete"
          onClick={handleDelete}
          >
          <DeleteIcon/>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default TodoListItem;
