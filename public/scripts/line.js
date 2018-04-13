var path = new Path();
var pathIni = new Path();
var pathTarget = new Path();
var pointCount = 100;
var step = view.viewSize.width / pointCount;
var previousMousePoint;
var mousePoint;
var speed = 1;
var output = document.querySelector("#output");
var input1 = document.querySelector("#input1");
var input2 = document.querySelector("#input2");

var CP = {
    x: 0,
    y: view.center.y,
};

var values = {
    force: 0.6
}

function initializePath(){
    path.segments = [];
    pathIni.segments = [];
    pathTarget.segments = [];

    for(var i = 1; i < pointCount; i++){
        var tP = new paper.Point({
            x: i * step + CP.x,
            y: CP.y
        });
        
        path.add(tP);

        pathIni.add(tP)
        pathTarget.add(tP);
    }

    path.style = {
        strokeColor: 'red',
        strokeWidth: 5
    };
    pathIni.style = {
        strokeColor: 'green',
        strokeWidth: 2
    };
    pathTarget.style = {
        strokeColor: 'orange',
        strokeWidth: 2
    };

    path.smooth({ type: 'continuous' });
    // path.fullySelected = true;
}


function interpolate (){
    for(var i = 0; i < path.segments.length; i++){
        path.segments[i].point.y += getDeltaPos(pathTarget.segments[i].point, path.segments[i].point).y * values.force/10; 
    }
}

function wobble (path, event, speed){
    for(var i = 0; i < path.segments.length; i++){
        pathTarget.segments[i].point.y = pathIni.segments[i].point.y + Math.sin((event.count + i) / input1.value) * input2.value;
    }
}

function getDeltaPos (pointA, pointB){
    var pos = {};
    pos.x = pointA.x - pointB.x;
    pos.y = pointA.y - pointB.y;
    return pos;
}

function getDistance(pointA, pointB){
    var res = Math.sqrt(Math.pow((pointA.x-pointB.x), 2) + Math.pow((pointA.y-pointB.y), 2));
    return res;
}

function setPos(path){
    for(var i = 0; i < path.segments.length; i++){
        pathTarget.segments[i].point.y = (Math.random()-0.5)*200 + CP.y;
    }
}

view.onMouseMove = function(event){
    previousMousePoint = mousePoint || CP;
    mousePoint = event.point;
    speed = getDistance(previousMousePoint, mousePoint);
};

view.onFrame = function(event){
    // wobble(path, event, speed);
    interpolate();
    output.innerHTML ="input1: " + input1.value + ", input2: " + input2.value + ", speed: " + speed;
    if(Key.isDown("space")) setPos(pathTarget);
}

initializePath();