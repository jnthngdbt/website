'use strict';

var bgColor = 0x222224;

// POINT CLOUD GEOMETRY

var geometry = new THREE.Geometry();

var span = 20;
var spanX = span * 2.0;
var spanY = span;
var spanZ = span * 1.5; // deep enough for enough fly-through
var numPoints = 20000;
for (var i = 0; i < numPoints; i++){
	var x = Math.random() * spanX - spanX/2;
	var y = Math.random() * spanY - spanY/2;
	var z = Math.random() * spanZ - spanZ/2;
	geometry.vertices.push(new THREE.Vector3(x,y,z));
}

// POINTS MATERIAL

var loader = new THREE.TextureLoader();
var texture = loader.load( "assets/particle.alpha.png" );
var material = new THREE.PointsMaterial( { 
	color: 0x333333, // mainly intensity controlling saturation
	size: .2,
	map: texture,
	blending: THREE.AdditiveBlending,
  	transparent: true
} );

// CAMERA

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 30;

// SCENE
var scene = new THREE.Scene();

// FOG

// The fog size is the distance from the camera to the end of the cloud.
// So that when the cloud is at the end, it is completely fogged.
var fogSize = camera.position.z - spanZ/2;

var fogNear = 0;
var fogFar = fogSize;
scene.fog = new THREE.Fog(0x000000, fogNear, fogFar);

// PARTICLES

var particles = new THREE.Points( geometry, material );

// Initially, start the cloud out of the fog, so that we can
// see something coming and grab the attention earliest possible.
particles.position.z = 0.4 * fogSize;

// Correct alpha glitches.
particles.material.depthWrite = false;

// SET SCENE
scene.add( particles );

// RENDERER

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(bgColor, 1);

document.body.appendChild( renderer.domElement );

// ANIMATION

var render = function () {
    requestAnimationFrame( render );

    // Move the cloud.
    particles.position.z += 0.02;

    // Reset the cloud position when its rear when through the camera.
    if (particles.position.z > (spanZ/2 + camera.position.z)){
        // Appear at the beginning of the fog, but not too far to see it quickly.
    	particles.position.z = 0.2 * fogSize;
    }

    // Adapt to window resize.
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.render(scene, camera);
};

render();

