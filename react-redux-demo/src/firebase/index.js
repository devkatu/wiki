// firebaseの各サービスを使うためのインポート
// import firebase from 'firebase/app';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';
import {firebaseConfig} from './config';

// firebaseの設定ファイルをもとにこのfirebaseの初期化を行って、
// このアプリでfirebaseを使えるようにする
firebase.initializeApp(firebaseConfig);

// エントリポイントとしてexportするもの
// ここで一括しておけば他で使うとき楽
// auth     : 認証関係で使う
// db       : データ格納
// storage  : ファイル関係格納？
// functions: サーバー側の処理記述する？
// FirebaseTimestamp: サーバーからタイムスタンプを取得する
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const functions = firebase.functions();
export const FirebaseTimestamp = firebase.firestore.TimeStamp;