/* eslint-disable */
let numberUtil;
class NumberUtilFactory {

	constructor(){
		/**
		 * Returns a random number between min (inclusive) and max (exclusive)
		 */
		this.getRandomArbitrary = function(min, max) {
		    return Math.random() * (max - min) + min;
		}

		/**
		 * Returns a random integer between min (inclusive) and max (inclusive)
		 * Using Math.round() will give you a non-uniform distribution!
		 */
		this.getRandomInt = function(min, max) {
		    return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		this.convertTime = function(gameObj){
		  
		  //var moment = moment().seconds( Number(gameObj.seconds) );
	      var gameSecondsNum = Number(gameObj.second);
	     
	      var gameTimeObj = moment({s: gameSecondsNum});

	      var minsStr = String( gameTimeObj.minutes() ); //moment.minutes;
	      var secondsStr = String( gameTimeObj.seconds() ); //moment.seconds; 

	      if ( Number(secondsStr) < 10 ) secondsStr = "0" + secondsStr; 

	      return secondsStr;
		}

		this.getHeightByWidth = function( newWidthNum, curWidth, curHeight  ){

			var newHeight = ( newWidthNum * curHeight ) / curWidth;

			return newHeight;
		}

		//this.calcPageNum = () =>{
			//const totalPages = Math.floor( this.props.datasetOpen.total / this.props.datasetOpen.limit ) + 1;
		//}

		///////////////////////////////////////////////////////////////////// POINTS

		this.getDestinationVector = function( originVector, angle, distance) {
		    var destinationVector = {x: 0, y: 0};

		    destinationVector.x = Math.round(Math.cos(angle * Math.PI / 180) * distance + originVector.x);
		    destinationVector.y = Math.round(Math.sin(angle * Math.PI / 180) * distance + originVector.y);

		    return destinationVector;
		}

		this.roundToTwo = function(num) {    
    		return +(Math.round(num + "e+2")  + "e-2");
		}

		this.getDistanceByPercent = function( totalDistance, percent ){

			var curDist = ( totalDistance * percent ) / 100;

			return curDist;

		}

		this.getPercent = function( curTotal, total ){ 

			var percent = Math.floor ( ( curTotal * 100 ) / total );
			
			return percent; 

		};

		this.getHypotenuse = function( width, height ){

			return Math.sqrt ( Math.pow(width, 2) + Math.pow(height, 2) );
		}

		this.getMoveVector = function( angle, distance ){
			
		    var scratch = Physics.scratchpad();
		      // scale the amount to something not so crazy
		    var distance = 0.000075;
		      // point the acceleration in the direction of the ship's nose
		    var moveVector = scratch.vector().set(
		          distance * Math.cos( angle ), 
		          distance * Math.sin( angle ) 
		    );
		      
		    return moveVector;  
	
		    scratch.done();
		}

		this.getCoinFlip = function(){
			var ran = Math.floor(Math.random() * 2);
			var bResult = ( ran === 0 ) ? false : true;
			return bResult;
		}

		this.getRandomMoveVector = function(){
			
			var angle = Math.random() * 360; //fishBody.state.angular.pos;

		    var scratch = Physics.scratchpad();
		      // scale the amount to something not so crazy
		    var amount = 0.000075;
		      // point the acceleration in the direction of the ship's nose
		    var moveVector = scratch.vector().set(
		          amount * Math.cos( angle ), 
		          amount * Math.sin( angle ) 
		    );
		      
		    return moveVector;  
	
		    scratch.done();
		}

		this.physicsScale = function(num){
		    return num * window.innerWidth / 600;
		}
	}
}

export default numberUtil = new NumberUtilFactory();
