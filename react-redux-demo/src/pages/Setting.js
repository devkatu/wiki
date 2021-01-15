
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
  const dispatch = useDispatch();
  const classes = useStyles();
  return (
    <>
      <Header/>
      {/* 画像をインポートするとbuild後に使用されるパス文字列が返される。srcにそのパスを適用すればOK */}
      <img src={image} alt="barcode image"/>

      {/* cssモジュールは変数にインポートして 変数.クラス名 とすれば適用できる */}
      <div className={styles.box}/>
    </>
  )
}

export default Setting;
