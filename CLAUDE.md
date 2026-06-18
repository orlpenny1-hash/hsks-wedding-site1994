# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static wedding website for SHODAI & SAYAKA (2026.09.13). No build tools or package manager — open `index.html` directly in a browser or serve with any static file server.

## Architecture

### ファイル構成

- **`index.html`** — 全セクションを1ファイルに収録。順序: Hero → Groom Profile → Bride Profile → Couple (Our Story) → Guest Message → Secret Code → Guest Page (overlay) → Travel Modal (overlay) → Movie Modal (overlay)
- **`css/style.css`** — 全スタイル。セクションはコメントで明確に区切られており HTML の順序と対応している
- **`js/guests.js`** — ゲストデータのみ。`GUESTS` オブジェクトをコード文字列をキーに定義
- **`js/app.js`** — 全インタラクション。`guests.js` の `GUESTS` に依存。読み込み順は `guests.js → app.js`

### app.js の主要モジュール（宣言順）

| 定数 / 関数 | 役割 |
|------------|------|
| `GROOM_BG_IMAGES` / `BRIDE_BG_IMAGES` | マソンリー背景の画像リスト |
| `buildGroomMasonry()` / `buildBrideMasonry()` | プロフィールセクションの縦スクロール無限マソンリー背景をDOMで構築 |
| `fadeObserver` | IntersectionObserver によるスクロールフェードイン (`.fade-in` 要素) |
| `MOVIES` | 映画データ配列。`file` / `title` / `message` を持つ |
| `initFilmFrames()` | `MOVIES` をシャッフルして2本のフィルムトラックに振り分けDOMを生成 |
| `initFilmStrips()` | フィルムフレームを画面幅の3倍以上になるまで `cloneNode` で複製しアニメーション距離を設定 |
| `openMovieModal()` / `closeMovieModal()` | 映画モーダルの開閉（`#movieModal`） |
| `travelPath(p)` | `images/travels/` ベースでパスセグメントごとに `encodeURIComponent` するヘルパー |
| `TRAVELS` | 旅行データ配列。`cover` / `images[]` / `label` / `date` を持つ |
| `initCoverFlow()` | Cover Flow カルーセルを構築。スワイプ・カードタップでナビゲート |
| `openTravelModal()` / `closeTravelModal()` | 旅行モーダルの開閉（`#travelModal`） |
| `submitCode()` / `openGuestPage()` / `closeGuestPage()` | ゲストコード照合とゲストページ開閉 |

## ゲストコードシステム

席札のコードを入力するとゲスト専用ページが開く。コードは `.toUpperCase()` 後にルックアップされるので大文字小文字不問。

`js/guests.js` に追加：
```js
"GUESTCODE": {
  name: "田中 次郎 様",
  message: "メッセージ本文（\\n で改行）",
  image: ""  // 画像パスを指定、不要なら空文字
}
```

## 映画フィルムシステム

`MOVIES` 配列にデータを追加するだけで反映される。フィルムフレームは `initFilmFrames()` でシャッフルして動的生成されるため HTML 側は変更不要。クリックはイベント委譲（`.film-strip-wrap` で受け取り）で処理するため、`cloneNode` で複製されたフレームにも反応する。

## 旅行ギャラリー（Cover Flow）

`TRAVELS` 配列を編集して旅行を追加・変更する。

```js
{
  cover:  'フォルダ名/cover.jpg',       // Cover Flow に表示する1枚
  images: ['フォルダ名/1.jpg', ...],    // モーダルに表示する4枚
  label: '行き先',
  date:  '2024.05',
}
```

画像は `images/travels/<フォルダ名>/` に配置。フォルダ名・ファイル名に日本語を使える（`travelPath()` がセグメントごとにエンコードする）。

現在のフォルダ:
- `東北2022.5` / `岐阜2022.9` / `鳥取・島根・兵庫2023.5` / `大阪2023.11` / `静岡2024.5` / `北海道2025.5`

## 画像フォルダ一覧

| フォルダ | 用途 |
|---------|------|
| `images/GROOMbackg/` | 新郎プロフィールのマソンリー背景（12枚、`GROOM_BG_IMAGES` に列挙） |
| `images/BRIDEbackg/` | 新婦プロフィールのマソンリー背景（11枚、`BRIDE_BG_IMAGES` に列挙） |
| `images/movies/` | 映画ポスター（`.jfif` 形式、`MOVIES[].file` で参照） |
| `images/travels/<フォルダ名>/` | 旅行写真（`TRAVELS[].cover` / `.images[]` で参照） |
| `images/groomandbride/` | Couple セクション背景（HTML inline style で直接参照） |
| `images/` (root) | Hero・Couple セクション背景（HTML inline style で直接参照） |

## CSS メモ

- ダークテーマ: `--color-bg: #090908`、ゴールドアクセント: `--color-gold: #c9a96e`
- レスポンシブは `@media (max-width: 640px)` と `@media (max-width: 400px)` のみ（`style.css` 末尾）
- マソンリー背景の明暗は `.masonry-bg { filter: brightness(...) }` で新郎新婦まとめて制御
- Cover Flow カードのサイズ変更時は `width` / `height` / `margin-left`（= `-width/2`）/ ギャラリー `height` を合わせて調整する
