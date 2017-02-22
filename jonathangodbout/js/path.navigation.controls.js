// "use strict";

function PathNavigationControls( camera, domElement ) {
	this.camera = camera;

	this.domElement = ( domElement !== undefined ) ? domElement : document;
	if ( domElement ) this.domElement.setAttribute( 'tabindex', - 1 );

	// API

	this.acceleration = 0.001;
	this.displacement = 0;

    // INTERNAL

    this.isDown = false;
	this.originX = 0;
	this.originY = 0;
	this.speed = 0;


	this.update = function(){
		this.displacement += this.speed * this.acceleration;
	}

	this.mousedown = function( event ) {
		this.originX = event.screenX;
		this.originY = event.screenY;
		this.speed = 0;
		this.isDown = true;
	};

	this.mousemove = function( event ) {
		this.speed = this.isDown ? event.screenY-this.originY : 0;;
	};

	this.mouseup = function( event ) {
		this.originX = 0;
		this.originY = 0;
		this.speed = 0;
		this.isDown = false;
	};

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	}

	var _mousemove = bind( this, this.mousemove );
	var _mousedown = bind( this, this.mousedown );
	var _mouseup = bind( this, this.mouseup );

	this.domElement.addEventListener( 'mousemove', _mousemove, false );
	this.domElement.addEventListener( 'mousedown', _mousedown, false );
	this.domElement.addEventListener( 'mouseup',   _mouseup, false );
}