/* GLOBAL */
function print(x){
    console.log(x);
}
function forEach(array,action){
    for(var i=0;i<array.length;i++)
	action(array[i]);
}
function reduce(fn,base,array){
    forEach(array,function(x){
		base=fn(base,x);
		console.log(base);
	    });
    return base;
}
function add(a,b){
    return a+b;
}
// _count_: similar to Reduce in that it takes in an array & a function to work on the array elements
function count(test,array){
    var total=0;
    forEach(array,function(x){
		if(test(x))total++;
	    });
    return total;
}
function map(fn,arr){
    var result=[];
    forEach(arr,function(x){
		result.push(fn(x));
    });
	    return result;
}
function myCountZeroes(array){
    function testIfZero(total,x){
	return total+(x===0?1:0);
    }
    return reduce(testIfZero,0,array);
}
function countZeroes2(arr){
    function testZero(x){
	return x===0;
    }
    return count(testZero,arr);
}
function sum(numbers){
    /* OLD IMPLEMENTATION:
    var total=0;
    forEach(numbers,function(number){
		total+=number;
	    });
    return total;*/
    return reduce(add,0,numbers);
}
/* EJS: RECLUSE */
/* V1 */
function isCharAt(index,symbol,paragraph){
    if(paragraph.charAt(index)===symbol) return true;
    else return false;
}
function hWhat(p){
    var count=0,symbol="%";
    for(var i=0;i<6;i++){
	if(isCharAt(i,symbol,p))
	    count+=1;
	else
	    break;
    }
    return count>0?count:-1;
}
function whichHeader(p){
    var header=0;
    while(p.charAt(header)==="%")
	header++;
    return header>0?header:-1;
}
function wrapTags(header,p){
    if(header!==-1)
	return "<h"+header+">"+p.substr(header)+"</h"+header+">";
    else
	return "<p>"+p+"</p>";
}
/* V2*/
function sortParagraphs(){
    function headerOrParagraph(text){
	var header=0;
	while(text.charAt(header)==="%")
	    header++;
	return header?{type:"h"+header,content:text.slice(header)}:{type:"paragraph",content:text};
    }
    var hOrPObjs=map(headerOrParagraph,pArr);
    for(var i=0;i<hOrPObjs.length;i++){
	var hOrPObj=hOrPObjs[i];
	if(hOrPObj.type!="paragraph")
	    contentArr.push(hOrPObj);
	else
	    handleParagraph(hOrPObj);
    }
}
function handleParagraph(pObj){
    var pContent=pObj.content;
    while(pContent.length>0){
//	print("pContent left: ["+pContent+"]");
	if(pContent.charAt(0)==="*"){
	    var end=searchNext("*",1,pContent);
	    var extract=pContent.slice(1,end);
//	    print("This text is emphasized and pushed into the array: ["+ extract+"]");
	    contentArr.push({type:"emphasis",content:extract});
//	    print("The content array now contains "+ contentArr);	    
	    pContent=pContent.slice(end+1);
	}
	else if(pContent.charAt(0)==="{"){
	    var end=searchNext("}",1,pContent);
	    var extract=pContent.slice(1,end);
//	    print("This text is footnote and pushed into the array: ["+extract+"]");
	    contentArr.push({type:"footnote",content:extract});
//	    print("The content array now contains "+ contentArr);	    
	    pContent=pContent.slice(end+1);
	}
	else{
	    var end=searchStarOrBrace(0,pContent);
	    var extract=pContent.slice(0,end);
//	    print("This text is normal content and pushed into the array: ["+extract+"]");
	    contentArr.push({type:"normal",content:extract});
//	    print("The content array now contains "+ contentArr);	    
	    pContent=pContent.slice(end);
	}
    }
}
function wrapHeader(obj){
    return "<h"+obj.type+">"+obj.content+"</h"+obj.type+">";
}
function handleHeader(headerObj){
    contentArr.push(headerObj);
    print("The content array now contains "+ contentArr);
}
function wrapEm(obj){
    return "<em>"+empObj.content+"</em>";
}
function searchNext(symbol,from,content){
    var end=content.indexOf(symbol,from);
    if(end===-1) throw new Error("Can't find concluding "+symbol+".");
    else return end;
}
function searchStarOrBrace(from,content){
    var star=content.indexOf("*",from);
    var brace=content.indexOf("{",from);
    if(star===-1&&brace===-1)
	return content.length;
    else if(star===-1)
    return brace;
    else if(brace===-1)
    return star;
    else if(star<brace)
    return star;
    else
	return brace;
}
function handleFootnote(footnoteObj){
    print("Do nothing about foot notes for now.");
}
function tag(name,content,attributes){
    return {
	name:name,
	content:content,
	attributes:attributes
    };   
}
function link(url,text,target){
    return tag("a",[text],{href:url,target:target});
}
function htmlDoc(title,bodyContent){
    return tag("html",[tag("head",tag("title",[title])),tag("body",bodyContent)]);
}
function escapeHTML(text){
    var replacementArr=[[/&/g,"&amp;"],[/"/g,"&quot;"],[/</g,"&lt;"],[/>/g,"&gt;"]];
    forEach(replacementArr,function(pair){
		text=text.replace(pair[0],pair[1]);
	    });
    return text;
}
function renderAttributes(attributes){
    if(attributes===null) return "";
    var results=[];
    for(attribute in attributes){
	results.push(" "+attribute+"=\""+escapeHTML(attributes[attribute])+"\"");
    }
    return results.join(" ");
}
/* EVENTS */
function registerEventHandler(node,event,handler){
    if(typeof node.addEventListener==="function")
	node.addEventListener(event,handler,false);
    else
	node.attachEvent("on"+event,handler);
}
/* PSEUDO JQUERY */
function grab(id){
    return document.getElementById(id);
}
/* HTML5 */
function supportsGeolocation(){
    return 'geolocation' in navigator;
}
function supportsCanvas(){
    return !!document.createElement('canvas').getContext;
}
function supportsVideo(){
    return !!document.createElement('video').canPlayType;
}
function supportsNewInput(){
    var i=document.createElement('input');
    i.setAttribute('type','color');
    return i.type !=='text';
    //if doesn't support, type remains text
}
function supportsCanvasText(){
    if(!supportsCanvas()){return false;}
    var dummyCanvas=document.createElement('canvas');
    var context= dummyCanvas.getContext('2d');
    return typeof context.fillText=='function';
}
function supportsStorage(){
    try{
	return typeof window.localStorage==='object';
    } catch (x) {
	return false;
    }
}
function supportsWebworkers(){
    return !!window.Worker;
}
function supportsOffline(){
    return !!window.applicationCache;
}
function supportsMicrodata(){
    return !!document.getItems;
}
function supportsAlert(){
    return !!window.alert;
}
/* CANVAS */
function ieSupportsCanvas(){
    if(typeof window.CanvasRenderingContext2D == 'undefined' && typeof G_vmlCanvasManager == 'undefined')
	return false;
    else
	return true;
}
function drawGraph(){
    var canvas=document.getElementById("c");
    var c=canvas.getContext("2d");
    var origin=.5;
    c.strokeStyle="#ccc";
    for(var x=0.5;x<500;x+=10){
	c.moveTo(x,0)
	c.lineTo(x,375);
    }
    for(var y=.5;y<375;y+=10){
	c.moveTo(0,y);
	c.lineTo(500,y);
    }
    c.stroke();
    //new path
    c.beginPath();
    //x coord
    c.moveTo(0,40);
    c.lineTo(240,40);
    c.moveTo(260,40);
    c.lineTo(500,40);
    c.moveTo(495,35);
    c.lineTo(500,40);
    c.lineTo(495,45);
    //y coord
    c.moveTo(40,0);
    c.lineTo(40,240);
    c.moveTo(40,260);
    c.lineTo(40,375);
    c.moveTo(45,370);
    c.lineTo(40,375);
    c.lineTo(35,370);
    c.strokeStyle="#000";
    c.stroke();
    //triangle
    c.beginPath();
    c.moveTo(40,40);
    c.lineTo(250,375);
    c.lineTo(450,40);
    c.strokeStyle="#297352";
    c.stroke();
    // font time
    c.font="bold 10px Verdana";
    c.textBaseline="top";
    c.fillText("x",248,35);
    c.fillText("y",35,245);
    c.fillText("(0,0)",8,25);
    c.textAlign="right";
    c.fillText("(500,375)",490,355);
    c.fillRect(0,0,3,3);
    c.fillRect(489,369,3,3);
    //triangle caption
    c.font="normal 100% sans-serif";
    c.textBaseline="top";
    c.textAlign="center";
    c.fillText("Is this an isosceles triangle?",250,100);
    c.fillText("(Yes,No)",250,130);
    //add gradient
    var cGradient=c.createLinearGradient(0,0,0,375);
    cGradient.addColorStop(0,"#ccc");
    cGradient.addColorStop(1,"white");
    c.fillStyle=cGradient;
    c.fillRect(40,40,200,200);
}
function initCanvas(id){
    var c=grab(id);
    return c.getContext("2d");
}
function drawGradient(){
    var c=initCanvas("g");
    var gradientStyle=c.createLinearGradient(0,0,300,0);
    gradientStyle.addColorStop(0,"red");
    gradientStyle.addColorStop(1,"black");
    c.fillStyle=gradientStyle;
    c.fillRect(0,0,300,225);
}
function gridify(ctx,strokeStyle,spacing){
    ctx.strokeStyle=strokeStyle;
    for(var x=0.5;x<ctx.canvas.width;x+=spacing){
	ctx.moveTo(x,0);
	ctx.lineTo(x,ctx.canvas.height);
	ctx.stroke();
    }
    for(var y=0.5;y<ctx.canvas.width;y+=spacing){
	ctx.moveTo(0,y);
	ctx.lineTo(ctx.canvas.width,y);
	ctx.stroke();
    }
}