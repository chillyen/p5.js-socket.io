import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
// 引入Johnny-Five，將引入後的名稱設定為five
import five from 'johnny-five';

// 透過five取得board參考，如果是用Mac，記得要修改port的名稱!
let board = new five.Board({
    port: "COM6", repl: false
});

const __dirname = path.resolve();

const app = express();
app.use(express.static(__dirname));

const httpServer = http.Server(app);
const io = new Server(httpServer);

// board ready之後，才會進行socket.io的連線
board.on('ready', function () {

    //設定數位輸入的接口
    board.pinMode(8, five.Pin.INPUT);

    io.on('connection', function (socket) {
        console.log('a client connected:' + socket.id);
        socket.on('directive', function (message) {
            console.log(message);
            socket.broadcast.emit('screen', message);
        });

        //在此寫作程式，定義收到按鈕時，隨機產出x, y, r, c，並送出到screen
        board.digitalRead(8, function (value) {
            if (value) {                
                let message = {
                    x: Math.floor(Math.random() * 560),//baseHue(0, 560)
                    y: Math.floor(Math.random() * 40) + 40,//baseBri(40, 80)
                };
                socket.broadcast.emit('screen', message)
            }
        });
        
    });

    httpServer.listen(3000, function () {
        console.log('listening on *:3000');
    });

});
