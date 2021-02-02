
import { AppBar, Button, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { makeStyles } from "@material-ui/styles";
import { push } from "connected-react-router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { signOut } from "../state/usersSlice";

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
      {/* onColseにドロワー閉じる関数を設定しとかないとどこかクリックしたときにドロワーが閉じないよ！ */}
      <div className={classes.list}>
        <List>
          <ListItem>
            <ListItemIcon><InfoIcon /></ListItemIcon>
            <ListItemText primary="このサイトについて"></ListItemText>
          </ListItem>
          <Divider/>
          {/* dispatch(push('./')) でページ遷移するよ */}
          <ListItem button onClick={() => {dispatch(push('./'))}}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="ホーム"></ListItemText>
          </ListItem>
          <ListItem button onClick={() => {dispatch(push('./a'))}}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="設定"></ListItemText>
          </ListItem>
          <ListItem button onClick={() => {dispatch(signOut())}}>
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="サインアウト"></ListItemText>
          </ListItem>
        </List>
      </div>

    </Drawer>
  )
}

export default DrawerMenu;
