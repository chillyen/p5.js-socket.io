【下載檔案後的操作】

1. 
在terminal 先打npm init，然後手動在package.json 加上下方程式碼
"type": "module",
  "dependencies": {
    "socket.io": "*",
    "express": "*",
    "johnny-five": "*"
  },  
2.
並在terminal 再打一次npm install，讓它自動下載node_modules 配件
-----------------------------------------------------------------------------
【Websever 操控】
webSever 按鈕傳遞p5.js 生成藝術

1.在terminal中打:node webSever.js

2.打開瀏覽器開啟-> localhost:3000/client.html，與開啟->localhost:3000/screen.html

3.即可在client 網頁中按下發射鍵，screen 網頁就會因按下的每一下改變生成藝術的顏色
-----------------------------------------------------------------------------
【Socketsever 操控】
利用Arduino 按鈕傳遞p5.js 生成藝術

1.先將Arduino 連接Arduino IDE 開發工具，灌入firmata ->StandardFirmataPlus

2.將Arduino 關掉，然後打node socketSever.js

3.瀏覽器開啟->localhost:3000/screen.html，隨即按下Arduino 連接按鈕即可操作p5.js生成藝術的色調

