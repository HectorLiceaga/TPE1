'use strict';
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let w = canvas.clientWidth;
let h = canvas.clientHeight;
let imageData = ctx.createImageData(w, h);
let color = 'black';
let gross = 5;
let isDrawing = false;
let img;
let tool = '';

let pencil = document.getElementById("pencil");
pencil.addEventListener("click", draw);
let rubber = document.getElementById("rubber")
rubber.addEventListener("click", erase);

/**
 * start with the drawing
 */
function draw() {
    tool = 'pencil';
    canvas.addEventListener('mousedown', start, false);
    canvas.addEventListener('mousemove', drawing);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mouseoutput', stop);
}

/**
 *                      ***************Mouse's movement capture**************
 */
function erase() {
    tool = 'rubber';
    canvas.addEventListener('mousedown', start, false);
    canvas.addEventListener('mousemove', drawing);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mouseoutput', stop);
}
/**
 * marks the place on the canvas where it is clicked
 */
function start(e) {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);//find the x and y axis from where it is clicked
}

/**
 * follow the mouse movement on the canvas and assign the color and width of the line
 */
function drawing(e) {
    if (isDrawing) {
        if (tool === 'pencil') {
            ctx.strokeStyle = color;//pick color
        } else if (tool === 'rubber') {
            ctx.strokeStyle = "white"
        }
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.lineWidth = gross * 2;//pick width
        ctx.lineCap = "round";//makes the termination of the round line
        ctx.lineJoin = "round";//determines the shape used to join two line segments
        ctx.stroke();
    }
}

/**
 * stroke ends when click is lifted or off canvas
 */
function stop(e) {
    if (isDrawing) {
        ctx.stroke();
        ctx.closePath();
        isDrawing = false;
    }
}

/**
 *                           **********Image load on the canvas***************
 */
document.getElementById("myImg").addEventListener('change', () => {
    clean();
    img = document.getElementById('myImg').files[0];
    const BLOP = new FileReader();
    if (img) {
        BLOP.readAsDataURL(img);
    }
    BLOP.addEventListener("load", e => {
        let image = new Image();
        image.src = BLOP.result;
        image.onload = function () {
            ctx.drawImage(image, 0, 0);
        };
    }, false);
});

let btnClean = document.getElementById("clean");
btnClean.addEventListener("click", clean);

function clean() {
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            setPixel(imageData, x, y, 255, 255, 255, 255);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function setPixel(imageData, x, y, r, g, b, a) {
    let index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}
