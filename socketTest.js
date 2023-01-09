import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
// 引入Johnny-Five，將引入後的名稱設定為five
import five from "johnny-five";
// import { Delay } from './p5types';

// 透過five取得board參考，如果是用Mac，記得要修改port的名稱!
let board = new five.Board({
  port: "COM6",
  repl: false,
});

const __dirname = path.resolve();

const app = express();
app.use(express.static(__dirname));

const httpServer = http.Server(app);
const io = new Server(httpServer);

// board ready之後，才會進行socket.io的連線
board.on("ready", function () {
  //設定數位輸入的接口
//   var joystick = new five.Joystick({
//     //   [ x, y ]
//     pins: ["A1", "A2"],
//   });
  var rotation_sensor = new five.Sensor("A0");
  var button_sensor1 = new five.Sensor.Digital(8);
  var button_sensor2 = new five.Sensor.Digital(7);
  let button_open1, button_open2 ;

  io.on("connection", function (socket) {
    console.log("a client connected:" + socket.id);
    socket.on("directive", function (message) {
      // console.log(message);
      socket.broadcast.emit("screen", message);
    });

    // joystick
    /*joystick.on("change", function () {
      let joystick_msg = {
        x: this.x, //baseHue(0, 560)
        y: this.y, //baseBri(40, 80)
      };
      joystick_open_x = joystick_msg.x;
      joystick_open_y = joystick_msg.y;
      //   socket.broadcast.emit("screen", joystick_msg);
      console.log(joystick_msg);
    });*/

    // temperature sensor

    let multi = new five.Multi({
      controller: "DHT11_I2C_NANO_BACKPACK",
    });

    multi.on("data", function () {
        let multi_msg = {
            Temp: this.thermometer.celsius,
            Humidity: this.hygrometer.relativeHumidity
        }
        if(button_open2 == 1){
            socket.broadcast.emit("screen", multi_msg);
            console.log("  Temperature       : ", this.thermometer.celsius);
            console.log("  relative humidity : ", this.hygrometer.relativeHumidity);
            console.log("--------------------------------------");
        }
    });

    //rotation sensor
    // Scale the sensor's data from 0-1023 to 0-10 and log changes
    rotation_sensor.on("data", function () {
        let rotation_msg = {
            x: this.scaleTo(2, 560), //baseHue(0, 560)【】
        };
        
            socket.broadcast.emit("screen", rotation_msg);
            // console.log(rotation_msg.x);
        
        
        // console.log(this.scaleTo(0, 100));
    });

    // Scale the sensor's data from 0-1023 to 0-10 and log changes
    button_sensor1.on("change", function () {
        let reload_button = {
            x:this.value,
        }
        socket.broadcast.emit("screen", reload_button);
    });
    button_sensor2.on("change", function () {
        button_open2 = this.value;
        // console.log(button_open);
    });
  });

  httpServer.listen(3000, function () {
    console.log("listening on *:3000");
  });
});
