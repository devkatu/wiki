
import { AppBar, Button, IconButton, Toolbar, Typography } from "@material-ui/core";
import MenuIcon  from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/styles";
import { push } from "connected-react-router";
import { useDispatch } from "react-redux";

import Header from '../components/Header';
import DrawerMenu from "../components/DrawerMenu";

import styles from '../assets/css/setting/Setting.module.css';

import image from '../assets/img/setting/hair_barcode.png';
import { useState } from "react";
import Swiper from "react-id-swiper";

const useStyles = makeStyles({
  swiperBox: {
    width: 300,
    height: 300
  }
});


const Setting = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [params] = useState({
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
      dynamicBullets: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    loop: true,
    spaceBetween: 30
  })
  return (
    <>
      <Header/>
      {/* 画像をインポートするとbuild後に使用されるパス文字列が返される。srcにそのパスを適用すればOK */}
      <img src={image} alt="barcode image"/>

      {/* cssモジュールは変数にインポートして 変数.クラス名 とすれば適用できる */}
      <div className={styles.box}/>
      <p>swiperのテストだよん</p>
      <Swiper {...params} class={styles.swiperBox}>
        <div><img src={image} alt=""/></div>
        <div><img src={image} alt=""/></div>
      </Swiper>
    </>
  )
}

export default Setting;
