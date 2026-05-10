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
  ]
};\nfor (const k in autoData) {\n  if (window.OFFLINE_DB[k]) {\n    window.OFFLINE_DB[k] = window.OFFLINE_DB[k].concat(autoData[k]);\n  }\n}\n