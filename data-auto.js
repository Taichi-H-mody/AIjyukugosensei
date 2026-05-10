// 自動生成された追加熟語データ\nconst autoData = {
  "危": [
    {
      "jukugo": "危難",
      "reading": "きなん",
      "meaning": "身に降りかかる危険や災難のこと。",
      "example": "危難を乗り越えて、みんなで力を合わせた。"
    },
    {
      "jukugo": "危惧",
      "meaning": "これから起こるかもしれない悪いことを心配すること。",
      "example": "将来の環境について、危惧の念を抱いている。"
    }
  ]
};\nfor (const k in autoData) {\n  if (window.OFFLINE_DB[k]) {\n    window.OFFLINE_DB[k] = window.OFFLINE_DB[k].concat(autoData[k]);\n  }\n}\n