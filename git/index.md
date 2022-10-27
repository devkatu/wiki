# Git

## 初期化
```
$ git init
```

## 変更のステージ(全部)
```
$ git add .
```

## ブランチの統合
- masterから派生したブランチでのみコミットが進んでいた場合で、masterに他ブランチでの変更を取り込むなら
  ```
  $ git merge <ブランチ名>
  ```
  この場合は何もfirst-fowardマージとなる。
- masterとtopic等のブランチでそれぞれコミットが進んでしまった場合、masterに他のブランチの変更を取り込むなら
  ```
  $ git rebase <ブランチ名>
  ```
  コミットの履歴を綺麗に保ちたいのであれば、まず他のブランチをチェックアウトし、
  ```
  $ git rebase <マスター>
  その後
  ```
  $ git merge --no-ff topic-branch
  ```