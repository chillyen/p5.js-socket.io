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

let joystick_msg, multi_msg, rotation_msg, button_msg;
let allString =  button_msg;

const __dirname = path.resolve();

const app = express();
app.use(express.static(__dirname));

const httpServer = http.Server(app);
const io = new Server(httpServer);

// board ready之後，才會進行socket.io的連線
board.on("ready", function () {
  //設定數位輸入的接口
  var joystick = new five.Joystick({
    //   [ x, y ]
    pins: ["A1", "A2"],
  });

  io.on("connection", function (socket) {
    console.log("a client connected:" + socket.id);
    // socket.on("directive", function (message) {
      // console.log(message);
      // socket.broadcast.emit("screen", message);
    });
    //在此寫作程式，定義收到按鈕時，隨機產出x, y, r, c，並送出到screen
    // board.digitalRead(8, function (value) {
    //     if (value) {
    //         let message = {
    //             x: Math.floor(Math.random() * 560),//baseHue(0, 560)
    //             y: Math.floor(Math.random() * 40) + 40,//baseBri(40, 80)
    //         };
    //         socket.broadcast.emit('screen', message)

    //     }
    // });

    // joystick
    joystick.on("data", function () {
      joystick_msg = {
        x: Math.floor(Math.abs(this.x) * 560), //baseHue(0, 560)【】
        y: Math.floor(Math.abs(this.y) * 360), //baseBri(40, 80)
      };
      // socket.broadcast.emit("screen", joystick_msg);
      // console.log(joystick_msg);
    });

    // temperature sensor

    let multi = new five.Multi({
      controller: "DHT11_I2C_NANO_BACKPACK",
    });

    multi.on("change", function () {
      multi_msg = {
        temp: this.thermometer.celsius, //baseHue(0, 560)【牛的數量】
        humidity: this.hygrometer.relativeHumidity, //baseBri(40, 80)【香菇的數量】
      };
      // setTimeout(()=>{
      //   socket.broadcast.emit("screen", multi_msg);
      //   console.log(multi_msg);
      // },20000);
      
      // console.log(multi_msg);
      // await Delay(1000);
      // console.log("Thermometer");
      // console.log("  Temperature           : ", this.thermometer.celsius);
      // console.log("  fahrenheit        : ", this.thermometer.fahrenheit);
      // console.log("  kelvin            : ", this.thermometer.kelvin);
      // console.log("--------------------------------------");
      // console.log("Hygrometer");
      // console.log("  relative humidity : ", this.hygrometer.relativeHumidity);
      // console.log("--------------------------------------");
    });

    var rotation_sensor = new five.Sensor("A0");

    // Scale the sensor's data from 0-1023 to 0-10 and log changes
    rotation_sensor.on("change", function () {
      //【Hue的變化】
      //  console.log(this.scaleTo(0, 560));

      rotation_msg = {
        x: this.scaleTo(0, 560), //baseHue(0, 560)【】
      };
      
        // setTimeout(()=>{
        //   // msg = socket.broadcast.emit("screen", rotation_msg);
        //   console.log(rotation_msg);
        // },5000);              
    });

    var button_sensor = new five.Sensor.Digital(8);
    button_sensor.on("change", function () {
      button_msg = {
        x: this.x, //【按鈕tree 】
      };
    });

    socket.broadcast.emit("screen", button_msg);
  });

  //rotation sensor

  

  // Scale the sensor's data from 0-1023 to 0-10 and log changes
  

  httpServer.listen(3000, function () {
    console.log("listening on *:3000");
  });
// });
