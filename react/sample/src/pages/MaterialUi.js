import './MenuList.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridList';
import GridListTileBar from '@material-ui/core/GridList';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

export default function MaterialUi(props) {
  return (
    <div>
      <h2>MaterialUiのサンプル</h2>
      <Button>click</Button>
      <GridList>
        <GridListTile>
          <img src="./images/image1.png" alt=""/>
          <GridListTileBar
            title="title"
            subtitle="subtitle"
            actionIcon={
              <IconButton>
                <InfoIcon/>
              </IconButton>
            }>
          </GridListTileBar>
        </GridListTile>
      </GridList>
    </div>
  );
}
