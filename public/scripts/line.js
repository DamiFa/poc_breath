var path = new Path();
var pathIni = new Path();
var pathTarget = new Path();
var pointCount = 100;
var step = view.viewSize.width / pointCount;
var previousMousePoint;
var mousePoint;
var volume = 0;
var breath = 0;
var breathingDelay = 0;
var output = document.querySelector("#output");
var input1 = document.querySelector("#input1");
var input2 = document.querySelector("#input2");
var CP = {
    x: 0,
    y: view.center.y,
};
var values = {
    force: 0.6,
    soundThreshold : 0.1,
    breathThreshold : 0.6,
    breathDelta : 0.0005,
    // 0.0001 min avant que la courbe ne bouge plus
    maxBreath: 6
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
    // pathTarget.style = {
    //     strokeColor: 'green',
    //     strokeWidth: 2
    // };
}

function interpolate (){
    for(var i = 0; i < path.segments.length; i++){
        path.segments[i].point.y += getDeltaPos(pathTarget.segments[i].point, path.segments[i].point).y * values.force/10; 
        path.segments[i].point.x += getDeltaPos(pathTarget.segments[i].point, path.segments[i].point).x * values.force/10; 
    }

    path.smooth({ type: 'continuous' });
}

function wobble (path, event, speed){
    for(var i = 0; i < path.segments.length; i++){
        pathTarget.segments[i].point.y = pathIni.segments[i].point.y + (Math.sin((i) / input1.value) * input2.value * getBreath());
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

function getBreath(){
    breath = meter ? meter.volume : breath;

    var distance = values.maxBreath - breathingDelay;

    if(breath > values.breathThreshold){
        breathingDelay += values.breathDelta * distance;
    }
    else {
        breathingDelay -= values.breathDelta * breathingDelay;
    }

    return breathingDelay;
}

view.onFrame = function(event){
    output.innerHTML = "breath intensity: " + getBreath();
    // if(Key.isDown("space")) setPos(pathTarget);
    wobble(path, event, getBreath());
    interpolate();
}

initializePath();