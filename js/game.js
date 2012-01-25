/*********************
 * GAME class
 *
 */
function game(addPointer) {
	// Context
	this.ctx = undefined;

	// Objects
	this.objects = [];

	// Events
	this.eventQueue = [];

	this.intLoop = null;
}

/*
 * Add objects to engine
 */
game.prototype.addObject = function(object) {
	this.objects.push(object);
}


/*
 * Draw objects on canvas
 */
game.prototype.drawObject = function(object) {
	this.ctx.fillRect(object.posX, object.posY, object.width, object.height)
}
/*
 * Delete objects on canvas
 */
game.prototype.deleteObject = function(object) {
	this.ctx.clearRect(object.posX, object.posY, object.width, object.height);
}
/*
 * Init game functionalitys
 */
game.prototype.init = function() {
	var canvas = document.getElementById("canvas-layer");
	this.ctx = canvas.getContext("2d");

	for(var i = 0; i < this.objects.length; i++) {
		this.objects[i].circuit = this.circuit;
	}

	this.startLoop();

}

game.prototype.startLoop = function() {
	var gameInstance = this;

	function loop() {
		// delete old objects
		for(var i = 0; i < gameInstance.objects.length; i++) {
			gameInstance.deleteObject(gameInstance.objects[i]);
		}

		// update states
		gameInstance.update();

		// draw new objects
		for(var i = 0; i < gameInstance.objects.length; i++) {
			gameInstance.drawObject(gameInstance.objects[i]);
		}
	}

	this.stop();
	this.intLoop = setInterval(loop, 30);
}

/*
 * Stop game
 */
game.prototype.stop = function() {
	clearInterval(this.intLoop);
}


/*
 * Update all components
 */
game.prototype.update = function() {

	for(var i = 0; i < this.objects.length; i++) {
		
		var actual = this.objects[i];
		
		for(var j = 0; j < this.objects.length; j++){
			if( i != j && this.objects[j].intersectable ){
				var comparado = this.objects[j];
				var thereIsACrash = this.intersection(actual, comparado);
				if( thereIsACrash > 0 ){
					this.pushEvent(new event("crash", {"id": this.objects[i].id ,"type": thereIsACrash} ));
					this.pushEvent(new event("crash", {"id": this.objects[j].id, "type": thereIsACrash} ));
				}
			}
		}
		
		this.objects[i].update();
	}
}


/*
 * Notify event to all components
 */
game.prototype.pushEvent = function(event) {
	this.eventQueue.push(event);
}

game.prototype.popEvent = function(event) {
	this.eventQueue.splice(this.eventQueue.indexOf(event), 1);
}


/*
 * interseccion 
 */
game.prototype.intersection = function(object1, object2){
	var response = 0;
	
	// Upper left corner
	if( 
		( object1.posX < (object2.posX+object2.width) ) && 
		(object1.posY < (object2.posY+object2.height)) &&
		(object1.posX >= object2.posX) && 
		(object1.posY >= object2.posY) 
			){
		var sideSum4 = ((object2.posX+object2.width)-object1.posX);
		var sideSum1 = ((object2.posY+object2.height)-object1.posY);
		if( sideSum1 > sideSum4){
			response = 1;
		}else{
			response = 4;
		}
	}
	
	// Down left corner
	if( 
		( object1.posX < (object2.posX+object2.width) ) && 
		(object1.posX >= object2.posX) && 
		((object1.posY+object1.height) < (object2.posY+object2.height)) &&
		((object1.posY+object1.height) >= object2.posY)
			){
		var sideSum2 = ((object2.posX+object2.width)-object1.posX);
		var sideSum1 = ((object1.posY+object1.height)-object2.posY);
		if( sideSum1 > sideSum2){
			response = 1;
		}else{
			response = 2;
		}
	}
	
	// Down right corner
	if( 
		((object1.posX+object1.width) < (object2.posX+object2.width) ) && 
		((object1.posX+object1.width) > object2.posX) && 
		((object1.posY+object1.height) < (object2.posY+object2.height)) &&
		((object1.posY+object1.height) >= object2.posY)
			){
		var sideSum3 = ((object2.posX+object2.width)-object1.posX);
		var sideSum2 = ((object2.posY+object2.height)-object1.posY);
		if( sideSum2 > sideSum3){
			response = 2;
		}else{
			response = 3;
		}
	}
	
	// Upper right corner
	if( 
		((object1.posX+object1.width) <= (object2.posX+object2.width) ) && 
		((object1.posX+object1.width) >= object2.posX) && 
		((object1.posY) <= (object2.posY+object2.height)) &&
		((object1.posY) >= object2.posY)
			){
		var sideSum4 = ((object1.posX+object1.width)-object2.posX);
		var sideSum3 = ((object2.posY+object2.height)-object1.posY);
		if( sideSum3 > sideSum4){
			response = 3;
		}else{
			response = 4;
		}
	}
	
	return response;
}


game.prototype.getMapped = function (e) {
	switch(e) {
		case 38:
			return 'arrow-up';
			break;
		case 40:
			return 'arrow-down';
			break;
		case 37:
			return 'arrow-left';
			break;
		case 39:
			return 'arrow-right';
			break;
		case 87:
			return 'key-w';
			break;
		case 83:
			return 'key-s';
			break;
		case 65:
			return 'key-a';
			break;
		case 68:
			return 'key-d';
			break;
		default:
			return 'unknown';
			break;
	}
}