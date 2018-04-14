var path = new Path();
var pathIni = new Path();
var pathTarget = new Path();
var pointCount = 100;
var step = view.viewSize.width / pointCount;
var output = document.querySelector("#output");
var output2 = document.querySelector("#output2");
var CP = {
    x: 0,
    y: view.center.y,
};
var miscValues = {
    force: 0.6
};

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
        path.segments[i].point.y += getDeltaPos(pathTarget.segments[i].point, path.segments[i].point).y * miscValues.force/10; 
        path.segments[i].point.x += getDeltaPos(pathTarget.segments[i].point, path.segments[i].point).x * miscValues.force/10; 
    }

    path.smooth({ type: 'continuous' });
}

function wobble (path, event, speed){
    for(var i = 0; i < path.segments.length; i++){
        pathTarget.segments[i].point.y = pathIni.segments[i].point.y + (Math.sin((i) / 6)  * 25 * getBreath());
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
    // output2.innerHTML = "Best breath duration: " + breathing.bestDelay + "<br>Best breath intensity: " + breathing.bestMaxVolume
    wobble(path, event, getBreath());
    interpolate();
}

initializePath();