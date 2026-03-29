ArticleCard(記事カード)というコンポーネントの例は

```jsx
const ArticleCard = ({ title, date }) => {

  const toggleLike = () => {...}

  return (
    <article className="card">
      <span className="date">{date}</span>
      <h2>{title}</h2>
      <button onClick={toggleLike}>いいね！</button>
    </article>
  );
};
```

```jsx
import { useState } from "react";

const LikeButton = () => {
  // 1. 状態（State）を定義する
  // liked: いいね中かどうか (true/false)
  // count: いいねの数
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(100);

  // 2. ボタンが押された時の処理
  const toggleLike = () => {
    if (liked) {
      // すでに「いいね」なら解除する
      setLiked(false);
      setCount(count - 1);
    } else {
      // 「いいね」していなければ追加する
      setLiked(true);
      setCount(count + 1);
    }
  };

  return (
    <div className="like-container">
      {/* 3. 状態(liked)によって、見た目（クラス名やテキスト）を切り替える */}
      <button 
        className={`like-button ${liked ? "active" : ""}`}
        onClick={toggleLike}
      >
        {liked ? "❤️ いいね済み" : "🤍 いいね"}
      </button>

      <span className="like-count">{count}</span>
    </div>
  );
};

export default LikeButton;
```

props.children

```jsx
// 子要素に記述した要素はchildrenとして受け取る
const ContentBlock = ({ title, children }) => {
  return (
    <div className="content-block">
      <h2 className="block-title">{title}</h2>
      {/* 子要素(children)を以下に流し込む */}
      <div className="block-body">{children}</div>
    </div>
  );
};
```

```jsx{4-7}
const App = () => {
  return (
    {/* ContentBlockの子要素を記述する */}
    <ContentBlock title="最新のニュース">
      <p>ここにお知らせの文章が入ります。</p>
      <button>一覧を見る</button>
    </ContentBlock>
  );
};
```