var canvas = null;
var ctx = null;
    
initialStep = 5;
debouncedDraw = debounce(draw, 500);

function ClearCanvas()
{
    ctx.resetTransform();
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(canvas.width,0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0,canvas.height);
    ctx.closePath();
    ctx.stroke(); 
}

// Recursive draw 
function DrawFractal(step) 
{
    if (step > 0) 
    {
    var firstRun = step == initialStep;
    step = step-1; 
    ctx.save();
    ctx.save();
    ctx.save();
    ctx.transform(-0.5, 0, 0, 0.5, canvas.width * 0.5, 0);
    if(firstRun)
    {
        ctx.fillStyle = "rgb(255,0,0)";
    }
    DrawFractal(step); 
    ctx.restore();
    var cos = Math.cos(-Math.PI/2);
    var sin = Math.sin(-Math.PI/2);
    ctx.transform(cos, sin, -sin, cos, canvas.width * 0.5, 0); 
    ctx.transform(-0.5, 0, 0, 0.5, 0, 0);
    if(firstRun)
    {
        ctx.fillStyle = "rgb(0,255,0)";
    }
    DrawFractal(step); 
    ctx.restore();
    ctx.transform(0.5, 0, 0, 0.5, canvas.width * 0.5, canvas.height * 0.5);
    if(firstRun)
    {
        ctx.fillStyle = "rgb(0,0,255)";
    }
    DrawFractal(step);
    ctx.restore();
    cos = Math.cos(Math.PI/2);
    sin = Math.sin(Math.PI/2);
    ctx.transform(cos, sin, -sin, cos, canvas.width * 0.25, canvas.height * 0.5);
    ctx.transform(0.25, 0, 0, 0.25, 0, 0);
    if(firstRun)
    {
        ctx.fillStyle = "rgb(0,255,255)";
    }
    DrawFractal(step); 
    }
    else 
    {
        drawFigure();
    }
}  

function drawFigure() 
{
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(canvas.width * 1 / 3,0);
    ctx.lineTo(canvas.width * 1 / 3, canvas.height * 0.5);
    ctx.lineTo(canvas.width, canvas.height * 0.5);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.fill();
}

function anim_T1(t)
{
    tbigger = 1.5 * t;
    t = t * 0.5;
    ctx.save();
    ctx.translate(canvas.width * t, 0);
    ctx.scale((1-tbigger), 1-t);
    drawFigure();
    ctx.restore();
}

function anim_T2(t)
{
    tbigger = 1.5 * t;
    t = 0.5 * t;
    ctx.save();
    ctx.translate(canvas.width * t, 0);
    ctx.rotate(-Math.PI*t);
    ctx.scale(1 - tbigger, 1 - t);
    drawFigure();
    ctx.restore();
}

function anim_T3(t)
{
    t = 0.5 * t;
    ctx.save();
    ctx.translate(canvas.width * t, canvas.height * t);
    ctx.scale((1 - t), (1 - t));
    drawFigure();
    ctx.restore();
}

function anim_T4(t)
{
    t = 0.25 * t;
    ctx.save();
    ctx.translate(canvas.width * t, canvas.height * 2 * t);
    ctx.rotate(Math.PI*t*2);
    ctx.scale(1-3*t, 1 - 3*t);
    drawFigure();
    ctx.restore();
}

function StartAnimate(Ttype)
{
    var t = 0, 
        N = 200;
    var interval = setInterval(function()
    {
        ClearCanvas();
        if(t >= 1)
        {
            clearInterval(interval);
        }
        if(Ttype == 1)
        {
            ctx.fillStyle = "rgb(255,0,0)";
            anim_T1(t);            
        }
        else if(Ttype == 2)
        {
            ctx.fillStyle = "rgb(0,255,0)";
            anim_T2(t);
        }
        else if(Ttype == 3)
        {
            ctx.fillStyle = "rgb(0,0,255)";
            anim_T3(t);
        }
        else if(Ttype == 4)
        {
            ctx.fillStyle = "rgb(0,255,255)";
            anim_T4(t);
        }
        t += 1/N;
    }, 10);
}



function draw() 
{
    if(canvas == null || ctx == null)
    {
        canvas = document.getElementById('canvas');
        if (canvas.getContext) 
        {
            ctx = canvas.getContext("2d");
        }
    }

    ClearCanvas(ctx);
    DrawFractal(initialStep);
}


function changeFractal(value)
{
    document.getElementById('fractalStep').innerHTML = value;
    initialStep = value;
    debouncedDraw();
}
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};