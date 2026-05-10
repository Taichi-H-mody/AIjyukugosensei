// 自動生成された追加熟語データ\nconst autoData = {
  "冊": [
    {
      "jukugo": "冊友",
      "reading": "さくゆう",
      "meaning": "本を貸し借りする友達。",
      "example": "図書館で借りた本を冊友と交換した。"
    },
    {
      "jukugo": "冊星",
      "reading": "さくせい",
      "meaning": "本棚に並べられたたくさんの本の様子を、星に例えて表現した言葉。",
      "example": "夜空に輝く冊星のように、私の部屋の本棚はたくさんの本で埋め尽くされている。"
    }
  ],
  "腹": [
    {
      "jukugo": "腹芸",
      "reading": "はらげい",
      "meaning": "言葉に出さずに、態度や表情などで自分の考えや気持ちを巧みに表すこと。",
      "example": "部長の腹芸はすごくて、言いたいことがすぐにはわからないんだ。"
    },
    {
      "jukugo": "腹積もり",
      "reading": "はらづもり",
      "meaning": "心の中で決めている計画や覚悟のこと。",
      "example": "明日のテスト、満点取る腹積もりで勉強してきたよ！"
    }
  ],
  "undefined": [
    {
      "jukugo": "未定義",
      "reading": "みていぎ",
      "meaning": "まだ意味や内容が決まっていないこと。",
      "example": "この問題は、まだ解答が未定義なので、みんなで考えよう。"
    },
    {
      "jukugo": "未知数",
      "reading": "みちすう",
      "meaning": "まだわからない数や、これからどうなるかわからないこと。",
      "example": "未来のことは未知数だけど、ぼくは夢を追いかけるよ。"
    }
  ]
};\nfor (const k in autoData) {\n  if (window.OFFLINE_DB[k]) {\n    window.OFFLINE_DB[k] = window.OFFLINE_DB[k].concat(autoData[k]);\n  }\n}\n