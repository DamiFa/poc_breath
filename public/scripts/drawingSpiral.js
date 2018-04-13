var path = new Path();

var CP = {
    x: view.center.x,
    y: view.center.y,
};
var previousMousePoint;
var mousePoint;
var speed = 1;
var output = document.querySelector("#output");

function initializePath() {
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
}

path.style = {
    strokeColor: 'red',
    strokeWidth: 5
}

path.smooth({ type: 'continuous' });

function wobble (path, event, speed){
    for(var i = 0; i < path.segments.length; i++){
        // path.segments[i].point.angle += Math.sin((event.count + i) / 100);
        // path.segments[i].point.length += 1;
        path.segments[i].point.length = (2 * i) + ((100 + speed*2) * (Math.sin(event.count*0.1 + i)*0.05 + 1));
        path.segments[i].point.angle = 10 * i;
        path.segments[i].point.x = path.segments[i].point.x + CP.x;
        path.segments[i].point.y = path.segments[i].point.y + CP.y;
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

    output.innerHTML ="x:" + mousePoint.x + ", y:" + mousePoint.y + ", speed: " + speed;
};

view.onFrame = function(event){
    // wobble(path, event, speed);
};

view.onResize = function(){
    // CP.replaceCenter();
};

initializePath();