
import { AppBar, Button, IconButton, Toolbar, Typography } from "@material-ui/core";
import MenuIcon  from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/styles";
import { push } from "connected-react-router";
import { useDispatch } from "react-redux";

import Header from '../components/Header';
import DrawerMenu from "../components/DrawerMenu";

import styles from '../assets/css/setting/Setting.module.css';

import image from '../assets/img/setting/hair_barcode.png';

const useStyles = makeStyles({

});


const Setting = () => {
  console.log(image);
  const dispatch = useDispatch();
  const classes = useStyles();
  return (
    <>
      <Header/>
      <img src={image} alt="barcode image"/>
      <div className={styles.box}/>
    </>
  )
}

export default Setting;
