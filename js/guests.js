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
    message: "本日はお忙しい中\n私たちの結婚披露宴にお越しいただき\n誠にありがとうございます\n\nいつも温かく見守ってくださる皆様に\n心から感謝しています\n\nどうぞ最後までお楽しみください",
    guests: {
      "0001": {
        name: "山田 太郎 様",
        message: "本日はお忙しい中\n私たちの結婚披露宴にお越しいただき\n誠にありがとうございます\n\nいつも温かく見守ってくださる太郎さんに\n心から感謝しています\n\nこれからも変わらずよろしくお願いいたします",
        image: ""
      },
      "0002": {
        name: "山田 花子 様",
        message: "本日はお越しいただき\nありがとうございます\n\n花子さんとの思い出は\nいつも私たちの宝物です",
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
    message: "本日はお忙しい中\n私たちの結婚披露宴にお越しいただき\nありがとうございます\n\nいつもそばで支えてくれる皆さんに\n感謝の気持ちでいっぱいです\n\n今日は思い切り楽しんでください！",
    guests: {
      "0001": {
        name: "鈴木 次郎 様",
        message: "これはデモ用のメッセージページです\n\nSHODAI & SAYAKA より\n心を込めたメッセージが届きます",
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
      "N24T": {
        name: "西原 拓也 様",
        message: "西、今日は遠く仙台から来てくれて本当にありがとう！中学の時に西の家族とに連れて行ってもらったディズニーランドでは鬼のように走り回ってアトラクションに乗りまくったのは今でもめちゃくちゃいい思い出です！今はお互い遠くに住んでいるけど、また機会を作って飲みに行こう！これからもよろしく！",
        image: ""
      },
      "7K08": {
        name: "小林 直也 様",
        message: "直也、今日は遠く群馬から来てくれて本当にありがとう！中学から部活やクラスで下らない話で笑ったり、大学生になってからもオンラインで一緒にゲームやったりとたくさんの思い出が詰まっているよ！最近はゲームもご無沙汰していますがまた機会作って一緒にゲームやったりご飯食べ行ったりしよう！これからもよろしくね！",
        image: ""
      },
      "Y04K": {
        name: "大島 祐介 様",
        message: "大島、今日は遠く上田から来てくれて本当にありがとう！大人になってから一緒にパチ屋に行った過去も、大島の家遊び行ったことも一緒に西の結婚式に弾丸泊りツアーしたことも引っ越しの手伝いしたことも全部かけがえのない思い出です！スーパーイクメン業が落ち着いたらまた機会作ってゴルフも行きたいし飲みにも行こう！これからもよろしくね！",
        image: ""
      },
      "N927": {
        name: "中村 晋明 様",
        message: "中尾、今日は勉強も忙しいのに時間作って来てくれてありがとう！中尾は中学の時からバスケも上手くて勉強もできてスーパー憧れの存在だったよ！今も夢に向かって努力している姿は最高にカッチョイイと思ってるよ。また夢が叶って落ち着いたら絶対みんなで飲みに行こう！楽しみにしているよ！",
        image: ""
      }
    }
  },

  // ---- 高校グループ ----
  "GROUP_HS": {
    passphrase: "ちょうこうきかい",
    name: "長工イツメンへ！",
    customHero: "photoStory",
    heroImage: "images/groupLP/NGNKG/P1050988_web.jpg",
    endingImage: "images/groupLP/NGNKG/LINE_ALBUM_20241207_260706_1.jpg",
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
      "images/groupLP/NGNKG/LINE_ALBUM_20250824_260714_1.jpg",
    ],
    message: "みんなと過ごしているときはずっと笑っているきがする！\nどんなに年を重ねても集まれば高校の時の姿に戻れる最高のメンツ！\n\n出会えたことに心から感謝！\n\nこれからもみんなでたくさん笑ってたくさん呑んで行きましょう！！",
    guests: {
      "3NGW": {
        name: "皆川 憲明 様",
        message: "のり、今日は長野から遠路はるばるありがとう！　のりは高校卒業した後も何かと機会作ってボード誘ってくれたり呑みに呼んでくれたりしてくれて本当に感謝してる！　新潟の大学行った後地元のみんなと連絡取る回数減って冬休みとかもぼんやり豊野で過ごしていた時になんの前触れもなく「ボード行くよ！」って年季の入ったセダン型の車で豊野まで迎えに来たの今でも忘れないわ　それからことあるごとに遊びに呑みにたくさん誘ってくれてルーザー、水上とも一緒に呑むようになってそれもすべてのりが繋いでくれた輪で本当に感謝してる！　まだまだ伝えたいことはあるけどそれはまた呑みに行ったときに語り合いましょう！これからもお互い爺さまになるまでよろしく！",
        image: ""
      },
      "TK32": {
        name: "藤沢 拓実 様",
        message: "ルーさん、今日は長野から遠路はるばるありがとう！ルーザーとは名簿近かったこともあり入学当初からよく話していた思い出があるよ　入学初日に「マジック貸して！」って後ろから声かけられたことなんだかめっちゃ覚えてるわ　大学くらいの時にルーザーとのりで新潟に遊び来てくれた時はめちゃくちゃ楽しかったなぁ　長野で飲んだ時にルーザーと終電なくてかなり古いラブホにとまったのも忘れない思い出になってるわ笑　書ききれないくらい沢山の笑える思い出をありがとう！いつも感謝しております！　また長野のみんなで飲みに行こう！　これからも末永くみんなで笑っていこう！よろしく！",
        image: ""
      },
      "3K3Y": {
        name: "水上 裕貴 様",
        message: "水上、今日は長野から遠路はるばるありがとう！水上とはなんと小学校から一緒で実は今回来てくれているゲストの中でも圧倒的に長い付き合いというね！中学の時に教室で筆箱をアメフトボールみたいにパスしあった記憶がなぜか鮮明に残っているんだけど覚えてる？笑　高校では3年まではお互い班活で接点が少なかったけど引退後はカラオケ行ったりフットサルの大会も出たねマイちゃんカップ　スーパーセーブ連続の水上マジでかっこよかったの覚えてるわ笑　社会人になってからも何回も飲み行ったなと思うどの回も毎度大笑いしてる気がするわ、もう25年の付き合いになるということだけどこれからもさらに長くよろしく！次は50年の付き合いを目指そう！！",
        image: ""
      }
    }
  },

  // ---- 大学グループ ----
  "GROUP_UNIV": {
    passphrase: "NUPALS",
    name: "大学のみんなへ",
    customHero: "puzzle",
    logo: "images/groupLP/NGTYKD/download.png",
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
    message: "大学でみんなと出会って授業も遊びも全力で楽しんだ日々は今でも大切な思い出です\n\n何気ない日常もみんなと一緒だったから最高に楽しかった!\n\n卒業してからも変わらず付き合ってくれる仲間がいることが本当にありがたいです\n\nこれからもみんなで集まって飲みに行きましょう!",
    guests: {
      "K04T": {
        name: "古塩 智明 様",
        message: "古塩、今日は県外から遠いのに時間作って参加してくれて本当にありがとう！大学２年の時に古塩と遊ぶようになってしばらくアパートに入り浸らせてもらったりキャンプも行ったし、スノボも行ったりとめっちゃくちゃ楽しい思い出だらけよな！社会人になってからもたまに集まれば古塩のわけわからんトークにいつも笑わせられっぱなしなんだよね　俺にとってそんな風にみんなで笑いあえる飲み会はマジでかけがえのないものだからまたことあるごとに機会作って飲み行こうね！　土遁・土珍歩ぉぉぉぉ！！！",
        image: ""
      },
      "KT10": {
        name: "安藤 健斗 様",
        message: "安藤、今日は遠く茨城の国から来てくれてありがとう！１年の頃に祥と安藤とはラーメン行ったりマック行ったり冷凍ポテト１キロパーティーしたりんでまたラーメン行ったり食い物の思い出がいっぱいやな・・・・　それとシージやってた頃は夜更けまで一緒にやってたのもめっちゃいい思い出！みんな社会人になってあんなふうに遊べる日はなかなか難しくなってきけどいつかあの頃のように遊べるといいね！また時間作ってみんなでなんかやろうキックベースとかでもいいから！今日は来てくれて本当にありがとう！",
        image: ""
      },
      "14K0": {
        name: "石川 遼 様",
        message: "遼君、今日は砺波からはるばるありがとう！受付も快く引き受けて助かったよ～　遼君とはMARVEL鑑賞会したレアな仲間だからなぁ最高なんだよなぁMARVEL好きな人ってマジでレアなんだよな　最近はMCUも追い切れていない感がマジですごいけどまだまだMARVEL愛はありますのでまた語り合おう（DOOMS DAY）について！MARVELに夢中になると火事未遂起こすから要注意ね！　　３０００回愛してるよ！",
        image: ""
      },
      "SK10": {
        name: "加藤 駿 様",
        message: "カトシュン、今日は割と近く沼垂から来てくれてありがとう！　カトシュンと会話してるときめっちゃテンポいいのよねボケもツッコミも両方やってくれるし会話が盛り上がるのなんのって最高よね！花びら大回転で笑ってくれたかとしゅんが心の友だと思っています！！　無事に家完成したら招待してね、スレッジハンマーもって遊び行くから！　　追伸：原付に乗るときは必ず最初に右手を離すように",
        image: ""
      },
      "R07W": {
        name: "鷲尾 俊紀 様",
        message: "鷲尾、今日は時間作って来てくれてありがとう！　鷲尾は４年に上がるときに留年してしまって付き合いが希薄になるのではと危惧していたがなんやかんやでめっちゃ長い付き合いになってきたね笑　このメンツでみんなで集まるのはほんとに楽しいからまたガンガン飲み行くぞ！今後はいなほ以外のスナックも開拓しよう！　PS：あれそういえば鷲尾って国試受かったん？？笑",
        image: ""
      },
      "7K6R": {
        name: "中村 祥 様",
        message: "祥、今日は来てくれて心からありがとう！祥とはダントツで思い出も過ごした時間の量も多い気がするんよね、俺の大学生活は祥なしでは始まらないし語れないしだわ、１年の時に新歓でサラっと俺の存在を受けて入れてくれたのは忘れない、挫折した軽音も、祥の乗っていたホンダの軽もその車でいろんなところ行ったのも、その軽の窓から初めて安藤に声をかけたのも鮮明に覚えてるわ、その後も古塩の家に入り浸ったり、遼君と映画鑑賞しながら火災未遂起こしたり、カトシュンと原付乗る練習してみたり、鷲尾とは社会人になってからよく泊まるようになったりと、まだまだ語りつくせないくらいの思い出があるな　俺が国試通れたのも祥というライバルがいてくれたからだと思ってる。良きライバルであり、良き友でいてくれてほんとにほんとに心の底からありがとう！　これからも命尽きるまで親友でいよう相棒！　",
        image: ""
      },
      "G075": {
        name: "樋口 凱 様",
        message: "凱 今日は時間を作って来てくれてありがとう！\n大学に入ってすぐの頃 凱が話しかけてくれたことを今でもよく覚えてるよ\n長野から来て友達ができるかめっちゃ不安だったけどあの時ごく気持ちが楽になったんだ本当にありがとう！\n大学5年くらいのときに一緒に飲みに行ったのも本当に楽しかったな\nお互い同じグループにいたわけではないけど 大学を卒業した今でもこうやって会えることがすごく嬉しい！\nこれからもよろしくね！また時間を作って絶対飲みに行こう！",
        image: ""
      }
    }
  },

  // ---- 職場グループ ----
  "GROUP_WORK": {
    passphrase: "TAIYOUSUN",
    name: "今町用ページ",
    customHero: "gifReveal",
    heroBuilding: "images/groupLP/IMMTY/薬局外観.png",
    heroGif: "images/groupLP/IMMTY/コーラニュース.gif",
    photos: [],
    message: "", // TODO: GIF上に載せるメッセージ本文（内輪ジョーク文言）未定
    guests: {
      "TY17": {
        name: "稻月 太陽 様",
        message: "稻月先生へ　今日は忙しい中来てくれて、本当にありがとうございます！　社会人になってから、こんなに気が合う人と出会えるなんて思ってなかったから、自分でもびっくりしております。毎日職場に行くのが苦じゃないのは、稻月先生が薬局にいてくれるおかげです。くだらない話で笑ったり、何気ない時間を一緒に過ごせるのが楽しくて、いつも元気もらってます。子育てが落ち着いたら、またガンガン飲みに行きましょう！その日を楽しみにしてます！　　P.S. あと、お互い下ネタで訴えられないようにだけ気をつけましょう（笑）",
        image: ""
      }
    }
  },

  // ---- 新婦グループ: たまめん ----
  "GROUP_TAMAMEN": {
    passphrase: "たまめん",
    name: "たまめん",
    photos: [
      "images/groupLP/NK/0EC2694D-F72C-4292-A786-10DC9B1C9D1E.jpg",
    ],
    message: "TODO: 完成後メッセージ未定", // TODO: メッセージ未定
    guests: {
      // TODO: ゲスト情報を追加予定
    }
  },

  // ---- 新婦グループ: 専門学校 ----
  "GROUP_SENMON": {
    passphrase: "おおはら",
    name: "専門学校のみんなへ",
    photos: [
      "images/groupLP/OH/S__104169475_0.jpg",
      "images/groupLP/OH/S__104169476_0.jpg",
    ],
    message: "TODO: メッセージ未定", // TODO: メッセージ未定
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
