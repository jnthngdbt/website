// "use strict";

function PathNavigationControls( camera, domElement ) {
	this.camera = camera;

	this.domElement = ( domElement !== undefined ) ? domElement : document;
	if ( domElement ) this.domElement.setAttribute( 'tabindex', - 1 );

	// API

	this.acceleration = 0.001;
	this.displacement = 0;
	this.speed = 0;
	//this.lookX = 0;

    // INTERNAL

    this.isDown = false;
	this.originX = 0;
	this.originY = 0;

	this.update = function(){
		this.displacement += this.speed * this.acceleration;
	}

	this.start = function(x,y){
		this.originX = x;
		this.originY = y;
		this.speed = 0;
		//this.lookX = 0;
		this.isDown = true;
	}

	this.move = function(x,y){
		if (this.isDown) {
			this.speed = y-this.originY 
			//this.lookX += event.screenX-this.originX;
		} else {
			this.speed = 0;
		}		
	}

	this.end = function(x,y){
		this.originX = 0;
		this.originY = 0;
		this.speed = 0;
		//this.lookX = 0;
		this.isDown = false;	
	}

	this.mousedown = function( event ) {
		this.start(event.screenX, event.screenY);
	};

	this.mousemove = function( event ) {
		this.move(event.screenX, event.screenY);
	};

	this.mouseup = function( event ) {
		this.end(event.screenX, event.screenY);
	};

	this.touchstart = function( event ) {
		var x = event.touches[ 0 ].screenX;
		var y = event.touches[ 0 ].screenY;
		this.start(x,y);
	}

	this.touchmove = function( event ) {
		// Avoid scrolling.
		event.preventDefault();
    	event.stopPropagation();
    	
		var x = event.touches[ 0 ].screenX;
		var y = event.touches[ 0 ].screenY;
		this.move(x,y);
	}

	this.touchend = function( event ) {
		var x = event.touches[ 0 ].screenX;
		var y = event.touches[ 0 ].screenY;
		this.end(x,y);
	}

	function bind( scope, fn ) {
		return function () {
			fn.apply( scope, arguments );
		};
	}

	var _mousemove = bind( this, this.mousemove );
	var _mousedown = bind( this, this.mousedown );
	var _mouseup = bind( this, this.mouseup );

	var _touchstart = bind( this, this.touchstart );
	var _touchend = bind( this, this.touchend );
	var _touchmove = bind( this, this.touchmove );

	this.domElement.addEventListener( 'mousemove', _mousemove, false );
	this.domElement.addEventListener( 'mousedown', _mousedown, false );
	this.domElement.addEventListener( 'mouseup',   _mouseup, false );

	this.domElement.addEventListener( 'touchstart', _touchstart, false );
	this.domElement.addEventListener( 'touchend', _touchend, false );
	this.domElement.addEventListener( 'touchmove', _touchmove, false );

}