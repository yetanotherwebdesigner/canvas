(function(){
  var stage,
     myCanvas=document.getElementById("stageCanvas");
     this.init=function(){
	 stage=new Stage(myCanvas);
	 var textfield=new Text("Hello World!","bold 36px Courier","#fff");
	 textfield.x=400;
	 textfield.y=300;
	 textfield.textAlign="center";

	 stage.addChild(textfield);
	 stage.update();
     };
 })();