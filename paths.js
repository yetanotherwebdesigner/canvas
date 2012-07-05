function drawCheckbox(ctx,element,x,y,paint){
    ctx.save();
    ctx.font="10px sans-serif";
    ctx.textAlign="left";
    ctx.textBaseline="middle";
    var metrics=ctx.measureText(element.labels[0].textContent);
    if(paint){
	ctx.beginPath();
	ctx.strokeStyle="black";
	ctx.rect(x-5,y-5,10,10);
	ctx.stroke();
	if(element.checked){
	    ctx.fillStyle="black";
	    ctx.fill();
	}
	ctx.fillText(element.labels[0].textContent,x+5,y);
    }
    ctx.beginPath();
    ctx.rect(x-7,y-7,12+metrics.width+2,14);
    if(paint&&ctx.drawCustomFocusRing(element)){
	ctx.strokeStyle="silver";
	ctx.stroke();
    }
    ctx.restore();
}
function redraw(){
    var ctx=document.getElementsByTagName("canvas")[0].getContext("2d");
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    drawCheckbox(ctx,document.getElementById("showA"),20,40,true);
    drawCheckbox(ctx,document.getElementById("showB"),20,60,true);
    drawBase();
    if(document.getElementById("showA").checked)
	drawAs();
    if(document.getElementById("showB").checked)
	drawBs();
}
function processClick(evt){
    var ctx=document.getElementsByTagName("canvas")[0].getContext("2d");
    var x=evt.clientX;
    var y=evt.clientY;
    var node=evt.target;
    while(node){
	x-=node.offsetLeft-node.scrollLeft;
	y-=node.offsetTop-node.scrollTop;
	node=node.offsetParent;
    }
    drawCheckbox(ctx,document.getElementById("showA"),20,40,false);
    if(ctx.isPointInPath(x,y))
	document.getElementById("showA").checked=!(document.getElementById("showA").checked);
    drawCheckbox(ctx,document.getElmentById("showB"),20,60,false);
    if(ctx.isPointInPath(x.y))
	document.getElementById("showB").checked=!(document.getElementById("showB").checked);
    redraw();
}
document.getElementsByTagName("canvas")[0].addEventListener("focus",redraw,true);
document.getElementsByTagName("canvas")[0].addEventListener("blur",redraw,true);
document.getElementsByTagName("canvas")[0].addEventListener("change",redraw,true);
document.getElementsByTagName("canvas")[0].addEventListener("click",processClick,false);
redraw();
