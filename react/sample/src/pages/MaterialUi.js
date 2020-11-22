import './MenuList.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ShareIcon from '@material-ui/icons/Share';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridList';
import GridListTileBar from '@material-ui/core/GridList';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import NavigationIcon from '@material-ui/icons/Navigation';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Drawer from '@material-ui/core/Drawer';
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Hidden } from '@material-ui/core';




// レンダリング、タッチズームを確実に行う為に、以下をheadタグに入れておくといいみたい
{/* <meta
  name="viewport"
  content="minimum-scale=1, initial-scale=1, width=device-width"
/> */}


const drawerWidth = 250;

// ★materialuiのコンポーネントにスタイル適用するときはこれがいいかも？
// 他にもwithStyles(高階コンポーネント式)とかstyledコンポーネントとかあるけど・・・
// 全体的に統一感のあるやつ作りたいならthemeを適用かな？？
// ・makeStylesのコールバックに引数themeを入れるとMuiThemeProviderに設定した
// themeを参照することができる
// ・makeStylesの引数はそのままオブジェクトをいれてもよい
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  menuButton: {
    // theme.spacingはデフォルトでは引数×8px
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: "none"
    }
  },
  title: {
    textAlign: 'left',
    flexGrow: 1,

    color: theme.status.danger,
  },
  drawer: {
    position: "relative",
    width: drawerWidth
  },
  list: {
    width: drawerWidth,
  },
  container: {
    padding: "80px 20px 0",

    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      
    }
  },
  cardWrap: {
    display: "flex",
    flexWrap: "wrap"
  },
  card: {
    maxWidth: 345,
    marginRight: 15,
    marginBottom: 15
  },
  cardMedia: {
    height: 140,
  }
}));


export default function MaterialUi(props) {
  const classes = useStyles();

  // const [value, setValue] = React.useState('recents');
  const [state, setState] = React.useState({
    showDrawer: false,
  });

  // ドロワーメニューの切替ハンドラ
  const toggleDrawer = (open) => (event) => {
    setState({ ...state, showDrawer: open });
  };

  // ドロワーメニューに表示する内容
  function DrawerList() {
    return (
      <div
        className={classes.list}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}>
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </div>
    )
  }

  return (
    <div>

      {/* materialuiでのデフォルトのスタイルを適用できるようにする */}
      <CssBaseline />

      {/* ドロワーメニューとその中に表示する内容 */}
      {/* anchor: ドロワーを表示する位置 */}
      {/* open: ドロワーの表示、非表示切替bool */}
      {/* onClose: 閉じる時の処理。ここではopenに使用するstateをfalseにしてあげている。これを記述しないと閉じない */}
      {/* variant: permanentで常に表示する。デフォルトはtemporary */}
      <Hidden smDown>
      <Drawer variant="permanent" anchor="left" open={state.showDrawer} onClose={toggleDrawer(false)} className={classes.drawer}>
        <DrawerList/>
      </Drawer>
      </Hidden>
      <Hidden mdUp>
        <Drawer open={state.showDrawer} onClose={toggleDrawer(false)} className={classes.drawer}>
          <DrawerList/>
        </Drawer>
      </Hidden>

      {/* アプリバー */}
      <AppBar className={classes.appBar} >
        <Toolbar>
          {/* IconButtonクリックにてドロワーメニューの切替 */}
          <IconButton edge="start" className={classes.menuButton} onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            News
              </Typography>
          <Button>Login</Button>
        </Toolbar>
      </AppBar>


      {/* 中央揃えにするレイアウト用のコンポーネント */}
      {/* <Container className={classes.container}> */}
      <div className={classes.container}>

        {/* タイポグラフィ */}
        {/* variantでスタイル、componentで実際に割り当たるhtmlタグ指定。gutterBottomは下にmarginつけるみたい */}
        <Typography variant="h1" component="h2" gutterBottom>
          MaterialUiのサンプル
        </Typography>
        <Typography variant="h2">
          いろんなUIが最初から使えるよ！<br />詳しくは公式DOC参照
        </Typography>
        <Typography variant="h3">
          Heading 3
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          subtitle1. title title title title title title title title
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          subtitle2. title title title title title title title title
        </Typography>
        <Typography variant="body1" gutterBottom>
          body1. text text text text text text text text text text
        </Typography>
        <Typography variant="body2" gutterBottom>
          body2. text text text text text text text text text text
        </Typography>

        {/* カード */}
        <div className={classes.cardWrap}>
          {[1, 2, 3, 4, 5, 6].map((key) => (
            <Card key={key} className={classes.card}>
              <CardActionArea>
                <CardMedia
                  className={classes.cardMedia}
                  image={"./images/image" + key + ".png"}
                  title="card title" />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    image{key}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    image{key} の説明部
                    image{key} の説明部
                    image{key} の説明部
                    image{key} の説明部
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                {/* <Button size="small" color="primary"> */}
                <Button size="small">
                  <FavoriteIcon />
                </Button>
                <Button size="small">
                  <ShareIcon />
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>


        {/* dateピッカー */}
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker />
        </MuiPickersUtilsProvider>

        {/* <ButtonGroup color="primary" aria-label="outlined primary button group"> */}
        <ButtonGroup >
          <Button>click</Button>
          <Button>me</Button>
          <Button>please</Button>

        </ButtonGroup>


        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
        <Fab color="secondary" aria-label="edit">
          <EditIcon />
        </Fab>
        <Fab variant="extended">
          <NavigationIcon />
        Navigate
      </Fab>
        <Fab disabled aria-label="like">
          <FavoriteIcon />
        </Fab>
      </div>

      {/* ボトムナビゲーション */}
      <BottomNavigation showLabels>
        <BottomNavigationAction label="Recents" value="recents" icon={<RestoreIcon />} />
        <BottomNavigationAction label="Favorires" value="favorites" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="Nearby" value="nearby" icon={<LocationOnIcon />} />
        <BottomNavigationAction label="Nearby" value="nearby" icon={<LocationOnIcon />} />
      </BottomNavigation>
    </div>
  );
}