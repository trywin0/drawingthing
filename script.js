const delayslider = document.querySelector("#delayslider");
const delayElement = document.querySelector("#delay");

const widthslider = document.querySelector("#widthslider");
const widthElement = document.querySelector("#width");

const smoothslider = document.querySelector("#smoothslider");
const smoothElement = document.querySelector("#smooth");

const detailslider = document.querySelector("#detailslider");
const detailElement = document.querySelector("#detail");

const cursor = document.querySelector(".cursor")

const colorpicker = document.querySelector("#colorpicker");

function downloadCanvas(){
    document.getElementById("downloader").download = "image.png";
    document.getElementById("downloader").href = document.getElementById("canvas").toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
}

let settings = {
    width: 3,
    delayValue: 10
}

delayslider.oninput = function() {
    settings.delayValue = this.value
    delayElement.innerText = this.value;
  }
  detailslider.oninput = function() {
    settings.delayValue = this.value
    detailElement.innerText = this.value;
  }
  smoothslider.oninput = function() {
    settings.delayValue = this.value
    smoothElement.innerText = this.value;
  }
  widthslider.oninput = function() {
    settings.width = this.value
    widthElement.innerText = this.value;
  }
const canvas = document.querySelector("canvas")
canvas.width = window.innerWidth;
canvas.height=window.innerHeight;
window.onresize = ()=>{
    canvas.width = window.innerWidth;
    canvas.height=window.innerHeight;

}
const ctx = canvas.getContext("2d")
/*
let drawing = false;
canvas.onmousedown = ()=>{drawing = true;
    ctx.moveTo(settings.x,settings.y)
};
canvas.onmouseup = ()=>{
    drawing = false;
    settings.previousX = NaN;
    settings.previousY = NaN;
    console.log(settings)

};

canvas.addEventListener("mousemove", ev=>{
    const canvasPosition = canvas.getBoundingClientRect()
    let {x,y} = ev
    settings.previousX = settings.x
    settings.previousY = settings.y

    settings.x = x;
    settings.y = y;
})

function update(){
    if(drawing){
        ctx.save()
        ctx.lineWidth = settings.width
        ctx.strokeStyle = colorpicker.value

        const x = settings.x
        const y = settings.y

        ctx.lineTo(x,y)
        ctx.stroke()
        ctx.restore()
    }
    setTimeout(update, settings.delayValue)
}
update()
*/
const pickr = Pickr.create({
    el: '.color-picker',
    theme: 'classic', // or 'monolith', or 'nano'

    swatches: [
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 0.95)',
        'rgba(156, 39, 176, 0.9)',
        'rgba(103, 58, 183, 0.85)',
        'rgba(63, 81, 181, 0.8)',
        'rgba(33, 150, 243, 0.75)',
        'rgba(3, 169, 244, 0.7)',
        'rgba(0, 188, 212, 0.7)',
        'rgba(0, 150, 136, 0.75)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(139, 195, 74, 0.85)',
        'rgba(205, 220, 57, 0.9)',
        'rgba(255, 235, 59, 0.95)',
        'rgba(255, 193, 7, 1)'
    ],

    components: {

        // Main components
        preview: true,
        opacity: true,
        hue: true,

        // Input / output Options
        interaction: {
            hex: true,
            rgba: true,
            hsla: true,
            hsva: true,
            cmyk: true,
            input: true,
            clear: true,
            save: true
        }
    }
});
function scrollIsUp(event) {
    if (event.wheelDelta) {
      return event.wheelDelta > 0;
    }
    return event.deltaY < 0;
  }
window.onwheel = ev=>{
    const isUp = scrollIsUp(ev);
    if(isUp){
        settings.width+=2;
        if(settings.width>100){
            settings.width=100
        }
    }else{
        settings.width-=2;
        if(settings.width<1){
            settings.width=1
        }

    }
    widthslider.value = settings.width
    widthElement.innerText = settings.width
    cursor.style.width = settings.width+"px"
    cursor.style.height = settings.width+"px"
}

document.onmousemove = ev=>{
    cursor.style.top = ev.clientY+"px";
    cursor.style.left = ev.clientX+"px";
    cursor.style.backgroundColor = pickr._color.toRGBA()
    cursor.style.width = settings.width+"px"
    cursor.style.height = settings.width+"px"
}

let savedCanvases = []
savedCanvases.push(canvas.toDataURL())

function KeyPress(e) {
    var evtobj = e
    if (evtobj.keyCode == 90 && evtobj.ctrlKey){
    let last = savedCanvases[savedCanvases.length-2]
    if(!last) return;
            savedCanvases.pop()

    const img = document.createElement("img")
    img.src = last
    img.style.display="none"
    img.onload = ()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img, 0, 0)
        img.remove()
    }

}
}

document.onkeydown = KeyPress;
// mouse stuff


var mouse = {
    x:0,
    y:0,
    buttonLastRaw:0, // user modified value 
    buttonRaw:0,
    buttons:[1,2,4,6,5,3], // masks for setting and clearing button raw bits;
};
function mouseMove(event){
    mouse.x = event.offsetX;  mouse.y = event.offsetY; 
    if(mouse.x === undefined){ mouse.x = event.clientX;  mouse.y = event.clientY;}    
    if(event.type === "mousedown"){ mouse.buttonRaw |= mouse.buttons[event.which-1];
    }else if(event.type === "mouseup"){
        mouse.buttonRaw &= mouse.buttons[event.which+2];
    }else if(event.type === "mouseout"){ mouse.buttonRaw = 0; mouse.over = false;
    }else if(event.type === "mouseover"){ mouse.over = true; }
    event.preventDefault();
}
canvas.addEventListener('mousemove',mouseMove);
canvas.addEventListener('mousedown',mouseMove);
canvas.addEventListener('mouseup'  ,mouseMove); 
canvas.addEventListener('mouseout'  ,mouseMove); 
canvas.addEventListener('mouseover'  ,mouseMove); 
canvas.addEventListener("contextmenu", function(e){ e.preventDefault();}, false);


var simplifyLineRDP = function(points, length) {
    var simplify = function(start, end) { // recursize simplifies points from start to end
        var maxDist, index, i, xx , yy, dx, dy, ddx, ddy, p1, p2, p, t, dist, dist1;
        p1 = points[start];
        p2 = points[end];   
        xx = p1[0];
        yy = p1[1];
        ddx = p2[0] - xx;
        ddy = p2[1] - yy;
        dist1 = (ddx * ddx + ddy * ddy);
        maxDist = length;
        for (var i = start + 1; i < end; i++) {
            p = points[i];
            if (ddx !== 0 || ddy !== 0) {
                t = ((p[0] - xx) * ddx + (p[1] - yy) * ddy) / dist1;
                if (t > 1) {
                    dx = p[0] - p2[0];
                    dy = p[1] - p2[1];
                } else 
                if (t > 0) {
                    dx = p[0] - (xx + ddx * t);
                    dy = p[1] - (yy + ddy * t);
                } else {
                    dx = p[0] - xx;
                    dy = p[1] - yy;
                }
            }else{
                dx = p[0] - xx;
                dy = p[1] - yy;
            }
            dist = dx * dx + dy * dy 
            if (dist > maxDist) {
                index = i;
                maxDist = dist;
            }
        }

        if (maxDist > length) { // continue simplification while maxDist > length
            if (index - start > 1){
                simplify(start, index);
            }
            newLine.push(points[index]);
            if (end - index > 1){
                simplify(index, end);
            }
        }
    }    
    var end = points.length - 1;
    var newLine = [points[0]];
    simplify(0, end);
    newLine.push(points[end]);
    return newLine;
}



// This is my own smoothing method 
// It creates a set of bezier control points either 2nd order or third order 
// bezier curves.
// points: list of points
// cornerThres: when to smooth corners and represents the angle between to lines. 
//     When the angle is smaller than the cornerThres then smooth.
// match: if true then the control points will be balanced.
// Function will make a copy of the points

var smoothLine = function(points,cornerThres,match){  // adds bezier control points at points if lines have angle less than thres
    var  p1, p2, p3, dist1, dist2, x, y, endP, len, angle, i, newPoints, aLen, closed, bal, cont1, nx1, nx2, ny1, ny2, np;
    function dot(x, y, xx, yy) {  // get do product
        // dist1,dist2,nx1,nx2,ny1,ny2 are the length and  normals and used outside function
        // normalise both vectors
        dist1 = Math.sqrt(x * x + y * y); // get length
        if (dist1  > 0) {  // normalise
            nx1 = x / dist1 ;
            ny1 = y / dist1 ;
        }else {
            nx1 = 1;  // need to have something so this will do as good as anything
            ny1 = 0;
        }
        dist2  = Math.sqrt(xx * xx + yy * yy);
        if (dist2  > 0) {
            nx2 = xx / dist2;
            ny2 = yy / dist2;
        }else {
            nx2 = 1;
            ny2 = 0;
        }
       return Math.acos(nx1 * nx2 + ny1 * ny2 ); // dot product
    }
    newPoints = []; // array for new points
    aLen = points.length;
    if(aLen <= 2){  // nothing to if line too short
        for(i = 0; i < aLen; i ++){  // ensure that the points are copied          
            newPoints.push([points[i][0],points[i][1]]);
        }
        return newPoints;
    }
    p1 = points[0];
    endP =points[aLen-1];
    i = 0;  // start from second poitn if line not closed
    closed = false;
    len = Math.hypot(p1[0]- endP[0], p1[1]-endP[1]);
    if(len < Math.SQRT2){  // end points are the same. Join them in coordinate space
        endP =  p1;
        i = 0;             // start from first point if line closed
        p1 = points[aLen-2];
        closed = true;
    }       
    newPoints.push([points[i][0],points[i][1]])
    for(; i < aLen-1; i++){
        p2 = points[i];
        p3 = points[i + 1];
        angle = Math.abs(dot(p2[0] - p1[0], p2[1] - p1[1], p3[0] - p2[0], p3[1] - p2[1]));
        if(dist1 !== 0){  // dist1 and dist2 come from dot function
            if( angle < cornerThres*3.14){ // bend it if angle between lines is small
                  if(match){
                      dist1 = Math.min(dist1,dist2);
                      dist2 = dist1;
                  }
                  // use the two normalized vectors along the lines to create the tangent vector
                  x = (nx1 + nx2) / 2;  
                  y = (ny1 + ny2) / 2;
                  len = Math.sqrt(x * x + y * y);  // normalise the tangent
                  if(len === 0){
                      newPoints.push([p2[0],p2[1]]);                                  
                  }else{
                      x /= len;
                      y /= len;
                      if(newPoints.length > 0){
                          var np = newPoints[newPoints.length-1];
                          np.push(p2[0]-x*dist1*0.25);
                          np.push(p2[1]-y*dist1*0.25);
                      }
                      newPoints.push([  // create the new point with the new bezier control points.
                            p2[0],
                            p2[1],
                            p2[0]+x*dist2*0.25,
                            p2[1]+y*dist2*0.25
                      ]);
                  }
            }else{
                newPoints.push([p2[0],p2[1]]);            
            }
        }
        p1 = p2;
    }  
    if(closed){ // if closed then copy first point to last.
        p1 = [];
        for(i = 0; i < newPoints[0].length; i++){
            p1.push(newPoints[0][i]);
        }
        newPoints.push(p1);
    }else{
        newPoints.push([points[points.length-1][0],points[points.length-1][1]]);      
    }
    return newPoints;    
}

// creates a drawable image
function createImage(w,h){
    var image = document.createElement("canvas");
    image.width = w;
    image.height =h; 
    image.ctx = image.getContext("2d"); 
    return image;
}  

// draws the smoothed line with bezier control points.
var drawSmoothedLine = function(line){
    var i,p;
    ctx.beginPath()
    ctx.strokeStyle = pickr._color.toRGBA()
    ctx.moveTo(line[0][0],line[0][1])
    for(i = 0; i < line.length-1; i++){
       p = line[i];
       p1 = line[i+1]
       if(p.length === 2){ // linear 
            ctx.lineTo(p[0],p[1])
       }else
       if(p.length === 4){ // bezier 2nd order
           ctx.quadraticCurveTo(p[2],p[3],p1[0],p1[1]);
       }else{              // bezier 3rd order
           ctx.bezierCurveTo(p[2],p[3],p[4],p[5],p1[0],p1[1]);
       }
    }
    if(p.length === 2){
        ctx.lineTo(p1[0],p1[1])
    }
    ctx.stroke();
    savedCanvases.push(canvas.toDataURL())
}

// smoothing settings
var liveSmooth;
var lineSmooth = {};

lineSmooth.lengthMin = parseInt(detailslider.value);  // square of the pixel length
lineSmooth.angle = parseInt(smoothslider.value);      // angle threshold
lineSmooth.match = false;  // not working.
// back buffer to save the canvas allowing the new line to be erased
var backBuffer = createImage(canvas.width,canvas.height);
var currentLine = [];
mouse.lastButtonRaw = 0;  // add mouse last incase not there
ctx.lineWidth = settings.width;
ctx.lineJoin = "round";
ctx.lineCap = "round";
ctx.strokeStyle = pickr._color.toRGBA()
ctx.clearRect(0,0,canvas.width,canvas.height);
var drawing = false;  // if drawing
var input = false;  // if menu input
var smoothIt = false;  // flag to allow feedback that smoothing is happening as it takes some time.
function draw(){
    // if not drawing test for menu interaction and draw the menus
    if(!drawing){                  
        if(mouse.buttonRaw === 0 && input){
            input = false;
            mouse.lastButtonRaw = 0;
        }
    

    }else{
    }
    if(!input){
         ctx.lineWidth = settings.width;
        if(mouse.buttonRaw === 4 && mouse.lastButtonRaw === 0){
            currentLine = [];
            drawing  = true;

            backBuffer.ctx.clearRect(0,0,canvas.width,canvas.height);
            backBuffer.ctx.drawImage(canvas,0,0);
            currentLine.push([mouse.x,mouse.y])
        }else
        if(mouse.buttonRaw === 4){

        }else
        if(mouse.buttonRaw === 0 && mouse.lastButtonRaw === 4){
            smoothIt = true;
        }else
        if(smoothIt){
            smoothIt = false;
            
            var newLine = smoothLine(
                simplifyLineRDP(
                    currentLine,
                    parseInt(detailslider.value)
                ),
                parseInt(smoothslider.value),
                lineSmooth.match
            );
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(backBuffer,0,0);
            drawSmoothedLine(newLine);
            drawing  = false;
            
        }


        if(mouse.buttonRaw === 1 && mouse.lastButtonRaw === 0){
            currentLine = [];
            drawing  = true;

            backBuffer.ctx.clearRect(0,0,canvas.width,canvas.height);
            backBuffer.ctx.drawImage(canvas,0,0);
            currentLine.push([mouse.x,mouse.y])
        }else
        if(mouse.buttonRaw === 1){
            var lp = currentLine[currentLine.length-1]; // get last point
            // dont record point if no movement
            if(mouse.x !== lp[0] || mouse.y !== lp[1] ){
                currentLine.push([mouse.x,mouse.y]);
                ctx.beginPath();
                ctx.strokeStyle = pickr._color.toRGBA()
                ctx.moveTo(lp[0],lp[1])
                ctx.lineTo(mouse.x,mouse.y);
                ctx.stroke();
            }
        }else
        if(mouse.buttonRaw === 0 && mouse.lastButtonRaw === 1){
            smoothIt = true;
        }else
        if(smoothIt){
            smoothIt = false;
            
            var newLine = smoothLine(
                simplifyLineRDP(
                    currentLine,
                    parseInt(detailslider.value)
                ),
                parseInt(smoothslider.value),
                lineSmooth.match
            );
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(backBuffer,0,0);
            drawSmoothedLine(newLine);
            drawing  = false;
            
        }
    }
    // middle button clear
    if(mouse.buttonRaw === 2){
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }
    mouse.lastButtonRaw = mouse.buttonRaw;

    setTimeout(()=>{
        requestAnimationFrame(draw);
    },settings.delayValue)


}

draw();
