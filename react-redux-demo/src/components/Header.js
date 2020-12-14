
import { AppBar, Button, IconButton, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/styles";
import { push } from "connected-react-router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import DrawerMenu from "./DrawerMenu";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: "5px",
  },
  title: {
    flexGrow: 1,
  }
});

const Header = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [state, setState] = useState({
    drawerOpen: false,
  });

  const toggleDrawer = (open) => (e) => {
    if(e.type == 'keydown' && ( e.key === 'Tab' || e.key === 'Shift')) return;
    setState({ ...state, drawerOpen: open})
  }

  return (
    <>
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit">
            <MenuIcon onClick={toggleDrawer(true)}/>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Todo List!
        </Typography>
          <Button color="inherit">ぼたん</Button>
        </Toolbar>
      </AppBar>
      <DrawerMenu open={state.drawerOpen} toggleDrawer={toggleDrawer}/>
    </>
  )
}

export default Header;
