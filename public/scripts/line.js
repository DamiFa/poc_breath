var path = new Path();
var pointCount = 100;
var step = view.viewSize.width / pointCount;
var previousMousePoint;
var mousePoint;
var speed = 1;
var output = document.querySelector("#output");
var input1 = document.querySelector("#input1");
var input2 = document.querySelector("#input2");
var pointsIni = [];

var CP = {
    x: 0,
    y: view.center.y,
};

function initializePath(){
    path.segments = [];

    for(var i = 1; i < pointCount; i++){
        var tP = new paper.Point({
            x: i * step + CP.x,
            y: CP.y
        });
        
        path.add(tP);
        pointsIni.push({
            x: tP.x,
            y: tP.y
        });
    }

    path.style = {
        strokeColor: 'red',
        strokeWidth: 5
    };

    path.smooth({ type: 'continuous' });
    // path.fullySelected = true;
}

function wobble (path, event, speed){
    for(var i = 0; i < path.segments.length; i++){
        path.segments[i].point.y = pointsIni[i].y + Math.sin((event.count + i) / input1.value) * input2.value;
    }
}

function getDistance(pointA, pointB){
    var res = Math.sqrt(Math.pow((pointA.x-pointB.x), 2) + Math.pow((pointA.y-pointB.y), 2));
    return res;
}

view.onMouseMove = function(event){
    previousMousePoint = mousePoint || CP;
    mousePoint = event.point;
    speed = getDistance(previousMousePoint, mousePoint);
};

view.onFrame = function(event){
    wobble(path, event, speed);
    output.innerHTML ="input1: " + input1.value + ", input2: " + input2.value + ", speed: " + speed;
}

console.log("brou");

initializePath();