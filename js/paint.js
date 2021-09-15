'use strict';

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let w = canvas.clientWidth;
let h = canvas.clientHeight;
let color = 'black';
let gross = 5;
let isDrawing = false;

let pencil = document.getElementById("pencil").addEventListener("click", draw);
let rubber = document.getElementById("rubber").addEventListener("click", erase);

/**
 * start with the drawing
 */
function draw(){
    canvas.addEventListener('mousedown', start,false);
    canvas.addEventListener('mousemove', drawing);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mouseoutput', stop);
}

/**
 * marks the place on the canvas where it is clicked
 */
function start(e){
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);//find the x and y axis from where it is clicked
}

/**
 * follow the mouse movement on the canvas and assign the color and width of the line
 */
function drawing(e){
    if(isDrawing){
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.strokeStyle = color;//pick color
        ctx.lineWidth = gross;//pick width
        ctx.lineCap = "round";//makes the termination of the round line
        ctx.lineJoin = "round";//determines the shape used to join two line segments
        ctx.stroke();
    }
}

/**
 * stroke ends when click is lifted or off canvas
 */
function stop(e){
    if(isDrawing){
        ctx.stroke();
        ctx.closePath();
        isDrawing = false;
    }
}