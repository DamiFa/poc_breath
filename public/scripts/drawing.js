var path = new Path();
var breathStrength = 1;

var CP = {
    x: view.center.x,
    y: view.center.y,
 };
var previousMousePoint;
var mousePoint;
var speed = 1;



function initializePath() {
    center = CP;
	path.segments = [];
	for (var i = 0; i < 500; i++) {

        var tP = new paper.Point({
            length: 2 * i,
            angle: 10 * i
        });
        
        tP.x = tP.x + CP.x;
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

view.onMouseMove = function(event){
    previousMousePoint = mousePoint || CP;
    mousePoint = event.point;
    speed = getModule(previousMousePoint, mousePoint);
};

function wobble (path, event){
    for(var i = 0; i < path.segments.length; i++){
        // path.segments[i].point.angle += Math.sin((event.count + i) / 100);
        path.segments[i].point.length += Math.sin((event.count + i) / 10) * speed/2;
    }
}

function getModule(pointA, pointB){
    var res = Math.sqrt(Math.pow((pointA.x-pointB.x), 2) + Math.pow((pointA.y-pointB.y), 2));
    return res;
}

view.onFrame = function(event){
    // wobble(path, event);
};

view.onResize = function(){
    // CP.replaceCenter();
};

initializePath();

    