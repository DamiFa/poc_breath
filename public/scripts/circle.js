var path = new Path();
var pathIni = new Path();
var pathTarget = new Path();
var output = document.querySelector("#output");
var CP = {
    x: view.center.x,
    y: view.center.y,
};
var miscValues = {
    force: 0.6,
    forceToIni : 0.7
}
var circleValues = {
    pointCount: 20,
    radius: 50
}
circleValues.angle = 2*Math.PI/ circleValues.pointCount;
circleValues.getX = function(increment, delta){
    return circleValues.radius * delta * Math.cos(circleValues.angle * increment) + CP.x;
};
circleValues.getY = function(increment, delta){
    return circleValues.radius * delta * Math.sin(circleValues.angle * increment) + CP.y;
};

function initializePath(){
    breathValues.maxBreath = view.viewSize.height / (125);
    path.segments = [];
    pathIni.segments = [];
    pathTarget.segments = [];

    for(var i = 0; i < circleValues.pointCount; i++){
        var tP = new paper.Point({
            x: circleValues.getX(i, 1),
            y: circleValues.getY(i, 1)
        });
        
        path.add(tP);
        pathIni.add(tP)
        pathTarget.add(tP);
    }

    path.closePath();
    pathTarget.closePath();
    pathIni.closePath();

    path.style = {
        strokeColor: 'red',
        strokeWidth: 5
    };

    path.smooth({ type: 'continuous' });

    // path.fullySelected = true;

    // pathTarget.style = {
    //     strokeColor: 'orange',
    //     strokeWidth: 2
    // };
    // pathIni.style = {
    //     strokeColor: 'green',
    //     strokeWidth: 2
    // };
}

function interpolate (pathToMove, pathToTarget, interpolateForce){
    for(var i = 0; i < path.segments.length; i++){
        pathToMove.segments[i].point.y += getDeltaPos(pathToTarget.segments[i].point, pathToMove.segments[i].point).y * interpolateForce/10; 
        pathToMove.segments[i].point.x += getDeltaPos(pathToTarget.segments[i].point, pathToMove.segments[i].point).x * interpolateForce/10;
    }

    pathToMove.smooth({ type: 'continuous' });
}

function wobble (path, event, speed){
    for(var i = 0; i < path.segments.length; i++){
        pathTarget.segments[i].point.y = circleValues.getY(i, getBreath()+1);
        pathTarget.segments[i].point.x = circleValues.getX(i, getBreath()+1);
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

view.onFrame = function(event){
    var displayBreathingMaxVolume = Math.round(breathing.maxVolume*100000)/10000
    output.innerHTML = "breath duration: " + breathing.delay + "<br>breath intensity: " + displayBreathingMaxVolume;
    // if(Key.isDown("space")) setPos(pathTarget);
    wobble(path, event, getBreath());
    interpolate(path, pathTarget, miscValues.force);
    interpolate(pathTarget, pathIni, miscValues.forceToIni);
}

initializePath();