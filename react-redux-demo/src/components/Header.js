
import { AppBar, Badge, Button, IconButton, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/styles";
import { push } from "connected-react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DrawerMenu from "./DrawerMenu";
import { selectCompletedTodos, selectTodos } from "../state/todosSlice";
import { db } from "../firebase";

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
  const completedTodosCount = useSelector(selectCompletedTodos);
  let todos = useSelector(selectTodos);
  const [state, setState] = useState({
    drawerOpen: false,
  });

  useEffect(() => {
    // collectionの変化をリッスンするよう指示する関数
    // トラハックではこの中でstoreを変更していた
    
    const unsubscribe = db.collection('todos')
      .onSnapshot(snapshots => {
        snapshots.docChanges().forEach(change => {
          const data = change.doc.data(); // collectionのデータが入る
          const changeType = change.type;
          switch (changeType) {
            // collectionが追加されたとき
            case 'added':
              console.log("added", data);
              // useEffectの第二引数にtodosを渡すと動く
              console.log(todos);
              break;
            // collectionが変更されたとき
            case 'modified':
              console.log("modified", data);
              console.log(todos);
              break;
            // collectionが削除されたとき
            case 'removed':
              console.log("removed", data);
              break;
            default:
              break;
          }
        })
      })
    // 戻り値を戻すとこのコールバックを解除することができる
    // これをやらないとコンポーネント呼出しの都度コールバック登録されるので
    // パフォーマンスおちるよ！
    return () => unsubscribe();
  }, [])

  // ドロワーメニューの開閉
  const toggleDrawer = (open) => (e) => {
    if (e.type == 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) return;
    setState({ ...state, drawerOpen: open })
  }

  return (
    <>
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit">
            {/* MenuIconをクリックすると必ずstate.drawerOpenをtrueにする。つまりドロワーを開く */}
            <MenuIcon onClick={toggleDrawer(true)} />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Todo List!
        </Typography>
          <Badge badgeContent={completedTodosCount} color="secondary">
            <Button color="inherit">やることの数</Button>
          </Badge>
        </Toolbar>
      </AppBar>
      <DrawerMenu open={state.drawerOpen} toggleDrawer={toggleDrawer} />
    </>
  )
}

export default Header;
