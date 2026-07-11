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
    message: "中学でみんなと過ごした時間は\n本当に最高の思い出です！\nみんなに出会えて良かった！\n最近は体もなまって\nバスケはだいぶご無沙汰だけど\nまたこのメンツで集まってバスケしたり\n飲みに行ったりしましょう！",
    guests: {
      // TODO: 4人分のゲスト情報を追加予定
    }
  },

  // ---- 高校グループ ----
  "GROUP_HS": {
    passphrase: "ちょうこうきかい",
    name: "長工イツメンへ！",
    customHero: "photoStory",
    heroImage: "images/groupLP/NGNKG/LINE_ALBUM_20241207_260706_1.jpg",
    photos: [
      "images/groupLP/NGNKG/IMG_0354_web.jpg",
      "images/groupLP/NGNKG/LINE_ALBUM_20190505_260706_1.jpg",
      "images/groupLP/NGNKG/LINE_ALBUM_20190505_260706_2.jpg",
      "images/groupLP/NGNKG/LINE_ALBUM_20190505_260706_3.jpg",
      "images/groupLP/NGNKG/LINE_ALBUM_20190505_260706_4.jpg",
      "images/groupLP/NGNKG/LINE_ALBUM_20190505_260706_5.jpg",
      "images/groupLP/NGNKG/LINE_ALBUM_20190505_260706_6.jpg",
      "images/groupLP/NGNKG/LINE_ALBUM_20190817_260706_1.jpg",
      "images/groupLP/NGNKG/LINE_ALBUM_20250824_260706_1.jpg",
      "images/groupLP/NGNKG/LINE_ALBUM_20250824_260706_2.jpg",
      "images/groupLP/NGNKG/LINE_ALBUM_20250824_260706_3.jpg",
      "images/groupLP/NGNKG/LINE_ALBUM_20250824_260706_4.jpg",
      "images/groupLP/NGNKG/LINE_ALBUM_20250824_260706_5.jpg",
      "images/groupLP/NGNKG/LINE_ALBUM_20250824_260707_1.jpg",
      "images/groupLP/NGNKG/P1010782_web.jpg",
      "images/groupLP/NGNKG/P1030347_web.jpg",
      "images/groupLP/NGNKG/P1050988_web.jpg",
    ],
    message: "みんなと過ごしているときはずっと笑っていて\nどんなに年を重ねても集まれば高校の時の姿に戻れる最高のメンツ！\n\n出会えたことに心から感謝！\n\nこれからもみんなでたくさん笑ってたくさん呑んで行きましょう！！",
    guests: {
      // TODO: ゲスト情報を追加予定
    }
  },

  // ---- 大学グループ ----
  "GROUP_UNIV": {
    passphrase: "NUPALS",
    name: "TODO: 表示名未定", // TODO: 表示名未定
    customHero: "puzzle",
    // ファイル名はスマホ表示(4列)でのマソンリー配置セル番号(列A〜D・上から1,2,3...)に対応
    photos: [
      "images/groupLP/NGTYKD/A1.jpg",
      "images/groupLP/NGTYKD/D6.jpg",
      "images/groupLP/NGTYKD/B3.jpg",
      "images/groupLP/NGTYKD/B2.jpg",
      "images/groupLP/NGTYKD/C9.jpg",
      "images/groupLP/NGTYKD/B4.jpg",
      "images/groupLP/NGTYKD/D5.jpg",
      "images/groupLP/NGTYKD/A7.jpg",
      "images/groupLP/NGTYKD/C7.jpg",
      "images/groupLP/NGTYKD/A8.jpg",
      "images/groupLP/NGTYKD/C2.jpg",
      "images/groupLP/NGTYKD/D3.jpg",
      "images/groupLP/NGTYKD/B6.jpg",
      "images/groupLP/NGTYKD/B1.jpg",
      "images/groupLP/NGTYKD/A3.jpg",
      "images/groupLP/NGTYKD/C3.jpg",
      "images/groupLP/NGTYKD/A2.jpg",
      "images/groupLP/NGTYKD/A6.jpg",
      "images/groupLP/NGTYKD/C1.jpg",
      "images/groupLP/NGTYKD/C6.jpg",
      "images/groupLP/NGTYKD/D7.jpg",
      "images/groupLP/NGTYKD/C4.jpg",
      "images/groupLP/NGTYKD/A5.jpg",
      "images/groupLP/NGTYKD/D2.jpg",
      "images/groupLP/NGTYKD/A4.jpg",
      "images/groupLP/NGTYKD/B5.jpg",
      "images/groupLP/NGTYKD/D4.jpg",
      "images/groupLP/NGTYKD/C5.jpg",
      "images/groupLP/NGTYKD/C8.jpg",
      "images/groupLP/NGTYKD/D8.jpg",
      "images/groupLP/NGTYKD/B7.jpg",
      "images/groupLP/NGTYKD/D1.jpg",
    ],
    message: "TODO: 完成後メッセージ未定", // TODO: メッセージ未定
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

  // ---- 新婦グループ: たまめん ----
  "GROUP_TAMAMEN": {
    passphrase: "たまめん",
    name: "たまめん",
    photos: [
      "images/groupLP/NK/A0ECDF97-358C-405E-A01E-45CE3B169A0D.jpg",
    ],
    message: "TODO: 完成後メッセージ未定", // TODO: メッセージ未定
    guests: {
      // TODO: ゲスト情報を追加予定
    }
  },

  // ---- 新郎親族グループ: 原山家 ----
  "GROUP_HARAYAMA": {
    passphrase: "バディ",
    name: "原山家用ページ",
    customHero: "familyFrame",
    heroImage: "images/groupLP/groom親族/家族写真.jpg",
    photos: [
      "images/groupLP/groom親族/LINE_ALBUM_20230617_260711_1.jpg",
      "images/groupLP/groom親族/LINE_ALBUM_20230617_260711_2.jpg",
      "images/groupLP/groom親族/LINE_ALBUM_20230617_260711_3.jpg",
      "images/groupLP/groom親族/S__91676676_0.jpg",
      "images/groupLP/groom親族/S__91676677_0.jpg",
      "images/groupLP/groom親族/S__91676679_0.jpg",
      "images/groupLP/groom親族/S__91676680_0.jpg",
      "images/groupLP/groom親族/S__91676681_0.jpg",
      "images/groupLP/groom親族/S__91676682_0.jpg",
      "images/groupLP/groom親族/S__91676683_0.jpg",
      "images/groupLP/groom親族/S__91676684_0.jpg",
      "images/groupLP/groom親族/S__91676686_0.jpg",
      "images/groupLP/groom親族/S__91676687_0.jpg",
      "images/groupLP/groom親族/S__91676688_0.jpg",
      "images/groupLP/groom親族/S__91676690_0.jpg",
      "images/groupLP/groom親族/S__91676691_0.jpg",
      "images/groupLP/groom親族/S__91676692_0.jpg",
      "images/groupLP/groom親族/S__91676693_0.jpg",
      "images/groupLP/groom親族/S__91676694_0.jpg",
      "images/groupLP/groom親族/S__91676695_0.jpg",
      "images/groupLP/groom親族/S__91676696_0.jpg",
      "images/groupLP/groom親族/S__91676697_0.jpg",
      "images/groupLP/groom親族/S__91676698_0.jpg",
      "images/groupLP/groom親族/S__91676699_0.jpg",
      "images/groupLP/groom親族/S__91676701_0.jpg",
      "images/groupLP/groom親族/S__91676702_0.jpg",
      "images/groupLP/groom親族/S__91676703_0.jpg",
      "images/groupLP/groom親族/S__91676704_0.jpg",
      "images/groupLP/groom親族/S__91676705_0.jpg",
      "images/groupLP/groom親族/S__91676706_0.jpg",
      "images/groupLP/groom親族/S__91676707_0.jpg",
    ],
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
