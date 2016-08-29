window.onload = function() {
    var canvas = document.getElementById('canvas');
    paper.setup(canvas);

    var path = new paper.Path({
        segments: [[10, 10], [40, 40], [543, 23]],
        selected: false,
        fillColor: 'red'
    });

    paper.view.draw();

    var toolPath;
    var tool = new paper.Tool();
    tool.distanceThreshold = 10;
    tool.onMouseDown = function(event) {
        toolPath = new paper.Path();
        toolPath.add(event.point);
        toolPath.strokeColor = 'black';
    };
    tool.onMouseDrag = function(event) {
        toolPath.add(event.point);
    }
};
