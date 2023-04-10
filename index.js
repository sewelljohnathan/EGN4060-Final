// min-spanning tree to detect issues
let WORLD_W = 30;
let WORLD_H = 30;

let tileWidth = WIDTH / WORLD_W;
let tileHeight = HEIGHT / WORLD_H;

var tileSet = [

    // 2
    [
        [0,0,0],
        [0,0,0],
        [1,1,1]
    ],
    [
        [1,0,0],
        [1,0,0],
        [1,0,0]
    ],
    [
        [1,1,1],
        [0,0,0],
        [0,0,0]
    ],
    [
        [0,0,1],
        [0,0,1],
        [0,0,1]
    ],

    // 3
    [
        [1,1,1],
        [0,0,0],
        [1,1,1]
    ],
    [
        [1,0,1],
        [1,0,1],
        [1,0,1]
    ],

    // 4
    [
        [1,0,0],
        [1,0,0],
        [1,1,1]
    ],
    [
        [1,1,1],
        [1,0,0],
        [1,0,0]
    ],
    [
        [1,1,1],
        [0,0,1],
        [0,0,1]
    ],
    [
        [0,0,1],
        [0,0,1],
        [1,1,1]
    ],

    // 5
    [
        [1,1,1],
        [1,1,1],
        [1,1,1]
    ]
]

let world;
function initWorld() {
    world = [];
    for (let y = 0; y < WORLD_H; y++) {
        world.push([]);
        for (let x = 0; x < WORLD_W; x++) {
            world[y].push([]);
    
            for (let i = 0; i < tileSet.length; i++) {
                world[y][x].push(1);
            }
        }
    }
}

function propagate(y, x, collapsedIndex) {

    let collapsedTile = tileSet[collapsedIndex];

    for (let tileIndex = 0; tileIndex < tileSet.length; tileIndex++) {
        let tile = tileSet[tileIndex];

        if (y > 0) {
            if (collapsedTile[0][1] !== tile[2][1]) {
                world[y-1][x][tileIndex] = 0;
            }
        }
        if (y < WORLD_H - 1) {
            if (collapsedTile[2][1] !== tile[0][1]) {
                world[y+1][x][tileIndex] = 0;
            }
        }
        if (x > 0) {
            if (collapsedTile[1][0] !== tile[1][2]) {
                world[y][x-1][tileIndex] = 0;
            }
        }
        if (x < WORLD_W - 1) {
            if (collapsedTile[1][2] !== tile[1][0]) {
                world[y][x+1][tileIndex] = 0;
            }
        }
    }
    
}

function collapse() {

    let lowestEntropy = tileSet.length + 1;
    let lowestX;
    let lowestY;
    for (let y = 0; y < WORLD_H; y++) {
        for (let x = 0; x < WORLD_W; x++) {

            let entropy = 0;
            for (let i = 0; i < tileSet.length; i++) {
                entropy += world[y][x][i];
            }

            if (entropy === 0) {
                return 1; // error
            }

            if (entropy < lowestEntropy && entropy > 1) {
                lowestEntropy = entropy;
                lowestY = y;
                lowestX = x;
            }
        }
    }
    
    // Done
    if (lowestEntropy === tileSet.length + 1) {
        return 0;
    }

    // Collapse
    let collapseIndex;
    do {
        
        let needsFull = true;
        for (let i = 0; i < tileSet.length - 1; i++) {
            if (world[lowestY][lowestX][collapseIndex] === 1) {
                needsFull = false;
            }
        }
        if (needsFull) {
            collapseIndex = Math.floor(Math.random() * (tileSet.length - 1));
        } else {
            collapseIndex = tileSet.length - 1;
        }
    } 
    while (world[lowestY][lowestX][collapseIndex] === 0);

    for (let i = 0; i < tileSet.length; i++) {
        if (i !== collapseIndex) {
            world[lowestY][lowestX][i] = 0;
        }
    }

    propagate(lowestY, lowestX, collapseIndex);
    collapse();
}

function drawMaze() {

    ctx.strokeStyle = "black";
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;

    for (let y = 0; y < WORLD_H; y++) {
        for (let x = 0; x < WORLD_W; x++) {
            let collapseIndex;
            let entropy = 0;
            for (let i = 0; i < tileSet.length; i++) {
                if (world[y][x][i] === 1) {
                    collapseIndex = i;
                    entropy++;
                }
            }
            if (entropy > 1) {
                continue;
            }

            let tile = tileSet[collapseIndex];
            if (tile[0][1] === 1) {
                ctx.beginPath();
                ctx.moveTo(x * tileWidth, y * tileHeight);
                ctx.lineTo((x+1) * tileWidth, y * tileHeight);
                ctx.closePath();
                ctx.stroke();
            }
            if (tile[1][0] === 1) {
                ctx.beginPath();
                ctx.moveTo(x * tileWidth, y * tileHeight);
                ctx.lineTo(x * tileWidth, (y+1) * tileHeight);
                ctx.closePath();
                ctx.stroke();
            }
            if (tile[1][2] === 1) {
                ctx.beginPath();
                ctx.moveTo((x+1) * tileWidth, y * tileHeight);
                ctx.lineTo((x+1) * tileWidth, (y+1) * tileHeight);
                ctx.closePath();
                ctx.stroke();
            }
            if (tile[2][1] === 1) {
                ctx.beginPath();
                ctx.moveTo(x * tileWidth, (y+1) * tileHeight);
                ctx.lineTo((x+1) * tileWidth, (y+1) * tileHeight);
                ctx.closePath();
                ctx.stroke();
            }
            
        }
    }
}

let maze = [];
let mazeEnd = WORLD_H * WORLD_W - 1;
function createMaze() {

    initWorld();
    collapse();

    maze = [];
    for (let y = 0; y < WORLD_H; y++) {
        for (let x = 0; x < WORLD_W; x++) {

            let index = y * WORLD_W + x;
            maze.push([]);

            let collapseIndex;
            for (let i = 0; i < tileSet.length; i++) {
                if (world[y][x][i] === 1) {
                    collapseIndex = i;
                    break;
                }
            }

            if (y > 0 && tileSet[collapseIndex][0][1] === 0) {
                maze[index].push(index - WORLD_W);
            }
            if (y < WORLD_H - 1 && tileSet[collapseIndex][2][1] === 0) {
                maze[index].push(index + WORLD_W);
            }
            if (x > 0 && tileSet[collapseIndex][1][0] === 0) {
                maze[index].push(index - 1);
            }
            if (x < WORLD_W - 1 && tileSet[collapseIndex][1][2] === 0) {
                maze[index].push(index + 1);
            }

        }
    }

    if (!dfs(new Set(), 0, WORLD_H * WORLD_W - 1)) {
        createMaze();
    }
}

let path = [];
let search = [];
function dfs(visited, cur) {

    if (visited.has(cur)) {
        return false;
    }
    search.push(cur);
    visited.add(cur);

    if (cur === mazeEnd) {
        return true;
    }

    for (let i = 0; i < maze[cur].length; i++) {
        if (dfs(visited, maze[cur][i])) {
            path.push(maze[cur][i]);
            return true;
        }
    }
    return false;

}

function generatePath(func) {
    path = [];
    search = [];
    func();
    path.push(0);
}

createMaze();
generatePath(() => { dfs(new Set(), 0); });

var drawPath = true;
let pathIndex = 0;
let searchIndex = 0;
function draw() {
    
    if (drawPath) {

        for (let i = 0; i <= searchIndex; i++) {

            let y = Math.floor(search[i] / WORLD_W);
            let x = search[i] % WORLD_W;
            
            ctx.fillStyle = "rgb(100, 200, 50)";
            ctx.strokeStyle = "rgb(100, 200, 50)";
            ctx.beginPath();
            ctx.rect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
        }

        if (searchIndex < search.length - 1) {
            searchIndex++;
        }
            
        if (searchIndex == search.length - 1) {

            for (let i = 0; i <= pathIndex; i++) {

                let y = Math.floor(path[i] / WORLD_W);
                let x = path[i] % WORLD_W;
                
                ctx.fillStyle = "rgb(255, 100, 100)";
                ctx.strokeStyle = "rgb(255, 100, 100)";
                ctx.beginPath();
                ctx.rect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

            }

            if (pathIndex < path.length - 1) {
                pathIndex++;
            }

        }
            
    }

    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, WIDTH, HEIGHT);
    drawMaze();

    window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);