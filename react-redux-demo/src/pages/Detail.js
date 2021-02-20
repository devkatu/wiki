import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../firebase";

const Detail = (props) => {
  const selector = useSelector(state => state);
  const dispatch = useDispatch();
  const [complete, setComplete] = useState("");
  const [text, setText] = useState("");
  const [color, setColor] = useState("");
  const [imgPath, setImgpath] = useState("");

  const query = selector.router.location.search;
  const id = query.split('?id=')[1];

  // const id = window.location.pathname.split('/detail/')[1];   // パスから自分でそのあとに続くidを出す
  // const id = props.match.params.id;    //パスに付けたものを引数として取得できる。ここではpath="/detail/:id"の:id

  useEffect(() => {
    if (id) {
      db.collection('todos').doc(id).get()
      .then(snapshot => {
        const data = snapshot.data();
        setComplete(data.completed)
        setText(data.text)
        setColor(data.color)
        setImgpath(data.image.path)
      })
    }
  }, [])

  return (
    <>
      <h2>detail</h2>
      <dl>
        <dt>状態</dt>
        <dd>{complete ? "完了" : "未完"}</dd>
        <dt>分類</dt>
        <dd>{color}</dd>
        <dt>本文</dt>
        <dd>{text}</dd>
        <dt>画像</dt>
        <dd><img src={imgPath} alt=""/></dd>
      </dl>
    </>
  )
}

export default Detail;