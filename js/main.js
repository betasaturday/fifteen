(function() {
    var field = [[], [], [], []], cellSize = 65, steps, time, timer,
        cells = [], nums = [];
    var gameField = document.querySelector(".game-field"),
        shuffleBtn = document.querySelector(".shuffle-btn"),
        pauseBtn = document.querySelector(".pause-btn"),
        quitBtn = document.querySelector(".quit-btn"),
        timeSpan = document.querySelector("span.time"),
        stepsSpan = document.querySelector("span.steps"),
        gameBoard = document.querySelector(".game-board"),
        pauseWindow = document.querySelector(".pause-window"),
        resumeBtn = document.querySelector(".pause-window > .icon"),
        winWindow = document.querySelector(".win-window"),
        gameWindow = document.querySelector(".game-window"), 
        clickSound = document.querySelector("#click"),
        phoneSound = document.querySelector("#phone"),
        soundBtn = document.querySelector(".sound"),
        restartBtn = document.querySelector(".win-window span");
    
    var dx = [0, 1, 0, -1], dy = [-1, 0, 1, 0], dirs = ["up", "right", "down", "left"];
    var dx = [0, 1, 0, -1], dy = [-1, 0, 1, 0], dirs = ["up", "right", "down", "left"];
    
    gameField.addEventListener("click", function(event) {
        if (event.target.parentNode === gameField)
            checkForMove(event.target);
    });
    shuffleBtn.addEventListener("click", function(){
        requestAnimationFrame(shuffle);
    });
    pauseBtn.addEventListener("click", pause);
    quitBtn.addEventListener("click", showScoreboard);
    resumeBtn.addEventListener("click", function(e) {
        var rect = resumeBtn.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top,
            w = resumeBtn.clientWidth,
            h = resumeBtn.clientHeight;
        
        var or1 = oriented(0, h, w, h/2, x, y),
            or2 = oriented(0, 0, w, h/2, x, y);
        
        if (oriented(0, h, w, h/2, x, y) < 0
            &&  oriented(0, 0, w, h/2, x, y) > 0)
        {
            resume();
        }
    });
    soundBtn.addEventListener("click", function(){
        if (soundBtn.getAttribute("data-icon") == "g")
        {
            soundBtn.setAttribute("data-icon", "f");
            phoneSound.pause();
        }
        else{
            soundBtn.setAttribute("data-icon", "g");
            phoneSound.play();
        }
    });
    restartBtn.addEventListener("click", function(){
        requestAnimationFrame(initialize);
    });
    
    for(var i = 1; i <= 15; ++i)
    {
        var cell = document.createElement("div");
        cell.style.backgroundImage = "url(images/cell.png)";
        cell.style.width = cellSize + "px";
        cell.style.height = cellSize + "px";
        cell.innerHTML = i + "";
        gameField.appendChild(cell);
        cells.push(cell);
    }
    var numsLength = Math.floor(Math.random()*15) + 20;
    for (var i = 0; i < numsLength; ++i)
    {
        var num = document.createElement("div"),
            text = 1 + Math.floor(Math.random()*14) + "";
        num.innerHTML = text;
        nums.push(num);
        pauseWindow.insertBefore(num, resumeBtn);
    }
    
    initialize();
    phoneSound.play();
    
    
    
    
    
    
    function initialize()
    {
        if (winWindow.style.display != "none")
        {
            winWindow.style.display = "none";
            gameWindow.style.display = "block";
        }
        steps = 0;
        time = 0;
        requestAnimationFrame(function() {
            stepsSpan.innerHTML = "0";
            pauseTimer();
            drawTime();
        });
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
        var j = Math.floor(pxToNum(cell.style.left)/cellSize), 
            i = Math.floor(pxToNum(cell.style.top)/cellSize);
        if (!ok(i) || !ok(j) || field[i][j] === 0)
            return;
        for (var z = 0; z < 4; ++z)
        {
            for (var t = 1; t <= 3; ++t)
            {
                var nx = j + t*dx[z], ny = i + t*dy[z];
                if (ok(nx) && ok(ny)
                    && field[ny][nx] === 0)
                {
                    if (steps == 0)
                    {
                        restartTimer();
                    }    
                    steps += t;

                    (function(t, z) {
                    requestAnimationFrame(function() {
                        for (var tt = t - 1; tt >= 0; --tt)
                        {
                            var nom = field[i + tt*dy[z]][j + tt*dx[z]] - 1;
                            move(cells[nom],
                                 {y: i + tt*dy[z], x: j + tt*dx[z]},
                                 {y: i + (tt + 1)*dy[z], x: j + dx[z]*(tt + 1)}, true);
                        }
                        if (win())
                        {
                            gameWindow.style.display = "none";
                            winWindow.style.display = "block";
                        }
                        stepsSpan.innerHTML = steps;
                    });
                    })(t, z);
                    break;
                }
            }
        }
    }
    
    function move(cell, from, to, animate)
    {
        if (cell == undefined)
        {
            console.log(from.x + " " + from.y);
            console.log(to.x + " " + to.y);
        }
        field[to.y][to.x] = field[from.y][from.x];
        field[from.y][from.x] = 0;
        cell.style.zIndex = to.y*4 + to.x;
        
        var dir = findDir(to.x - from.x, to.y - from.y);
        
        if (animate === true)
        {
            cell.classList.add("move-" + dir);
            cell.offsetHeight = cell.offsetHeight;
            clickSound.play();
            setTimeout(function() {
                cell.classList.remove("move-" + dir);
                cell.style.left = to.x*cellSize + "px";
                cell.style.top  = to.y*cellSize + "px";

            }, 420);
        }
        else{
            cell.style.left = to.x*cellSize + "px";
            cell.style.top  = to.y*cellSize + "px";
        }
    }
    
    function ok(coord)
    {
        return coord >= 0 && coord < 4;
    }
    
    function shuffle()
    {
        initialize();
        clearTimeout(timer);
        drawTime();
        stepsSpan.innerHTML = "0";
        
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
        var m = Math.floor(time/60),
            s = time%60;
        
        timeSpan.innerHTML = to2digits(m) + ":" + to2digits(s);
    }
    function to2digits(num)
    {
        var res = num + "";
        if (res.length == 1)
            res = "0" + res;
        return res;
    }
    function pause()
    {
        pauseTimer();
        gameBoard.style.display = "none";
        pauseWindow.style.display = "block";
        var innerWidth = pauseWindow.clientWidth - 20,
            innerHeight = pauseWindow.clientHeight - 20;
        
        for (var i = 0; i < nums.length; ++i)
        {
            var num = nums[i], fail = true;
            while (fail)
            {
                num.style.fontSize = Math.floor(Math.random()*30)+16 + "px";
                num.style.left = Math.floor(Math.random()*(innerWidth - num.clientWidth)) + "px";
                num.style.top = Math.floor(Math.random()*(innerHeight - num.clientHeight)) + "px";       
                if (noIntersections(i))
                {
                    fail = false;
                }
            }
        }
    }
    function showScoreboard()
    {
    }
    function restartTimer()
    {
        timer = setInterval(timerTick, 1000);
        time = 0;
    }
    function pauseTimer()
    {
        clearInterval(timer);
    }
    function resume()
    {
        if (steps > 0)
        {
            timer = setInterval(timerTick, 1000);
        }
        gameBoard.style.display = "block";
        pauseWindow.style.display = "none";
    }
    function noIntersections(to)
    {
        for (var i = 0; i < to; ++i)
        { 
            if (isIntersection(nums[i].getBoundingClientRect(), nums[to].getBoundingClientRect()))
                return false;
        }
        return true;
    }
    function isIntersection(a, b)
    {
        return (segmentsIntersect(a.left, a.right, b.left, b.right)
            && segmentsIntersect(a.top, a.bottom, b.top, b.bottom));
    }
    function segmentsIntersect(a, b, c, d)
    {
        return !(c > b || a > d);
    }
    function oriented(ax, ay, bx, by, cx, cy)
    {
        return (bx - ax)*(cy - by) - (by - ay)*(cx - bx);
    }
    function win()
    {
        for (var i = 0; i < 16; ++i)
        {
            if (field[Math.floor(i/4)][i%4] != (i + 1)%16)
                return false;
        }
        return true;
    }
    function findDir(x, y)
    {
        for (var i = 0; i < 4; ++i)
            if (dx[i] === x && dy[i] === y)
                return dirs[i];
    }
})();