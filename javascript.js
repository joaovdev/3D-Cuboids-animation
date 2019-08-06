let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
let canvas = document.getElementById("myCanvas");
let isMouseDown = false;
let x, y;
document.getElementById("myCanvas").onmousedown = function() {
  isMouseDown = true;
};
document.getElementById("myCanvas").onmouseup = function() {
  isMouseDown = false;
};
document.getElementById("myCanvas").onmousemove = function(event) {
  x = event.clientX;
  y = event.clientY;
};
pmouseX = 0;
pmouseY = 0;

let backgroundColour = "white";
let nodeColour = "green";
let edgeColour = "blue";
let nodeSize = 8;

let createCuboid = function(x, y, z, w, h, d) {
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

let object = createCuboid(-250, -250, 50, 100, 100, 30);
let nodes = object.nodes;
let edges = object.edges;

// Rotate shape around the z-axis
let rotateZ3D = function(theta) {
  let sinTheta = Math.sin(theta);
  let cosTheta = Math.cos(theta);

  for (let n = 0; n < nodes.length; n++) {
    let node = nodes[n];
    let x = node[0];
    let y = node[1];
    node[0] = x * cosTheta - y * sinTheta;
    node[1] = y * cosTheta + x * sinTheta;
  }
};

let rotateY3D = function(theta) {
  let sinTheta = Math.sin(theta);
  let cosTheta = Math.sin(theta);

  for (let n = 0; n < nodes.length; n++) {
    let node = nodes[n];
    let x = node[0];
    let z = node[2];
    node[0] = x * cosTheta - z * sinTheta;
    node[2] = z * cosTheta + x * sinTheta;
  }
};

let rotateX3D = function(theta) {
  let sinTheta = Math.sin(theta);
  let cosTheta = Math.cos(theta);

  for (let n = 0; n < nodes.length; n++) {
    let node = nodes[n];
    let y = node[1];
    let z = node[2];
    node[1] = y * cosTheta - z * sinTheta;
    node[2] = z * cosTheta + y * sinTheta;
  }
};

rotateZ3D(30);
rotateY3D(30);
rotateX3D(30);

setInterval(() => {
  ctx.fillStyle = backgroundColour;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw edges
  ctx.strokeStyle = edgeColour;
  for (let e = 0; e < edges.length; e++) {
    let n0 = edges[e][0];
    let n1 = edges[e][1];
    let node0 = nodes[n0];
    let node1 = nodes[n1];
    ctx.beginPath();
    ctx.moveTo(node0[0], node0[1]);
    ctx.lineTo(node1[0], node1[1]);
    ctx.stroke();
  }

  // Draw nodes
  ctx.fillStyle = nodeColour;
  for (let n = 0; n < nodes.length; n++) {
    let node = nodes[n];
    ctx.beginPath();
    ctx.arc(node[0], node[1], nodeSize, 0, 2 * Math.PI);
    ctx.fill();
  }
  if (isMouseDown) {
    mouseDragged();
  }
}, 100);

function mouseDragged() {
  rotateY3D(x - pmouseX);
  rotateX3D(y - pmouseY);
  pmouseX = x;
  pmouseY = y;
}
