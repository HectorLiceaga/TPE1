'use strict';
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let w = canvas.clientWidth;
let h = canvas.clientHeight;
let color = 'black';
let gross = 5;
let isDrawing = false;
let img;
let tool = '';

/**
 * start with the drawing
 */
 let pencil = document.getElementById("pencil");
 pencil.addEventListener("click", draw);

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
 let rubber = document.getElementById("rubber")
 rubber.addEventListener("click", erase);

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
        ctx.lineWidth = gross * 3;//pick width
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
let backUpImg;

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
            let MAX_WIDTH = w;
            let MAX_HEIGHT = h;
            let width = image.width;
            let height = image.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(image, 0, 0, width, height);
            backUpImg = ctx.getImageData(0, 0, width, height);
        };
    }, false);
});

/**
 *                           **********Reloads the image on the canvas***************
 */
let btnReload = document.getElementById("btnReloadImg");
btnReload.addEventListener("click", reload);

function reload(){
    clean();
    canvas.width = backUpImg.width;
    canvas.height = backUpImg.height;
    ctx.putImageData(backUpImg, 0, 0);
}

/**
 *                           ***********Paints the canvas color: white***************
 */
let btnClean = document.getElementById("btnClean");
btnClean.addEventListener("click", clean);

function clean() {
    canvas.width = w;
    canvas.height = h;
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            setPixel(imageData, x, y, 255, 255, 255, 255);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

/**
 *                           **********Sets each imageData's pixels whith a color RGBA***************
 */
let imageData = ctx.createImageData(w, h);

function setPixel(imageData, x, y, r, g, b, a) {
    let index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}

/**
 *                           **********Download canvas as an image***************
 */
 let dwnl = document.getElementById("btnDwnl");
 dwnl.addEventListener("click", download);

function download() {
    let data = canvas.toDataURL('image/png');
    let imgDwl = document.getElementById("imgDwl");
    imgDwl.setAttribute("href", data);
}

/**
 *                           **********Brightness***************
 */
 let btnBright = document.getElementById("btnBright");

 btnBright.addEventListener("click", () => {
    let bright = 10;
    let imageData = ctx.getImageData(0, 0, w, h);
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            let r = getRed(imageData, x, y) + bright;
            let g = getGreen(imageData, x, y) + bright;
            let b = getBlue(imageData, x, y) + bright;
            setPixel(imageData, x, y, r, g, b, 255);
        }
    }
    ctx.putImageData(imageData, 0, 0);
 });

/**
 *                           **********Set of 3 functions to get the color***************
 */
  function getRed(image, x, y) {
    let index = (x + y * image.width) * 4;
    return image.data[index];
  }
 
  function getGreen(image, x, y) {
    let index = (x + y * image.width) * 4;
    return image.data[index + 1];
  }

  function getBlue(image, x, y) {
    let index = (x + y * image.width) * 4;
    return image.data[index + 2];
  }