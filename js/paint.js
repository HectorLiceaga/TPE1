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
let rubber = document.getElementById("rubber");
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

function reload() {
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
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
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

/**
 *                           **********Sepia***************
 */
document.getElementById('sepia').addEventListener('click', sepia);

function sepia() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];

        data[i] = Math.min(Math.round(0.393 * r + 0.769 * g + 0.189 * b), 255);
        data[i + 1] = Math.min(Math.round(0.349 * r + 0.686 * g + 0.168 * b), 255);
        data[i + 2] = Math.min(Math.round(0.272 * r + 0.534 * g + 0.131 * b), 255);
    }
    ctx.putImageData(imageData, 0, 0);
}

/**
 *                           **********Negative***************
 */
document.getElementById('negative').addEventListener('click', negative);

function negative() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
    ctx.putImageData(imageData, 0, 0);
}

/**
 *                           **********Sobel***************
 */
document.getElementById('sobel').addEventListener('click', sobel);
let data;

function sobel() {
    let w = canvas.width;
    let h = canvas.height;
    data = ctx.getImageData(0, 0, w, h)
    let data2 = ctx.getImageData(0, 0, w, h)
    for (let i = 0; i < data.data.length; i += 4) {
        let row = parseInt(i / 4 / w)
        let col = parseInt(i / 4 % w)
        if (row > 0 && row < h) {
            if (col > 0 && col < w) {
                let gx = avg(i - w * 4 - 4) + 2 * avg(i - 4) + avg(i + 4 * w - 4) - avg(i - w * 4 + 4) - 2 * avg(i - 4) - avg(i + 4 * w + 4);
                let gy = avg(i - w * 4 - 4) + 2 * avg(i - w * 4) + avg(i + 4 * w + 4) - avg(i + w * 4 - 4) - 2 * avg(i + w * 4) - avg(i + 4 * w + 4);
                let g = Math.sqrt(Math.pow(gx, 2) + Math.pow(gy, 2))
                if (g > 20) {
                    data2.data[i] = (255 - g);
                    data2.data[i + 1] = (255 - g);
                    data2.data[i + 2] = (255 - g);
                } else {
                    data2.data[i] = 255
                    data2.data[i + 1] = 255
                    data2.data[i + 2] = 255
                }
            }
        }
    }
    ctx.putImageData(data2, 0, 0);
}

function avg(index) {
    let a = 0
    for (let i = index; i < index + 3; ++i) {
        a += data.data[i]
    }
    return a / 3
}


/**
 *                           **********Gray scale***************
 */
let btnGray = document.getElementById("gray");
btnGray.addEventListener('click', grayScale);
function grayScale() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let grayScale = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = grayScale;
        data[i + 1] = grayScale;
        data[i + 2] = grayScale;
    }
    ctx.putImageData(imageData, 0, 0);
}

/**
 *                           **********To binary filter***************
 */
let btnBinary = document.getElementById("binary");
btnBinary.addEventListener('click', toBinary);

function toBinary() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let pixel = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (pixel < 127) {
            pixel = 0;
        } else {
            pixel = 255;
        }
        data[i] = pixel;
        data[i + 1] = pixel;
        data[i + 2] = pixel;
    }
    ctx.putImageData(imageData, 0, 0);
}

/**
 *                           **********Blur filter***************
 */
let btnBlur = document.getElementById("blur");
btnBlur.addEventListener('click', blur);

function blur() {
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let r, g, b;
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            r = Math.floor((getRed(imageData, x, y) + getRed(imageData, x - 1, y) + getRed(imageData, x + 1, y) + getRed(imageData, x - 1, y + 1) + getRed(imageData, x - 1, y - 1) + getRed(imageData, x, y + 1) + getRed(imageData, x, y - 1) + getRed(imageData, x + 1, y + 1) + getRed(imageData, x + 1, y - 1)) / 9);
            g = Math.floor((getGreen(imageData, x, y) + getGreen(imageData, x - 1, y) + getGreen(imageData, x + 1, y) + getGreen(imageData, x - 1, y + 1) + getGreen(imageData, x - 1, y - 1) + getGreen(imageData, x, y + 1) + getGreen(imageData, x, y - 1) + getGreen(imageData, x + 1, y + 1) + getGreen(imageData, x + 1, y - 1)) / 9);
            b = Math.floor((getBlue(imageData, x, y) + getBlue(imageData, x - 1, y) + getBlue(imageData, x + 1, y) + getBlue(imageData, x - 1, y + 1) + getBlue(imageData, x - 1, y - 1) + getBlue(imageData, x, y + 1) + getBlue(imageData, x, y - 1) + getBlue(imageData, x + 1, y + 1) + getBlue(imageData, x + 1, y - 1)) / 9);

            setPixel(imageData, x, y, r, g, b, 255);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

/**
 *                           **********Saturation filter***************
 */
document.getElementById('saturation').addEventListener('click', saturation);

function saturation() {
	let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	let data = imageData.data;
	let r, g, b, h, s, v;
	for (let i = 0; i < data.length; i += 4) {
		r = data[i];
		g = data[i + 1];
		b = data[i + 2];

		let arrHsv = rgbToHsv(r, g, b);
		h = arrHsv[0];
		s = arrHsv[1] + 0.2;
		v = arrHsv[2];

		let arrRgb = hsvToRgb(h, s, v);

		data[i] = arrRgb[0];
		data[i + 1] = arrRgb[1];
		data[i + 2] = arrRgb[2];
	}
	ctx.putImageData(imageData, 0, 0);
}

function rgbToHsv(r, g, b) {
	r /= 255, g /= 255, b /= 255;
	let max = Math.max(r, g, b), min = Math.min(r, g, b);
	let h, s, v = max;
	let d = max - min;
	s = max == 0 ? 0 : d / max;
	if (max == min) {
		h = 0; // achromatic
	} else {
		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}
	return [h, s, v];
}

function hsvToRgb(h, s, v) {
	let r, g, b;

	let i = Math.floor(h * 6);
	let f = h * 6 - i;
	let p = v * (1 - s);
	let q = v * (1 - f * s);
	let t = v * (1 - (1 - f) * s);

	switch (i % 6) {
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	}

	return [r * 255, g * 255, b * 255];
}