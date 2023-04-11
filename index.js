

let path = [];
let search = [];
let pathIndex = 0;
let searchIndex = 0;

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

function runSolver(func) {
    
    path = [];
    search = [];
    func();
    path.push(0);

    pathIndex = 0;
    searchIndex = 0;
    drawPath = true;

}
function draw() {

    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.rect(0, 0, WIDTH, HEIGHT);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
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

createMaze();
window.requestAnimationFrame(draw);
