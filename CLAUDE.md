# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static wedding website for SHODAI & SAYAKA (2026.09.13). No build tools or package manager — open `index.html` directly in a browser or serve with any static file server.

## Architecture

### ファイル構成

- **`index.html`** — 全セクションを1ファイルに収録。順序: Hero → Groom Profile → Bride Profile → Couple (Our Story) → Guest Message → Secret Code → Group Page (overlay) → Guest Page (overlay) → Travel Modal (overlay) → Movie Modal (overlay)
- **`css/style.css`** — 全スタイル。セクションはコメントで明確に区切られており HTML の順序と対応している
- **`js/guests.js`** — ゲストデータのみ。`GROUPS` オブジェクトを定義（後述）
- **`js/app.js`** — 全インタラクション。`guests.js` の `GROUPS` に依存。読み込み順は `guests.js → app.js`

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
| `BballAnimationController` / `initBballAnimation()` / `stopBballAnimation()` | 中学グループ専用の GBA風バスケアニメーション（`#bballStage`）。`customHero: 'jersey'` のグループページを開いたときだけ遅延生成・再生し、閉じたら停止する |
| `initCoverFlow()` | Cover Flow カルーセルを構築。スワイプ・カードタップでナビゲート |
| `openTravelModal()` / `closeTravelModal()` | 旅行モーダルの開閉（`#travelModal`） |
| `currentGroup` | 現在選択中のグループを保持するモジュール変数 |
| `submitPassphrase()` | 合言葉照合 → `openGroupPage()` 呼び出し（ステップ1） |
| `openGroupPage()` / `closeGroupPage()` | グループLP overlayの開閉（`#groupPage`） |
| `submitGuestNumber()` | 4桁番号照合 → `openGuestPage()` 呼び出し（ステップ2） |
| `openGuestPage()` / `closeGuestPage()` | ゲスト個別ページの開閉（`#guestPage`） |

## 2段階ゲスト認証システム

席札の「合言葉」→「4桁番号」の2段階でゲスト専用ページを開く。

**認証フロー:**
```
#secret セクション（合言葉入力）
  ↓ GROUPS から passphrase.toUpperCase() で照合
#groupPage overlay（グループLP: 写真・メッセージ・4桁入力）
  ↓ currentGroup.guests[num] で照合
#guestPage overlay（個別メッセージページ）
```

`js/guests.js` にグループを追加：
```js
"GROUP_KEY": {
  passphrase: "KOTOBA",        // 合言葉（大文字小文字不問）
  name: "〇〇の皆様へ",
  photos: [                    // 1〜2枚
    "images/groomandbride/xxx.jpg",
  ],
  message: "グループ向けメッセージ（\\n で改行）",
  guests: {
    "0001": { name: "田中 太郎 様", message: "個別メッセージ", image: "" },
    "0002": { name: "田中 花子 様", message: "個別メッセージ", image: "" },
  }
}
```

- 合言葉は `toUpperCase()` で正規化してから照合
- ゲストキーは4桁数字文字列（`"0001"`〜`"9999"`）
- グループページの写真は合言葉入力後に初めて読み込まれる（初期ロードに影響しない）

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
| `images/groomandbride/` | Couple セクション背景・グループページ写真（HTML inline style または `GROUPS[].photos[]` で参照） |
| `images/` (root) | Hero・Couple セクション背景（HTML inline style で直接参照） |

## CSS メモ

- クリーム/アイボリーテーマ: `--color-bg: #faf6f0`、ゴールドアクセント: `--color-gold: #c9a96e`
- テキストはウォームダークブラウン: `--color-text: #2c2318`
- 写真背景のあるセクション（Hero・プロフィール・Couple・Secret）は独自のダークオーバーレイを持つため本文テキストは白のまま
- レスポンシブは `@media (max-width: 640px)` と `@media (max-width: 400px)` のみ（`style.css` 末尾）
- マソンリー背景の明暗は `.masonry-bg { filter: brightness(...) }` で新郎新婦まとめて制御
- Cover Flow カードのサイズ変更時は `width` / `height` / `margin-left`（= `-width/2`）/ ギャラリー `height` を合わせて調整する
- z-index 順序: 映画モーダル(4000) → 旅行モーダル(4500) → グループページ(4800) → ゲストページ(5000)
-.クロード各担当はユーザーが声を掛けたら返事する
