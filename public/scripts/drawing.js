var path = new Path();

var CP = {
   x: view.center.x,
   y: view.center.y,
};


function initializePath() {
    center = CP;
	path.segments = [];
	for (var i = 1; i < 500; i++) {

        var tP = new paper.Point({
            length: 2 * i,
            angle: 10 * i
        });
        
        tP.x = tP.x + CP.x;
        tP.y = tP.y + CP.y;
        
		path.add(tP);
	}
    path.fullySelected = true;
}

path.style = {
    strokeColor: 'red',
    strokeWidth: 5
}

path.smooth({ type: 'continuous' });

initializePath();

view.onResize = function(){
    // CP.replaceCenter();
}

    