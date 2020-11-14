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
import { DatePicker } from "@material-ui/pickers";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import NavigationIcon from '@material-ui/icons/Navigation';


export default function MaterialUi(props) {
  return (
    <div>
      <h2>MaterialUiのサンプル</h2>
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