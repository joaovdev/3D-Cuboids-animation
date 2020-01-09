let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
let isMouseDown = false;
let x = 0, y = 0, cx = 0, cy = 0;
let previousX, previousY;


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

var rotateX3D = function (theta) {
    var sinTheta = Math.sin(theta / 50);
    var cosTheta = Math.cos(theta / 50);
    // ctx.fillText("sin=" + Math.sin(theta), 60, 60);

    for (var n = 0; n < cuboid.nodes.length; n++) {
        var node = cuboid.nodes[n];
        var y = node[1];
        var z = node[2];
        node[1] = (y * cosTheta - z * sinTheta);
        node[2] = (z * cosTheta + y * sinTheta);
    }
};

var rotateY3D = function (theta) {
    var sinTheta = Math.sin(theta / 50);
    var cosTheta = Math.cos(theta / 50);

    for (var n = 0; n < cuboid.nodes.length; n++) {
        var node = cuboid.nodes[n];
        var x = node[0];
        var z = node[2];
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

ctx.fillText("Drag here to rotate!", 20, 70);
for (var e = 0; e < cuboid.edges.length; e++) { // drawing for the first time
    ctx.save();
    ctx.translate(c.width / 2, c.height / 2);
    var n0 = cuboid.edges[e][0];
    var n1 = cuboid.edges[e][1];
    var node0 = cuboid.nodes[n0];
    var node1 = cuboid.nodes[n1];
    ctx.beginPath();
    ctx.moveTo(node0[0], node0[1]);
    ctx.lineTo(node1[0], node1[1]);
    ctx.stroke();
    ctx.restore();
}


c.onmousemove = function (event) {
    if (isMouseDown) { // draws every mouse drag
        previousX = x;
        previousY = y;
        x = event.clientX;
        y = event.clientY;
        rotateY3D(x - previousX);
        rotateX3D(y - previousY);
        ctx.clearRect(0, 0, c.width, c.height);
        //ctx.fillText("X theta:" + (x - previousX), 10, 50);
        //ctx.fillText("Y theta:" + (y - previousY), 10, 70);
        for (var e = 0; e < cuboid.edges.length; e++) {
            ctx.save();
            ctx.translate(c.width / 2, c.height / 2);
            var n0 = cuboid.edges[e][0];
            var n1 = cuboid.edges[e][1];
            var node0 = cuboid.nodes[n0];
            var node1 = cuboid.nodes[n1];
            ctx.beginPath();
            ctx.moveTo(node0[0], node0[1]);
            ctx.lineTo(node1[0], node1[1]);
            ctx.stroke();
            ctx.restore();
        }
    } else {
        x = event.clientX;
        y = event.clientY;
    }
};
