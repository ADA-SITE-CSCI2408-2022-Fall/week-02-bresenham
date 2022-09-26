/*
    Code samle for CSCI 2408 Computer Graphics Fall 2022 
    (c)2022 by Araz Yusubov 
    DISCLAIMER: All code examples we will look at are quick hacks intended to present working prototypes.
    Hence they do not follow best practice of programming or software engineering.    
*/
var canvas;
var context;
window.onload = init;

// Coordinates of the line to draw
var lineX0, lineY0;
var lineX1, lineY1;
// Remember if your are to draw a line or mark the start point
var startNewLine = false;

var GRID_SIZE = 30;
// Colors to draw grid and pixels
var GRID_COLOR = 'grey';
var LINE_COLOR = 'red';

function init() {
    // Get reference to the 2D context of the canvas
    canvas = document.getElementById("gl-canvas");
    context = canvas.getContext("2d");
    if (context) {
        drawGrid();
        //Set a listener for the mousedown event
        /*
        canvas.addEventListener("click", function(e) {
            onClick(e);
        });
        */
        canvas.onclick = onClick;
    }
}

function onClick(e) {
    startNewLine = !startNewLine;
    //Get coordinates of the mouse within the canvas
    rect = canvas.getBoundingClientRect();
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
    /*
    This would not work as returns coordinates within window
    x = e.clientX;
    y = e.clientY;
    */
    // Calculate the coordinates within the grid
    x = Math.floor(x / GRID_SIZE);
    y = Math.floor(y / GRID_SIZE);
    //console.log(x,':', y, ':', startNewLine);

    if (startNewLine) {
        // Draw the first pixel
        lineX0 = x;
        lineY0 = y;
        drawPixel(lineX0, lineY0);
    } else {
        // Draw the line to the second pixel
        lineX1 = x;
        lineY1 = y;
        drawBresenham();
    }
}

// To draw a line using Bresenham's algorithm
function drawBresenham() {
    x = lineX0;
    y = lineY0;
    dx = lineX1 - lineX0;
    dy = lineY1 - lineY0;
    /*d = 2*dy;
    while (x <= lineX1) {
        drawPixel(x, y);
        x = x + 1;
        // Check if we need to move to the next line
        if (d > dx) {
            y = y + 1;
            d = d - 2*dx;
        }
        d = d + 2*dy;
    }*/
    d = dx;
    while (x <= lineX1) {
        drawPixel(x, y);
        x = x + 1;
        d = d - 2*dy;
        // Check if we need to move to the next line
        if (d < 0) {
            y = y + 1;
            d = d + 2*dx;
        }
    }
    // Also draw a control line
    drawLine(lineX0*GRID_SIZE + GRID_SIZE/2, lineY0*GRID_SIZE + GRID_SIZE/2, 
            lineX1*GRID_SIZE + GRID_SIZE/2, lineY1*GRID_SIZE + GRID_SIZE/2);
}

// Draw a big pixel in a grid cell with the given coordinates
function drawPixel(x, y) {
    context.fillStyle = LINE_COLOR;
    x = x * GRID_SIZE;
    y = y * GRID_SIZE;
    context.fillRect(x, y, GRID_SIZE, GRID_SIZE);
}

// Draw a line using the canvas coordinates
function drawLine(x0, y0, x1, y1) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
}

// Draw a regular square grid using the given size parameter
function drawGrid() {
    // Set the line styles
    context.strokeStyle = GRID_COLOR;
    context.lineWidth = 1;

    // Draw the vertical lines
    x = 0;
    while (x <= canvas.clientWidth) {
        drawLine(x, 0, x, canvas.clientHeight);
        x = x + GRID_SIZE;
    }
    
    // Draw the horizontal lines
    y = 0;
    while (y <= canvas.clientHeight) {
        drawLine(0, y, canvas.clientWidth, y);
        y = y + GRID_SIZE;
    }
}