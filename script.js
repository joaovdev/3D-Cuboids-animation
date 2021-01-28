let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
let isMouseDown = false;
let x = 0, y = 0, cx = 0, cy = 0;
let previousX, previousY;
let frameCounter = 0;
let objAngle = [-0.98, -0.001];
let canvasCenter = [c.width/2, c.height/2];
let matrixSize = [ 5, 5];

initialize();
function initialize() {
    // Register an event listener to call the resizeCanvas() function 
    // each time the window is resized.
    window.addEventListener('resize', resizeCanvas, false);
    // Draw canvas border for the first time.
    resizeCanvas();
}
 // Runs each time the DOM window resize event fires.
 // Resets the canvas dimensions to match window,
 // then draws the new borders accordingly.
function resizeCanvas() {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    canvasCenter = [c.width/2, c.height/2];
}


let createCuboid = function (x, y, z, w, h, d, matrixPos) {
    let nodes = [
        [x, y, z],
        [x, y, z + d],
        [x, y + h, z],
        [x, y + h, z + d],
        [x + w, y, z],
        [x + w, y, z + d],
        [x + w, y + h, z],
        [x + w, y + h, z + d]
    ];
    let edges = [
        [0, 1],
        [1, 3],
        [3, 2],
        [2, 0],
        [4, 5],
        [5, 7],
        [7, 6],
        [6, 4],
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7]
    ];
    return { nodes: nodes, edges: edges, matrixPos: matrixPos };
};

let shapes = []
let createMatrix = function( i, j) {
    let createY;
    let createZ;
    for (let m = 0; m < i; m++) {
        for (let n = 0; n < j; n++) {
            if (i % 2 != 0) {
                createY = 40 * (i/2);
            }
            if (j % 2 != 0) {
                createZ = 40 * (j/2);
            }
            shapes.push(createCuboid(-120, ((40 * n) - createY), ((40 * m) - createZ), 240, 40, 40, [m+1, n+1]));
        }
    };
}
createMatrix(matrixSize[0], matrixSize[1]);

let rotateX3D = function (theta) {
    let sinTheta = Math.sin(theta / 50);
    let cosTheta = Math.cos(theta / 50);

    for (let q = 0; q < shapes.length; q++) {
        for (let n = 0; n < shapes[q].nodes.length; n++) {
            let node = shapes[q].nodes[n];
            let y = node[1];
            let z = node[2];
            node[1] = (y * cosTheta - z * sinTheta);
            node[2] = (z * cosTheta + y * sinTheta);
        }
    }
};

let rotateY3D = function (theta) {
    let sinTheta = Math.sin(theta / 50);
    let cosTheta = Math.cos(theta / 50);

    for (let q = 0; q < shapes.length; q++) {
        for (let n = 0; n < shapes[q].nodes.length; n++) {
            let node = shapes[q].nodes[n];
            let x = node[0];
            let z = node[2];
            node[0] = (x * cosTheta + z * sinTheta);
            node[2] = (z * cosTheta - x * sinTheta);
        }
    }
};

c.onmousedown = function () {
    isMouseDown = true;
};

c.onmouseup = function () {
    isMouseDown = false;
};

c.onmousemove = function (event) {
    if (isMouseDown) {
        previousX = x;
        previousY = y;
        x = event.clientX;
        y = event.clientY;
        console.log('x=' + x + ' y=' + y);
        rotateY3D(x - previousX);
        rotateX3D(y - previousY);
    }
    else {
        x = event.clientX;
        y = event.clientY;
    }
};

let eraseObjects = function(eraseWidth, eraseHeight) {
    ctx.rect(canvasCenter[0] - eraseWidth, canvasCenter[1] - eraseHeight,  eraseWidth*2 , eraseHeight*2);
    ctx.fillStyle = 'white';
    ctx.fill();
}

let calculateAngle = function() {
    let edgeLengthX = shapes[0].nodes[0][0] - shapes[0].nodes[4][0];
    let edgeLengthY = shapes[0].nodes[0][1] - shapes[0].nodes[4][1];//getting the length of an side edge 
    let edgeSin = edgeLengthY / 240; // sin=opposite/hypotenuse
    let edgeCos = edgeLengthX / 240; // cos=adjacent/hypotenuse
    return [edgeSin, edgeCos];
}

let calculateWavyOffset = function(q) {
    let offset;
    let offsetX;
    let offsetY;
    let centerMatrix = [];
    if (matrixSize[0] )
    centerMatrix[0] = [Math.floor(matrixSize[0]/2) + 1,Math.floor(matrixSize[1]/2) + 1];
    offsetX = Math.sin( (matrixSize[0] - Math.abs(shapes[q].matrixPos[0] - centerMatrix[0][0]) )/matrixSize[0]);
    offsetY = Math.sin( (matrixSize[1] - Math.abs(shapes[q].matrixPos[1] - centerMatrix[0][1]) )/matrixSize[1]);
    offset = offsetX + offsetY;
    return offset*80;
}

let drawObjects = function(edgeSin, edgeCos){
    for (let q = 0; q < shapes.length; q++) {
        let Wavy = Math.sin( (frameCounter + calculateWavyOffset(q)) / 20);
        for (let e = 0; e < shapes[q].edges.length; e++) { // draws cuboid
            ctx.save(); // saves the ctx's initial position
            ctx.translate(c.width / 2, c.height / 2); // moves ctx to the middle of canvas
            let n0 = shapes[q].edges[e][0]; // the array position of one of the edge's node
            let n1 = shapes[q].edges[e][1]; // the array position of the edge's other node
            let node0 = shapes[q].nodes[n0]; // one of node's coordinate(x,y,z)
            let node1 = shapes[q].nodes[n1]; // the other node's coordinate(x,y,z)
            ctx.beginPath();
            if (n0 < 5 && n1 < 4) { // conditions are for selecting the lines which should have wavy animation
                ctx.moveTo(node0[0] + Wavy * edgeCos * 10, node0[1] + Wavy * edgeSin * 10);
                ctx.lineTo(node1[0] + Wavy * edgeCos * 10, node1[1] + Wavy * edgeSin * 10);
            } else if (n1 - n0 == 4) {
                ctx.moveTo(node0[0] + Wavy * edgeCos * 10, node0[1] + Wavy * edgeSin * 10);
                ctx.lineTo(node1[0], node1[1]);
            } else {
                ctx.moveTo(node0[0], node0[1]);
                ctx.lineTo(node1[0], node1[1]);
            }
            ctx.stroke();
            ctx.restore(); // restores ctx to it's initial position
        }
    }
};


setInterval(function () {
    objAngle = calculateAngle();
    eraseObjects(200,200);
    drawObjects(objAngle[0], objAngle[1]);
    frameCounter++;
}, 16.7);
