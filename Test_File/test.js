import five from 'johnny-five';
import { Delay } from '../p5types';

let board = new five.Board({
    port: "COM6", repl: false // COM3要代換成操作3-2中看到的序列埠編號
});

board.on('ready', function () {

    board.pinMode(8, five.Pin.INPUT); //按鈕輸入
    board.pinMode(2, five.Pin.OUTPUT); //溫溼度感測器輸出
    board.digitalRead(8, function(value) {
        if (value) {
            board.digitalRead(2, function(humidity, temperature) {
                console("Humidity = "+humidity+" %, Temperature = "+temperature+" C");
                Delay(2000);
            });
        }else{
            console.log("Wrong");
        }        
    });
});
