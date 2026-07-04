// ゲストデータ: グループ合言葉 → グループLP → 4桁番号 → 個別ページ
// passphrase: 大文字小文字不問（内部で toUpperCase() して照合）
// guests のキー: 4桁数字文字列（"0001"〜"9999"）

const GROUPS = {

  // ---- サンプルグループA（親族想定） ----
  "GROUP_A": {
    passphrase: "SAKURA",
    name: "新郎ご親族の皆様へ",
    photos: [
      "images/groomandbride/LINE_ALBUM_202251-5_260615_1.jpg",
    ],
    message: "本日はお忙しい中\n私たちの結婚披露宴にお越しいただき\n誠にありがとうございます。\n\nいつも温かく見守ってくださる皆様に\n心から感謝しています。\n\nどうぞ最後までお楽しみください。",
    guests: {
      "0001": {
        name: "山田 太郎 様",
        message: "本日はお忙しい中、\n私たちの結婚披露宴にお越しいただき\n誠にありがとうございます。\n\nいつも温かく見守ってくださる太郎さんに\n心から感謝しています。\n\nこれからも変わらずよろしくお願いいたします。",
        image: ""
      },
      "0002": {
        name: "山田 花子 様",
        message: "本日はお越しいただき\nありがとうございます。\n\n花子さんとの思い出は\nいつも私たちの宝物です。",
        image: ""
      }
    }
  },

  // ---- サンプルグループB（友人想定） ----
  "GROUP_B": {
    passphrase: "HOSHI",
    name: "友人の皆様へ",
    photos: [
      "images/groomandbride/LINE_ALBUM_2023113.4大阪旅行_260615_1.jpg",
      "images/groomandbride/LINE_ALBUM_2023113.4大阪旅行_260615_2.jpg",
    ],
    message: "本日はお忙しい中\n私たちの結婚披露宴にお越しいただき\nありがとうございます。\n\nいつもそばで支えてくれる皆さんに\n感謝の気持ちでいっぱいです。\n\n今日は思い切り楽しんでください！",
    guests: {
      "0001": {
        name: "鈴木 次郎 様",
        message: "これはデモ用のメッセージページです。\n\nSHODAI & SAYAKA より、\n心を込めたメッセージが届きます。",
        image: ""
      }
    }
  },

  // ---- 中学グループ（豊中バスケ部） ----
  "GROUP_JHS": {
    passphrase: "RINGOバスケ",
    name: "豊中バスケ部のみんなへ！",
    customHero: "jersey",
    heroImage: "images/groupLP/TYNJH/ユニ.png",
    photos: [],
    message: "中学でみんなと過ごした時間は\n本当に最高の思い出です！\nみんなに出会えて良かった！\n\n最近は体もなまって\nバスケはだいぶご無沙汰だけど\nまたこのメンツで集まってバスケしたり\n飲みに行ったりしましょう！",
    guests: {
      // TODO: 4人分のゲスト情報を追加予定
    }
  },

  // ---- 高校グループ ----
  "GROUP_HS": {
    passphrase: "ちょうこうきかい",
    name: "", // TODO: 表示名未定
    photos: [
      // TODO: 写真追加予定
    ],
    message: "", // TODO: メッセージ未定
    guests: {
      // TODO: ゲスト情報を追加予定
    }
  },

  // ---- 大学グループ ----
  "GROUP_UNIV": {
    passphrase: "NUPALS",
    name: "", // TODO: 表示名未定
    photos: [
      // TODO: 写真追加予定
    ],
    message: "", // TODO: メッセージ未定
    guests: {
      // TODO: ゲスト情報を追加予定
    }
  },

  // ---- 職場グループ ----
  "GROUP_WORK": {
    passphrase: "TAIYOUSUN",
    name: "", // TODO: 表示名未定
    photos: [
      // TODO: 写真追加予定
    ],
    message: "", // TODO: メッセージ未定
    guests: {
      // TODO: ゲスト情報を追加予定
    }
  },

  // ---- グループ追加例 ----
  // "GROUP_C": {
  //   passphrase: "TSUKI",
  //   name: "職場の皆様へ",
  //   photos: ["images/groomandbride/xxx.jpg"],
  //   message: "メッセージ",
  //   guests: {
  //     "0001": { name: "田中 三郎 様", message: "...", image: "" },
  //   }
  // },

};
