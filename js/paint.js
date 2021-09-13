'use strict';

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let w = canvas.clientWidth;
let h = canvas.clientHeight;

let color = document.getElementById("color").value;
console.log(color);
let gross = document.getElementById("gross").value;
console.log(gross);
let pencil = document.getElementById("pencil").addEventListener("click", draw(e));
let rubber = document.getElementById("rubber").addEventListener("click", erase(e));
