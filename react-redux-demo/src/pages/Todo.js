
import { AppBar, Button, Checkbox, Container, IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, MenuItem, Select, TextField, Toolbar, Typography } from "@material-ui/core";
import MenuIcon  from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/styles";
import { push } from "connected-react-router";
import { useDispatch, useSelector } from "react-redux";

import Header from '../components/Header';
import DrawerMenu from "../components/DrawerMenu";

const useStyles = makeStyles({

});

const Todo = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const st = useSelector(state => state);
  return (
    <>
      <Header/>
      <Container maxWidth="sm">
        <TextField placeholder="やることを入力してね" label="TODO" fullWidth/>
        <button onClick={() => {dispatch({type: "TEST",payload: "payload test"})}}>test action</button>
        <p>{st.todos.todos.todo}</p>
        <List>
          <ListItem>
            <ListItemIcon>
            <Checkbox
              edge="start"
              // checked={}
              disableRipple
            />
            </ListItemIcon>
            <ListItemText primary={"aaa"}/>
            <ListItemSecondaryAction>
              <Select
                edge="end"
                // value={}
                // onChange={}
              >
                <MenuItem value={"green"}>green</MenuItem>
                <MenuItem value={"red"}>red</MenuItem>
                <MenuItem value={"blue"}>blue</MenuItem>
                
              </Select>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemIcon>
            <Checkbox
              edge="start"
              // checked={}
              disableRipple
            />
            </ListItemIcon>
            <ListItemText primary={"aaa"}/>
            <ListItemSecondaryAction>
              <Select
                edge="end"
                // value={}
                // onChange={}
              >
                <MenuItem value={"green"}>green</MenuItem>
                <MenuItem value={"red"}>red</MenuItem>
                <MenuItem value={"blue"}>blue</MenuItem>
                
              </Select>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Container>
    </>
  )
}

export default Todo;
