var path = new Path();
var pathIni = new Path();
var pathTarget = new Path();

var defaultViewSize = 1014;
var scaleFacViewSIze;

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
    // breathValues.maxBreath = 80;
    scaleFacViewSIze = defaultViewSize / view.viewSize.height;
    breathValues.maxBreath = 450 * scaleFacViewSIze;
    path.segments = [];
    pathIni.segments = [];
    pathTarget.segments = [];

    for(var i = 0; i < pointCount; i++){
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
        var lineCurveCurve = Math.sin((i/path.segments.length) * Math.PI);
        pathTarget.segments[i].point.y = pathIni.segments[i].point.y + (Math.sin((i) / 2)  * getBreath() * lineCurveCurve);
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
    var displayBreathingMaxVolume = Math.round(breathing.maxVolume*100000)/10000;
    var displayBreathingBestMaxVolume = Math.round(breathing.bestMaxVolume*100000)/10000;
    output.innerHTML = "Breath duration:<br>" + breathing.delay + " / Best: " + breathing.bestDelay;
    output2.innerHTML = "Breath intensity:<br>" + displayBreathingMaxVolume + "/ Best: " + displayBreathingBestMaxVolume;
    wobble(path, event, getBreath());
    interpolate();
    console.log(getBreath());
}

initializePath();