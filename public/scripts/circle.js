var path = new Path();
var bumpers = [];
var goalCirclePath = new Path();
var pathTarget = new Path();
var output = document.querySelector("#output");
var output2 = document.querySelector("#output2");
var CP = {
    x: view.center.x,
    y: view.center.y,
};
var miscValues = {
    force: 0.96,
    forceToIni : 0.85
}
var circleValues = {
    pointCount: 20,
    radius: 50
}
var goalCircleValues = {
    pointCount: 20,
    radius: 300
}
var bumpersData = [{
        pos: new Point(90 + CP.x, 100 + CP.y),
        color : "red",
        intersectColor : function(){return "pink"},
        sound: new Howl({
            src: ['/sounds/corona.mp3'],
            loop: false
        }),
        size: 20
    },
    {
        pos: new Point(200, 250),
        color : "green",
        intersectColor : function(){return "brown"},
        sound: new Howl({
            src: ['/sounds/piston-1.mp3'],
            loop: false
        }),
        size: 30
    },
    {
        pos: new Point(860, 390),
        color : "yellow",
        intersectColor : function(){return "orange"},
        sound: new Howl({
            src: ['/sounds/bubbles.mp3'],
            loop: false
        }),
        size: 10
    }
]
circleValues.angle = 2*Math.PI/ circleValues.pointCount;
circleValues.getX = function(increment, delta){
    return circleValues.radius * delta * Math.cos(circleValues.angle * increment) + CP.x;
};
circleValues.getY = function(increment, delta){
    return circleValues.radius * delta * Math.sin(circleValues.angle * increment) + CP.y;
};

function initializeBumpers(){
    for(var i = 0; i < bumpersData.length; i++){
        var tempBumper = {};
        tempBumper.id = i;
        tempBumper.path = new Path.Circle(bumpersData[i].pos, bumpersData[i].size);
        tempBumper.intersects = false;
        tempBumper.path.fillColor = bumpersData[i].color;

        tempBumper.onEnter = function (){
            this.path.fillColor = bumpersData[this.id].intersectColor();
            bumpersData[this.id].sound.play();
        }
        tempBumper.onExit = function (){
            this.path.fillColor = bumpersData[this.id].color;
        }

        bumpers.push(tempBumper);
    }

    console.log(bumpers[0].onEnter);
}

function initializePath(){
    breathValues.maxBreath = view.viewSize.height / (700);
    path.segments = [];
    pathTarget.segments = [];

    for(var i = 0; i < circleValues.pointCount; i++){
        var tP = new paper.Point({
            x: circleValues.getX(i, 1),
            y: circleValues.getY(i, 1)
        });
        
        path.add(tP);
        goalCirclePath.add(tP)
        pathTarget.add(tP);
    }

    path.closePath();
    pathTarget.closePath();
    goalCirclePath.closePath();

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
}

function interpolate (pathToMove, pathToTarget, interpolateForce){
    for(var i = 0; i < path.segments.length; i++){
        pathToMove.segments[i].point.y += getDeltaPos(pathToTarget.segments[i].point, pathToMove.segments[i].point).y * interpolateForce/10; 
        pathToMove.segments[i].point.x += getDeltaPos(pathToTarget.segments[i].point, pathToMove.segments[i].point).x * interpolateForce/10;
    }

    pathToMove.smooth({ type: 'continuous' });
}

function wobble (path, event){
    for(var i = 0; i < path.segments.length; i++){
        var deltaToAdd = (getBreath() + 0.01) * 6 + (Math.sin(Math.random()) + 1);
        pathTarget.segments[i].point.y = circleValues.getY(i, deltaToAdd);
        pathTarget.segments[i].point.x = circleValues.getX(i, deltaToAdd);
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

function interstectHandler(){
    for(var i = 0; i < bumpers.length; i++){
        if(bumpers[i].path.intersects(path)) {
            if(!bumpers[i].intersects) bumpers[i].onEnter();
            bumpers[i].intersects = true;
        }
        else{
            if(bumpers[i].intersects) bumpers[i].onExit();
            bumpers[i].intersects = false;
        }
    }
}

view.onFrame = function(event){
    var displayBreathingMaxVolume = Math.round(breathing.maxVolume*100000)/10000;
    var displayBreathingBestMaxVolume = Math.round(breathing.bestMaxVolume*100000)/10000;
    output.innerHTML = "Breath duration:<br>" + breathing.delay + " / Best: " + breathing.bestDelay;
    output2.innerHTML = "Breath intensity:<br>" + displayBreathingMaxVolume + "/ Best: " + displayBreathingBestMaxVolume;
    wobble(path, event);
    interpolate(path, pathTarget, miscValues.force);
    interstectHandler();
}

initializePath();
initializeBumpers();