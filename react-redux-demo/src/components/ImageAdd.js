import {useCallback, useState} from "react";

import { IconButton, makeStyles } from "@material-ui/core";
import { AddPhotoAlternate } from "@material-ui/icons";

import {storage} from "../firebase"
import { useDispatch } from "react-redux";
import { updateTodo } from "../state/todosSlice";

const useStyles = makeStyles({
  hide: {
    display: "none"
  }
})


const ImageAdd = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // firebaseへのファイルアップロード用ハンドラ
  const uploadImage = useCallback((e) => {
    const file = e.target.files;
    let blob = new Blob(file, { type: "image/jpeg" });
  
    // 16ディジットのランダム文字列を生成する
    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N = 16;
    const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n) => S[n % S.length]).join('');
  
    const uploadTask = storage.ref('images').child(fileName).put(blob);
    uploadTask.then(() => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        const newImage = { id: fileName, path: downloadURL };
        // props.setImage(newImage);
        props.handleImageAdd(newImage);        
      })
    });
  }, [])  

  return (
    <>
      <IconButton>
        <label>
          <AddPhotoAlternate />
          <input
            type="file"
            className={classes.hide}
            onChange={uploadImage}
          />
        </label>
      </IconButton>
    </>
  )
}

export default ImageAdd;