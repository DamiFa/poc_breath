var path = new Path();
var pathIni = new Path();
var pathTarget = new Path();
var pointCount = 100;
var step = view.viewSize.width / pointCount;
var previousMousePoint;
var mousePoint;
var volume = 0;
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
        pathTarget.segments[i].point.y = pathIni.segments[i].point.y + (Math.sin((i) / input1.value) * input2.value * getSpeed());
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

function getSpeed(){
    // return Math.min(speed, 5);
    return meter ? Math.pow(meter.volume, 2) : 0;
}

view.onMouseMove = function(event){
    previousMousePoint = mousePoint || CP;
    mousePoint = event.point;
    speed = getDistance(previousMousePoint, mousePoint);

    event.stopPropagation();
};

view.onFrame = function(event){
    output.innerHTML ="input1: " + input1.value + ", input2: " + input2.value + ", breath intensity: " + getSpeed();
    // if(Key.isDown("space")) setPos(pathTarget);
    wobble(path, event, getSpeed());
    interpolate();
}

initializePath();


/* function initializePath() {
	path.segments = [];
	for (var i = 0; i < 100; i++) {

        var tP = new paper.Point({
            length: 1 * i + 20,
            angle: 10 * i
        });
        
        tP.x = tp.x + CP.x;
        tP.y = tP.y + CP.y;
        
		path.add(tP);
	}
    // path.fullySelected = true;
} */