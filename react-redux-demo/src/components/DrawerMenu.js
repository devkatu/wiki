
import { AppBar, Button, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';
import { makeStyles } from "@material-ui/styles";
import { push } from "connected-react-router";
import { useState } from "react";
import { useDispatch } from "react-redux";

const useStyles = makeStyles({
  list: {
    width: 250,
  }
});

const DrawerMenu = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  return (
    <Drawer anchor="left" open={props.open} onClose={props.toggleDrawer(false)}>
      <div className={classes.list}>
        <List>
          <ListItem>
            <ListItemIcon><InfoIcon /></ListItemIcon>
            <ListItemText primary="このサイトについて"></ListItemText>
          </ListItem>
          <Divider/>
          <ListItem button onClick={() => {dispatch(push('./'))}}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="ホーム"></ListItemText>
          </ListItem>
          <ListItem button onClick={() => {dispatch(push('./a'))}}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="設定"></ListItemText>
          </ListItem>
        </List>
      </div>

    </Drawer>
  )
}

export default DrawerMenu;
