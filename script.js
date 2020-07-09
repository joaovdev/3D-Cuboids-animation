let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
let isMouseDown = false;
let x = 0, y = 0, cx = 0, cy = 0;
let previousX, previousY;
let FrameCounter = 0;


let createCuboid = function (x, y, z, w, h, d) {
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
    return { nodes: nodes, edges: edges };
};

let cuboid = createCuboid(-120, -20, -20, 240, 40, 40);


let rotateX3D = function (theta) {
    let sinTheta = Math.sin(theta / 50);
    let cosTheta = Math.cos(theta / 50);

    for (let n = 0; n < cuboid.nodes.length; n++) {
        let node = cuboid.nodes[n];
        let y = node[1];
        let z = node[2];
        node[1] = (y * cosTheta - z * sinTheta);
        node[2] = (z * cosTheta + y * sinTheta);
    }
};

let rotateY3D = function (theta) {
    let sinTheta = Math.sin(theta / 50);
    let cosTheta = Math.cos(theta / 50);

    for (let n = 0; n < cuboid.nodes.length; n++) {
        let node = cuboid.nodes[n];
        let x = node[0];
        let z = node[2];
        node[0] = (x * cosTheta + z * sinTheta);
        node[2] = (z * cosTheta - x * sinTheta);
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
        rotateY3D(x - previousX);
        rotateX3D(y - previousY);
    }
    else {
        x = event.clientX;
        y = event.clientY;
    }
};

setInterval(function () {
    ctx.clearRect(0, 0, c.width, c.height); // clears the canvas
    let edgeXlength = cuboid.nodes[0][0] - cuboid.nodes[4][0];
    let edgeYlength = cuboid.nodes[0][1] - cuboid.nodes[4][1];
    let edgeSin = edgeYlength / 240;
    let edgeCos = edgeXlength / 240;
    let Wavy = Math.sin(FrameCounter / 20);
    for (let e = 0; e < cuboid.edges.length; e++) { // draws cuboid
        ctx.save(); // saves the ctx's initial position
        ctx.translate(c.width / 2, c.height / 2); // moves ctx to the middle of canvas
        let n0 = cuboid.edges[e][0]; // the array position of one of the edge's node
        let n1 = cuboid.edges[e][1]; // the array position of the edge's other node
        let node0 = cuboid.nodes[n0]; // one of node's coordinate(x,y,z)
        let node1 = cuboid.nodes[n1]; // the other node's coordinate(x,y,z)
        ctx.beginPath();
        if (n0 < 5 && n1 < 4) {
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
        FrameCounter++;
    }, 16.67); // 60x/second
