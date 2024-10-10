'use strict';

var bgColor = 0x222224;

// POINT CLOUD GEOMETRY

var geometry = new THREE.Geometry();

var span = 20;
var spanX = span*2;
var spanY = span;
var spanZ = span;
var numPoints = 10000;
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

// PARTICLES

var particles = new THREE.Points( geometry, material );

// Initially, start the cloud out of the fog, so that we can
// see something coming and grab the attention earliest possible.
// In the render loop, reset the position to 0, in the fog.
particles.position.z = 5;

// //Attempt to correct alpha glitches.
// //From recommandations https://github.com/mrdoob/three.js/issues/6461.
//material.alphaTest = 0.5;
// particles.renderOrder = 9999; // last
particles.material.depthWrite = false;

// CAMERA

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 30;

// SCENE
var scene = new THREE.Scene();

var cloudNear = camera.position.z-spanZ/2;
var fogNear = cloudNear-5;
var fogFar = cloudNear+5;
scene.fog = new THREE.Fog(0x000000, fogNear, fogFar);

scene.add( particles );

// RENDERER

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(bgColor, 1);

document.body.appendChild( renderer.domElement );

// ANIMATION

var render = function () {
    requestAnimationFrame( render );

    // particles.rotation.x += 0.001;
    // particles.rotation.y += 0.01;
    // particles.rotation.z += 0.01;
    particles.position.z += 0.02;

    if (particles.position.z > (spanZ/2 + camera.position.z)){
    	particles.position.z = 0;
    }

    // Adapt to window resize.
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.render(scene, camera);
};

render();

