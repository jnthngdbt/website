// "use strict";

function PathNavigationControls( camera, campath, pathpos, pathrot, domElement) {

	// INPUTS
	// (should validate these)


	// HEY
	// Cannot work with a line (object 3d), because there is no getPoint().
	// Must get a curve, or a path, but now, the getPoint() returns in curve definition space.
	// But doing line.position.set(x,y,z)/camera.position.set(x,y,z) should transform both

	this.campos = camera.position.clone();
	//this.camrot = camera.rotation.clone();
	this.campath = campath;
	this.camera = camera;

	//this.camera.rotation += pathrot;

	this.domElement = ( domElement !== undefined ) ? domElement : document;
	if ( domElement ) this.domElement.setAttribute( 'tabindex', - 1 );

	// API

	this.acceleration = 0.001;
	this.displacement = 0;
	this.speed = 0;
	this.isClosedPath = false;

    // INTERNAL

    this.isDown = false;
	this.originX = 0;
	this.originY = 0;

	// TAKE FULL CONTROL OF THE CAMERA TRANSFORM
	this.camera.updateMatrix();
	this.camera.matrixAutoUpdate = false;

	this.translateCamOnPath = new THREE.Matrix4();
	this.rotatePath = new THREE.Matrix4();
	this.translatePath = new THREE.Matrix4();

	this.rotatePath.makeRotationFromEuler(
		new THREE.Euler( 
			pathrot.x,
			pathrot.y,
			pathrot.z,
			'XYZ'));

	this.translatePath.makeTranslation(
		pathpos.x,
		pathpos.y,
		pathpos.z);

	this.update = function(){
		this.displacement += this.speed;

		if (this.isClosedPath){
			if (this.displacement > 1.0) { this.displacement = 0.0; }
			if (this.displacement < 0.0) { this.displacement = 1.0; }
		} else {
			this.displacement = Math.min(this.displacement, 1.0);
			this.displacement = Math.max(this.displacement, 0.0);
		}

		var pos = this.campath.getPoint(this.displacement);
		
		if (this.displacement > 0.3) {debugger;}
		//debugger;

		this.translateCamOnPath.makeTranslation(
			pos.x + this.campos.x, 
			pos.y + this.campos.y, 
			(pos.isVector2 ? 0.0 : pos.z) + this.campos.z);

		this.camera.matrixWorld.identity();
		this.camera.matrixWorld.premultiply(this.translateCamOnPath);
		this.camera.matrixWorld.premultiply(this.rotatePath);
		this.camera.matrixWorld.premultiply(this.translatePath);
		//this.camera.matrixWorldNeedsUpdate = false;
		// this.camera.matrixAutoUpdate = false;
	}

	this.start = function(x,y){
		this.originX = x;
		this.originY = y;
		this.speed = 0;
		this.isDown = true;
	}

	this.move = function(x,y){
		if (this.isDown) {
			this.speed = (y-this.originY) * this.acceleration
		} else {
			this.speed = 0;
		}		
	}

	this.end = function(){
		this.originX = 0;
		this.originY = 0;
		this.speed = 0;
		this.isDown = false;	
	}

	this.mousedown = function( event ) {
		this.start(event.screenX, event.screenY);
	};

	this.mousemove = function( event ) {
		this.move(event.screenX, event.screenY);
	};

	this.mouseup = function( event ) {
		this.end();
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
		this.end();
	}

	function bind( scope, fn ) {
		return function () {
			fn.apply( scope, arguments );
		};
	}

	// This binding stuff is necessary with syntax
	//    this.touchend = function( event ) 
	// but should not be necessary with syntax
	//    function touchend( event )

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
	this.domElement.addEventListener( 'touchcancel', _touchend, false );
	this.domElement.addEventListener( 'touchmove', _touchmove, false );

}