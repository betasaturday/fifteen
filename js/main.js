(function() {
    var field = [[], [], [], []], cellSize = 65, steps, time, timer,
        cells = [];
    var gameField = document.querySelector(".game-field"),
        shuffleBtn = document.querySelector(".shuffle-btn"),
        pauseBtn = document.querySelector(".pause-btn"),
        quitBtn = document.querySelector(".quit-btn");
    
    var dx = [0, 1, 0, -1], dy = [-1, 0, 1, 0];
    
    gameField.addEventListener("click", function(event) {
        if (event.target.parentNode === gameField)
            checkForMove(event.target);
    });
    shuffleBtn.addEventListener("click", function(){
        requestAnimationFrame(shuffle);
    });
    pauseBtn.addEventListener("click", pause);
    quitBtn.addEventListener("click", showScoreboard);
    for(var i = 1; i <= 15; ++i)
    {
        var cell = document.createElement("div");
        cell.style.backgroundImage = "url(/images/cell.png)";
        cell.style.width = cellSize + "px";
        cell.style.height = cellSize + "px";
        cell.innerHTML = i + "";
        gameField.appendChild(cell);
        cells.push(cell);
    }
    
    initialize();

    
    
    
    
    
    
    function initialize()
    {
        steps = 0;
        time = 0;
        cells.forEach(function(cell) {
            var num = +cell.innerHTML - 1,
                i = Math.floor(num/4),
                j = num%4;
            cell.style.left = j*cellSize + "px";
            cell.style.top = i*cellSize + "px";

            cell.style.zIndex = num;
        });
        
        for (var i = 0; i < 16; ++i)
        {
            field[Math.floor(i/4)][i%4] = (i + 1)%16;
        }
    }
    
    function checkForMove(cell)
    {
        var j = pxToNum(cell.style.left)/cellSize, 
            i = pxToNum(cell.style.top)/cellSize;
        for (var z = 0; z < 4; ++z)
        {
            var nx = j + dx[z], ny = i + dy[z];
            if (ok(nx) && ok(ny)
                && field[ny][nx] === 0)
            {
                ++steps;
                if (steps == 1)
                {
                    setInterval(timerTick, 1000);
                }
                requestAnimationFrame(function() {
                    move(cell, {y: i, x: j}, {y: ny, x: nx});
                });
                break;
            }
        }
    }
    
    function move(cell, from, to)
    {
        if (cell == undefined)
        {
            console.log(from.x + " " + from.y);
            console.log(to.x + " " + to.y);
        }
        field[to.y][to.x] = field[from.y][from.x];
        field[from.y][from.x] = 0;
        cell.style.zIndex = to.y*4 + to.x;
        
        cell.style.left = to.x*cellSize + "px";
        cell.style.top  = to.y*cellSize + "px";
    }
    
    function ok(coord)
    {
        return coord >= 0 && coord < 4;
    }
    
    function shuffle()
    {
        initialize();
        var empty = {x: 3, y: 3}, 
            moves = Math.floor(10 + Math.random()*90);
        while (moves--)
        {
            var made = false;
            while (!made)
            {
                var wh = Math.floor(Math.random()*4), 
                    from = {x: empty.x + dx[wh], y:empty.y + dy[wh]};
                
                if (ok(from.x) 
                    && ok(from.y))
                {
                    move(cells[field[from.y][from.x] - 1],
                         from,
                         {x: empty.x, y: empty.y});
                    empty = from;
                    made = true;
                }
            }
            
        }
    }
    function pxToNum(px)
    {
        return +px.substr(0, px.length - 2);
    }
    
    function timerTick()
    {
        ++time;
        requestAnimationFrame(drawTime);
    }
    function drawTime()
    {
    }
    function pause()
    {
    }
    function showScoreboard()
    {
    }
})();