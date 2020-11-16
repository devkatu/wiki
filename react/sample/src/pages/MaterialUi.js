import './MenuList.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

import Container from '@material-ui/core/Container';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
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



// レンダリング、タッチズームを確実に行う為に、以下をheadタグに入れておくといいみたい
{/* <meta
  name="viewport"
  content="minimum-scale=1, initial-scale=1, width=device-width"
/> */}


export default function MaterialUi(props) {
  return (
    <div>
      <h2>MaterialUiのサンプル</h2>
      <p>詳しくは公式DOC参照</p>
      <Container>
        <AppBar position="static">
          <Toolbar>
            <IconButton>
              <MenuIcon/>
            </IconButton>
            <Typography variant="h6">
            News
          </Typography>
          <Button>Login</Button>
          </Toolbar>
        </AppBar>

        {/* dateピッカー */}
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker/>
        </MuiPickersUtilsProvider>

        {/* タイポグラフィ */}
        {/* variantでスタイル、componentで実際に割り当たるhtmlタグ指定。gutterBottomは下にmarginつけるみたい */}
        <Typography variant="h1" component="h2" gutterBottom>
          Heading 1
        </Typography>
        <Typography variant="h2">
          Heading 2
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
        {/* <ButtonGroup color="primary" aria-label="outlined primary button group"> */}
        <ButtonGroup >
        <Button>click</Button>
        <Button>me</Button>
        <Button>please</Button>

        </ButtonGroup>
        <BottomNavigation showLabels>
          <BottomNavigationAction lagel="Recents" icon={<RestoreIcon />}/>
          <BottomNavigationAction lagel="Favorires" icon={<FavoriteIcon />}/>
          {/* <BottomNavigationAction lagel="Favorires" icon={<FavoriteIcon />}/> */}
        </BottomNavigation>

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
      </Container>
    </div>
  );
}