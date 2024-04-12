class Point{
    x=0;
    y=0;

    constructor(rx,ry){
        this.x=rx;
        this.y=ry;
    }
}

class Vector{
    i=0;
    j=0;

    constructor(ri,rj){
        this.i=ri;
        this.j=rj;
    }
}

class Coordinates{
    x=0;
    y=0;
    width=0;
    height=0;
    angle=0;
    points = [new Point(0,0),new Point(0,0),new Point(0,0),new Point(0,0)];

    constructor(rx,ry,rwidth,rheight,rangle){
        this.x = rx;
        this.y = ry;
        this.width = rwidth;
        this.height = rheight;
        this.angle = rangle;

        while(this.angle < 0){
            this.angle += 360;
        }
        while (this.angle > 360){
            this.angle -= 360;
        }
    }
}

class Line{
    initial=0;
    length=0;

    constructor(rinitial,rlength){
        if(rlength<0){ //If the length is backwards
            this.initial = rinitial + rlength; //Move the initial value back
            this.length = -rlength; //Use the correct length
        }
        else{ //Otherwise use the inputted values
            this.initial = rinitial;
            this.length = rlength;
        }
    }
}

function DrawCoords(elementText, coordinates){
    const element = document.querySelector(elementText);
    element.style.left = coordinates.x+"px";
    element.style.top = coordinates.y+"px";
    element.style.width = coordinates.width+"px";
    element.style.height = coordinates.height+"px";
    
    element.style.rotate = coordinates.angle+"deg";
}

function DoLinesMeet(line1, line2) {
    return line1.initial <= line2.initial + line2.length && line1.initial + line1.length >= line2.initial;
}

function LineIntersectsCoordinate(line, coordinate){
    return (coordinate-line.minimum)/(line.length);
}

function ObtainRange(values){
    var lowerValue = values[0];
    var higherValue = values[0];
    for(var k = 1; k < values.length; k++){
        if(values[k] < lowerValue){
            lowerValue = values[k];
        }
        else if(values[k] > higherValue){
            higherValue = values[k];
        }
    }
    return new Line(lowerValue, higherValue - lowerValue);
}

function ObtainHorizontalRange(points){
    return ObtainRange([points[0].x,points[1].x,points[2].x,points[3].x])
}

function ObtainVerticalRange(points){
    return ObtainRange([points[0].y,points[1].y,points[2].y,points[3].y])
}

function ObtainMidpoint(coordinates){
    return new Point(coordinates.x + coordinates.width / 2, coordinates.y + coordinates.height / 2)
}

function ObtainPoints(coordinates){
    var midpoint = new Point(coordinates.x + coordinates.width/2, coordinates.y + coordinates.height/2);
    return [
        RotatePointAboutPoint(midpoint, new Point(coordinates.x, coordinates.y), coordinates.angle),
        RotatePointAboutPoint(midpoint, new Point(coordinates.x + coordinates.width, coordinates.y), coordinates.angle),
        RotatePointAboutPoint(midpoint, new Point(coordinates.x, coordinates.y + coordinates.height), coordinates.angle),
        RotatePointAboutPoint(midpoint, new Point(coordinates.x + coordinates.width,coordinates.y + coordinates.height), coordinates.angle)
    ];
}

function CompareHorizontalAndVerticalOfTwoObjects(object1, object2){
    object1Points = ObtainPoints(object1);
    object2Points = ObtainPoints(object2);
    var horizontal = DoLinesMeet(ObtainHorizontalRange(object1Points), ObtainHorizontalRange(object2Points));
    var vertical = DoLinesMeet(ObtainVerticalRange(object1Points), ObtainVerticalRange(object2Points));
    return horizontal && vertical;
}

function CompareCollisionOfTwoObjects(object1,object2){
    var initialObjects = CompareHorizontalAndVerticalOfTwoObjects(object1, object2);
    var rotatedObjects = CompareHorizontalAndVerticalOfTwoObjects(RotateCoordinatesAboutPoint(ObtainMidpoint(object2),object1,-object2.angle), new Coordinates(object2.x,object2.y,object2.width,object2.height,0))
    return initialObjects && rotatedObjects;
}

function RotatePointAboutPoint(midpoint,point,angle){
    var radians = (Math.PI / 180) * angle;
    var cos = Math.cos(radians);
    var sin = Math.sin(radians);
    var x = point.x - midpoint.x;
    var y = point.y - midpoint.y;
    return new Point(
        x * cos - y * sin + midpoint.x, 
        x * sin + y * cos + midpoint.y);
}

function RotateCoordinatesAboutPoint(midpoint,coordinates,angle){
    var topLeft = RotatePointAboutPoint(midpoint,new Point(coordinates.x,coordinates.y),angle);
    var bottomLeft = RotatePointAboutPoint(midpoint,new Point(coordinates.x, coordinates.y + coordinates.height), angle);
    var bottomRight = RotatePointAboutPoint(midpoint,new Point(coordinates.x + coordinates.width, coordinates.y + coordinates.height), angle);
    var newAngle = Math.atan(
        (topLeft.x - bottomLeft.x)/
        (topLeft.y - bottomLeft.y) 
    ) * 180 / Math.PI;
    var newMidpoint = new Point(
        topLeft.x + (bottomRight.x - topLeft.x)/2,
        topLeft.y + (bottomRight.y - topLeft.y)/2
    )
    return new Coordinates(newMidpoint.x - coordinates.width / 2, newMidpoint.y - coordinates.height / 2, coordinates.width, coordinates.height, -newAngle)
}

var attack = new Coordinates(246, 282, 60, 150, 15);
var player = new Coordinates(195, 225, 60, 60, 0);

window.addEventListener("keydown", function (event) {
    if(event.key=="w"){
        player.y -= 5;
    }
    if(event.key=="a"){
        player.x -= 5;
    }
    if(event.key=="s"){
        player.y += 5;
    }
    if(event.key=="d"){
        player.x += 5;
    }
    if(event.key=="e"){
        attack.angle += 5;
    }
    if(event.key=="q"){
        attack.angle -= 5;
    }
   if (event.key == "z" || event.key == "Enter"){
   }
   start();
}, true);

function start(){
    document.getElementById("maintextbox").innerHTML = CompareCollisionOfTwoObjects(player, attack)
    DrawCoords(".box1",attack);
    DrawCoords(".box2",player);
    var rotatedPlayer = RotateCoordinatesAboutPoint(ObtainMidpoint(attack),player,-attack.angle);
    var rotatedAttack = new Coordinates(300 + attack.x, attack.y, attack.width, attack.height, 0)
    rotatedPlayer.x = rotatedPlayer.x + 300;

    DrawCoords(".box3", rotatedPlayer);
    DrawCoords(".box4", rotatedAttack);
}
