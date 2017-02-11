'use strict';

// POINT CLOUD GEOMETRY

var geometry = new THREE.Geometry();

var span = 20;
var numPoints = 10000;
for (var i = 0; i < numPoints; i++){
	var x = Math.random() * span - span/2;
	var y = Math.random() * span - span/2;
	var z = Math.random() * span - span/2;
	geometry.vertices.push(new THREE.Vector3(x,y,z));
}

// POINTS MATERIAL

var loader = new THREE.TextureLoader();
var texture = loader.load( "assets/particle.alpha.png" );
var material = new THREE.PointsMaterial( { 
	color: 0xffffff, 
	size: .2,
	map: texture,
	blending: THREE.MultiplyBlending, // smoother blend, since points are dark
  	transparent: true
} );

// PARTICLES

var particles = new THREE.Points( geometry, material );

// //Attempt to correct alpha glitches.
// //From recommandations https://github.com/mrdoob/three.js/issues/6461.
// material.alphaTest = 0.2;
// particles.renderOrder = 9999; // last
particles.material.depthWrite = false;

// CAMERA

var camera = new THREE.PerspectiveCamera( 75, width/height, 0.1, 1000 );
camera.position.z = 30;

// SCENE

var scene = new THREE.Scene();
scene.add( particles );

// RENDERER

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);

document.body.appendChild( renderer.domElement );

// ANIMATION

render();

var render = function () {
    requestAnimationFrame( render );

    // particles.rotation.x += 0.0005;
    // particles.rotation.y += 0.01;
    // particles.rotation.z += 0.01;
    particles.position.z += 0.02;

    if (particles.position.z > (span/2 + camera.position.z)){
    	particles.position.z = 0;
    }

    // Adapt to window resize.
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.render(scene, camera);
};

