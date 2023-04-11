

let path = [];
let search = [];
let pathIndex = 0;
let searchIndex = 0;

function dfs() {

    let visited = new Set();

    function run(cur) {

        if (visited.has(cur)) {
            return false;
        }
        search.push(cur);
        visited.add(cur);

        if (cur === mazeEnd) {
            return true;
        }

        for (let i = 0; i < maze[cur].length; i++) {
            if (run(maze[cur][i])) {
                path.push(maze[cur][i]);
                return true;
            }
        }
        return false;

    }

    run(0);

}

function bfs() {

    let queue = [0];
    let visited = new Set();

    let from = new Array(WORLD_H * WORLD_W);

    while (queue.length > 0) {

        let index = queue.shift();
        if (visited.has(index)) {
            continue;
        }

        visited.add(index);
        search.push(index);

        if (index == mazeEnd) {
            break;
        }

        maze[index].forEach(element => {

            if (!visited.has(element)) {
                queue.push(element);
                from[element] = index;
            }

        });

    }

    let cur = mazeEnd;
    while (cur != 0) {

        path.push(cur);
        cur = from[cur];
    }

}

let heuristicBias = 1.5;
function aStar() {
    
    // Initialize gList with the start node as 0
    let gList = new Map();
    gList.set(0, 0);

    // Initialize the hList with the manhattan distance from the end
    let hList = new Map();
    for (let y = 0; y < WORLD_H; y++) {
        for (let x = 0; x < WORLD_W; x++) {

            let index = y * WORLD_W + x;
            hList.set(index, Math.abs((mazeEnd % WORLD_W) - x) + Math.abs(Math.floor(mazeEnd / WORLD_W) - y));

        }
    }

    // Initialize the queue and list of seen nodes
    let queue = new Array();
    queue.push(0);
    let seen = new Set();
    seen.add(0);
    let from = new Array(WORLD_H * WORLD_W);
    
    while (queue.length > 0) {

        // Sort the queue by f value
        queue.sort((a, b) => {
            let fA = gList.get(a) + heuristicBias*hList.get(a);
            let fB = gList.get(b) + heuristicBias*hList.get(b);
            return fA - fB;
        });

        // Take the lowest index
        let index = queue.shift();
        search.push(index);

        if (index == mazeEnd) {
            break;
        }

        // Add the neighbors to the queue
        maze[index].forEach(neighbor => {
            if (!seen.has(neighbor)) {

                seen.add(neighbor);
                gList.set(neighbor, gList.get(index)+1); // increment the neighbor g
                queue.push(neighbor);
                from[neighbor] = index;
            }
        })
    }

    // Generate the backwards path
    let cur = mazeEnd;
    while (cur != 0) {

        path.push(cur);
        cur = from[cur];
    }
}

function runSolver(func) {
    
    path = [];
    search = [];
    func();
    path.push(0);

    pathIndex = 0;
    searchIndex = 0;
    drawPath = true;

    // When starting the solver, redraw the background to wipe previous
    // By not doing this in the draw loop, it allows the visualizer to paint tiles one at a time, instead of drawing
    // i <= searchIndex every frame
    drawBackground();

}

function draw() {
    
    if (drawPath) {

        // Draw the next search
        if (searchIndex < search.length - 1) {

            let y = Math.floor(search[searchIndex] / WORLD_W);
            let x = search[searchIndex] % WORLD_W;
            
            ctx.fillStyle = "rgb(100, 200, 50)";
            ctx.strokeStyle = "rgb(100, 200, 50)";
            ctx.beginPath();
            ctx.rect(x * tileWidth + 1, y * tileHeight + 1, tileWidth - 2, tileHeight - 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            searchIndex++;

        // Draw the next path
        } else if (pathIndex < path.length) {

            let y = Math.floor(path[pathIndex] / WORLD_W);
            let x = path[pathIndex] % WORLD_W;
            
            ctx.fillStyle = "rgb(255, 100, 100)";
            ctx.strokeStyle = "rgb(255, 100, 100)";
            ctx.beginPath();
            ctx.rect(x * tileWidth + 1, y * tileHeight + 1, tileWidth - 2, tileHeight - 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            pathIndex++;

        } else {
            drawPath = false;
        }
            
    }

    // Draw maze over path
    drawMaze();

    // Boundary
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, WIDTH, HEIGHT);

    // Call next frame
    window.requestAnimationFrame(draw);
}

createMaze();
window.requestAnimationFrame(draw);
