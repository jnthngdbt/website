'use strict';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({ 
    alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.setClearColor( 0xffffff, 0);

var geometry = new THREE.BoxGeometry(4,4,4);
var material = new THREE.MeshBasicMaterial( { 
    color: 0x888888,
    wireframe: true,
    wireframeLinewidth: 1 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

var render = function () {
    requestAnimationFrame( render );

    cube.rotation.x += 0.003;
    cube.rotation.y += 0.003;

    // Adapt to window resize.
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.render(scene, camera);
};

render();