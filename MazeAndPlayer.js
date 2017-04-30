
/*CONTROLS******************************************************
*****use left and right keys to look around
*****use 'W' to move forwards
*****use 'S' to move backwards
*****use 'D' to move right
*****use 'A' to move left
*****use 'M' to shoot
*/
var scene, camera, renderer, mesh, clock;
var meshFloor, ambientLight, light;

var crate, crateTexture, crateNormalMap, crateBumpMap;

var keyboard = {};
var player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02, canShoot: 0 }; //move camera
var USE_WIREFRAME = false;

// all elements needed for A loading screen
var loadingScreen = {
	scene: new THREE.Scene(),
	camera: new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 100),
	box: new THREE.Mesh(
		new THREE.BoxGeometry(1.2, 1.2, 1.2),
		new THREE.MeshBasicMaterial({ color: 0x44ffff })
	)
};
var loadingManager = null;
var RESOURCES_LOADED = false;

//models Indexing and rendering meshes
var models = {
	tent: {
		obj: "GraphicProjectModels/naturePack_076.obj", //path to objects
		mtl: "GraphicProjectModels/naturePack_076.mtl", //path to mesh
		mesh: null
	},
	campfirerocks: {
		obj: "GraphicProjectModels/naturePack_077.obj",
		mtl: "GraphicProjectModels/naturePack_077.mtl",
		mesh: null
	},
	gun: {
		obj: "GraphicProjectModels/pistol.obj",
		mtl: "GraphicProjectModels/pistol.mtl",
		mesh: null,
		castShadow: false
	},
	gunBullet: {
		obj: "GraphicProjectModels/ammo_pistol.obj",
		mtl: "GraphicProjectModels/ammo_pistol.mtl",
		mesh: null,
		castShadow: false
	},
	character: {
		obj: "GraphicProjectModels/advancedCharacter.obj",
		mtl: "GraphicProjectModels/advancedCharacter.obj.mtl",
		mesh: null,
		castShadow: false
	}
};

//meshes indexing to hold
var meshes = {};

//bullets array to hold bullets
var bullets = [];

function init() {
	scene = new THREE.Scene();
	//scene.background = new THREE.Color( 0x191970 );
	camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 1000);
	clock = new THREE.Clock();
	//set up for loading scene
	loadingScreen.box.position.set(0, 0, 5);
	loadingScreen.camera.lookAt(loadingScreen.box.position);
	loadingScreen.scene.add(loadingScreen.box);

	//creating load manager to manage RESOURCES_LOADED when appropriate
	loadingManager = new THREE.LoadingManager();
	loadingManager.onProgress = function (item, loaded, total) {
		console.log(item, loaded, total);
	};

	loadingManager.onLoad = function () {
		console.log("loaded all resources");
		RESOURCES_LOADED = true;
		onResourcesLoaded();
	};

	mesh = new THREE.Mesh(
		new THREE.BoxGeometry(1, 1, 1),
		new THREE.MeshPhongMaterial({ color: 0x4444ffff, wireframe: USE_WIREFRAME }) //change cube color (baby blue for now)
	);
	mesh.position.y += 2;
	mesh.position.x += -5;	//position of the floating cube
	mesh.position.z += -1.5;
	mesh.receiveShadow = true;
	mesh.castShadow = true;
	scene.add(mesh);

	meshFloor = new THREE.Mesh(
		new THREE.PlaneGeometry(20, 30, 10, 10),
		new THREE.MeshPhongMaterial({ color: 0xffffff44, wireframe: USE_WIREFRAME }) //change color for ground (yellow for now)
	);
	meshFloor.rotation.x -= Math.PI / 2;
	meshFloor.receiveShadow = true;
	scene.add(meshFloor);

	ambientLight = new THREE.AmbientLight(0xffffff, 0.2); //white bright light pointing at the tents
	scene.add(ambientLight);

	light = new THREE.PointLight(0xffffff, 0.8, 18);
	light.position.set(-3, 6, -3);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	scene.add(light);

	var bluePoint = new THREE.PointLight(0x0033ff, 2.5, 5.5); //blue light in maze
	bluePoint.position.set(6.6, 0, -4.5);
	scene.add(bluePoint);
	//scene.add(new THREE.PointLightHelper(bluePoint, 3));

	var secondbluePoint = new THREE.PointLight(0x0033ff, 2.5, 5.5); //blue light in maze
	secondbluePoint.position.set(6.6, 0, 1.5);
	scene.add(secondbluePoint);
	//scene.add(new THREE.PointLightHelper(secondbluePoint, 3));

	var thirdbluePoint = new THREE.PointLight(0x0033ff, 2.5, 5.5); //blue light in maze
	thirdbluePoint.position.set(6.6, 0, 7.5);
	scene.add(thirdbluePoint);
	//scene.add(new THREE.PointLightHelper(thirdbluePoint, 3));

	var textureLoader = new THREE.TextureLoader(loadingManager); //loading texture to crates
	crateTexture = textureLoader.load("crate0/crate0_diffuse.png");
	crateBumpMap = textureLoader.load("crate0/crate0_bump.png");
	crateNormalMap = textureLoader.load("crate0/crate0_normal.png");

//CREATION OF ALL CRATES
	crate = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xf44444, //change cube to green
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(crate);
	crate.position.set(-4.5, 3 / 2, 8.7);
	crate.receiveShadow = true;
	crate.castShadow = true;


	cratetwo = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratetwo);
	cratetwo.position.set(8.5, 3 / 2, 13.5);
	cratetwo.receiveShadow = true;
	cratetwo.castShadow = true;

	cratethree = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratethree);
	cratethree.position.set(5.5, 3 / 2, 13.5);
	cratethree.receiveShadow = true;
	cratethree.castShadow = true;

	cratefour = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratefour);
	cratefour.position.set(8.5, 3 / 2, 10.5);
	cratefour.receiveShadow = true;
	cratefour.castShadow = true;

	cratefive = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratefive);
	cratefive.position.set(8.5, 3 / 2, 7.5);
	cratefive.receiveShadow = true;
	cratefive.castShadow = true;

	cratesix = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratesix);
	cratesix.position.set(8.5, 3 / 2, 4.5);
	cratesix.receiveShadow = true;
	cratesix.castShadow = true;

	crateseven = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(crateseven);
	crateseven.position.set(8.5, 3 / 2, 1.5);
	crateseven.receiveShadow = true;
	crateseven.castShadow = true;

	crateeight = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(crateeight);
	crateeight.position.set(8.5, 3 / 2, -1.5);
	crateeight.receiveShadow = true;
	crateeight.castShadow = true;

	cratenine = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratenine);
	cratenine.position.set(3.5, 3 / 2, -1.5);
	cratenine.receiveShadow = true;
	cratenine.castShadow = true;

	crateten = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(crateten);
	crateten.position.set(3.5, 3 / 2, 1.5);
	crateten.receiveShadow = true;
	crateten.castShadow = true;

	crateeleven = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(crateeleven);
	crateeleven.position.set(3.5, 3 / 2, 4.5);
	crateeleven.receiveShadow = true;
	crateeleven.castShadow = true;

	cratetwelve = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratetwelve);
	cratetwelve.position.set(3.5, 3 / 2, 7.5);
	cratetwelve.receiveShadow = true;
	cratetwelve.castShadow = true;

	cratethirteen = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratethirteen);
	cratethirteen.position.set(0.5, 3 / 2, 10.5);
	cratethirteen.receiveShadow = true;
	cratethirteen.castShadow = true;

	cratefourteen = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratefourteen);
	cratefourteen.position.set(2.5, 3 / 2, 15.5);
	cratefourteen.receiveShadow = true;
	cratefourteen.castShadow = true;

	cratefifteen = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratefifteen);
	cratefifteen.position.set(-0.5, 3 / 2, 15.5);
	cratefifteen.receiveShadow = true;
	cratefifteen.castShadow = true;

	cratesixteen = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratesixteen);
	cratesixteen.position.set(-0.5, 3 / 2, 15.5);
	cratesixteen.receiveShadow = true;
	cratesixteen.castShadow = true;

	crateseventeen = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(crateseventeen);
	crateseventeen.position.set(-3.5, 3 / 2, 15.5);
	crateseventeen.receiveShadow = true;
	crateseventeen.castShadow = true;

	crateeighteen = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(crateeighteen);
	crateeighteen.position.set(-6.5, 3 / 2, 15.5);
	crateeighteen.receiveShadow = true;
	crateeighteen.castShadow = true;


	cratenineteen = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratenineteen);
	cratenineteen.position.set(-9.5, 3 / 2, 15.5);
	cratenineteen.receiveShadow = true;
	cratenineteen.castShadow = true;

	cratetwenty = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratetwenty);
	cratetwenty.position.set(-8.5, 3 / 2, 12.5);
	cratetwenty.receiveShadow = true;
	cratetwenty.castShadow = true;

	cratetwentyone = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratetwentyone);
	cratetwentyone.position.set(-8.5, 3 / 2, 9.5);
	cratetwentyone.receiveShadow = true;
	cratetwentyone.castShadow = true;

	cratetwentytwo = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratetwentytwo);
	cratetwentytwo.position.set(-8.5, 3 / 2, 6.5);
	cratetwentytwo.receiveShadow = true;
	cratetwentytwo.castShadow = true;

	cratetwentythree = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratetwentythree);
	cratetwentythree.position.set(8.5, 3 / 2, -4.5);
	cratetwentythree.receiveShadow = true;
	cratetwentythree.castShadow = true;

	cratetwentyfour = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratetwentyfour);
	cratetwentyfour.position.set(3.5, 3 / 2, -4.5);
	cratetwentyfour.receiveShadow = true;
	cratetwentyfour.castShadow = true;

	cratetwentyfive = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratetwentyfive);
	cratetwentyfive.position.set(0.5, 3 / 2, -7.5); // x axis(left to right), y axis(height) ,z axis (front and back)
	cratetwentyfive.receiveShadow = true;
	cratetwentyfive.castShadow = true;

	cratetwentysix = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratetwentysix);
	cratetwentysix.position.set(-2.5, 3 / 2, -9.5); // x axis(left to right), y axis(height) ,z axis (front and back)
	cratetwentysix.receiveShadow = true;
	cratetwentysix.castShadow = true;

	cratetwentyseven = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratetwentyseven);
	cratetwentyseven.position.set(-5.5, 3 / 2, -9.5); // x axis(left to right), y axis(height) ,z axis (front and back)
	cratetwentyseven.receiveShadow = true;
	cratetwentyseven.castShadow = true;

	cratetwentyeight = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratetwentyeight);
	cratetwentyeight.position.set(-8.5, 3 / 2, -9.5); // x axis(left to right), y axis(height) ,z axis (front and back)
	cratetwentyeight.receiveShadow = true;
	cratetwentyeight.castShadow = true;


	cratetwentynine = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratetwentynine);
	cratetwentynine.position.set(-11.5, 3 / 2, -6.5);
	cratetwentynine.receiveShadow = true;
	cratetwentynine.castShadow = true;

	cratethirty = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratethirty);
	cratethirty.position.set(-11.5, 3 / 2, -3.5);
	cratethirty.receiveShadow = true;
	cratethirty.castShadow = true;

	cratethirtyone = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratethirtyone);
	cratethirtyone.position.set(-11.5, 3 / 2, -0.5);
	cratethirtyone.receiveShadow = true;
	cratethirtyone.castShadow = true;

	cratethirtytwo = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshPhongMaterial({
			color: 0xffffff, //change cube to 
			map: crateTexture,
			bumpMap: crateBumpMap,
			normalMap: crateNormalMap
		})
	);
	scene.add(cratethirtytwo);
	cratethirtytwo.position.set(-11.5, 3 / 2, 2.5);
	cratethirtytwo.receiveShadow = true;
	cratethirtytwo.castShadow = true;
	//END OF CRATES CREATION
	// Model/material loading!

	for (var _key in models) {
		(function (key) {

			var mtlLoader = new THREE.MTLLoader(loadingManager);
			mtlLoader.load(models[key].mtl, function (materials) {
				materials.preload();

				var objLoader = new THREE.OBJLoader(loadingManager);

				objLoader.setMaterials(materials);
				objLoader.load(models[key].obj, function (mesh) {

					mesh.traverse(function (node) {
						if (node instanceof THREE.Mesh) {
							if ('castShadow' in models[key])
								node.castShadow = models[key].castShadow;
							else
								node.castShadow = true;

							if ('receiveShadow' in models[key])
								mode.receiveShadow = models[key].receiveShadow;
							else
								node.receiveShadow = true;
						}
					});
					models[key].mesh = mesh;
				});
			});


		})(_key);

	}


	camera.position.set(0, player.height, -14); //change to position player
	camera.lookAt(new THREE.Vector3(0, player.height, 0));

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(1280, 720);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;

	document.body.appendChild(renderer.domElement);

	animate();
}

function onResourcesLoaded() {

	//clone models into meshes
	meshes["tent1"] = models.tent.mesh.clone();
	meshes["tent2"] = models.tent.mesh.clone();
	meshes["campfirerocks"] = models.campfirerocks.mesh.clone();
	meshes["gun"] = models.gun.mesh.clone();
	meshes["gunBullet"] = models.gunBullet.mesh.clone();
	meshes["character"] = models.character.mesh.clone();

	// Reposition individual meshes, then add meshes to scene
	meshes["tent1"].position.set(-5, 0, 5);
	scene.add(meshes["tent1"]);

	meshes["tent2"].position.set(-9, 0, 5);
	scene.add(meshes["tent2"]);

	meshes["campfirerocks"].position.set(-6, 0, 0);
	scene.add(meshes["campfirerocks"]);

	meshes["gun"].position.set(0, 2, 0);
	meshes["gun"].scale.set(10, 10, 10);
	scene.add(meshes["gun"]);

	//meshes["gunBullet"].position.set(0,2,0);
	//meshes["gunBullet"].scale.set(10,10,10);

	meshes["character"].position.set(-8, 0, 0);
	meshes["character"].scale.set(0.2, 0.2, 0.2);
	meshes["character"].rotation.set(0, Math.PI, 0); // Rotate it to face the other way.
	scene.add(meshes["character"]);

}

function animate() {
	//this condition runs while resources are loading
	if (RESOURCES_LOADED == false) {
		requestAnimationFrame(animate);

		loadingScreen.box.position.x -= 0.05;
		if (loadingScreen.box.position.x < -10) loadingScreen.box.position.x = 10;
		loadingScreen.box.position.y = Math.tan(loadingScreen.box.position.x);//change tan to sin for wave motion

		renderer.render(loadingScreen.scene, loadingScreen.camera);
		return;
	}


	requestAnimationFrame(animate);

	var time = Date.now() * 0.0005;
	var delta = clock.getDelta();

	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;
	crate.rotation.y += 0.01;

	for (var index = 0; index < bullets.length; index += 1) {
		if (bullets[index] === undefined) continue;
		if (bullets[index].alive == false) {
			bullets.splice(index, 1);
			continue;
		}
		bullets[index].position.add(bullets[index].velocity);
	}

//PROGRAMMING KEYS TO USE FOR CONTROLS
	if (keyboard[87]) { // W key
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}
	if (keyboard[83]) { // S key
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}
	if (keyboard[65]) { // A key
		camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
	}
	if (keyboard[68]) { // D key
		camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
	}

	if (keyboard[37]) { // left arrow key
		camera.rotation.y -= player.turnSpeed;
	}
	if (keyboard[39]) { // right arrow key
		camera.rotation.y += player.turnSpeed;
	}
	//shoot bullets
	if (keyboard[77] && player.canShoot <= 0) {//space bar
		//uncomment to get white spheres as bullets
		/*var bullet = new THREE.Mesh(
		//	new THREE.SphereGeometry(0.05, 8, 8),
		//	new THREE.MeshBasicMaterial({ Color: 0x4444ff })
		);*/

		//uncomment this part to have pistol ammo
		var bullet = models.gunBullet.mesh.clone();
		bullet.scale.set(15, 15, 15);
		bullet.rotation.set(1, camera.rotation.y, 0);

		bullet.position.set(
			meshes["gun"].position.x,
			meshes["gun"].position.y + 0.17,
			meshes["gun"].position.z + 0.25
		);

		bullet.velocity = new THREE.Vector3(
			-Math.sin(camera.rotation.y),
			0,
			Math.cos(camera.rotation.y)
		);

		//makes bullet dissapear
		bullet.alive = true;
		setTimeout(function () {
			bullet.alive = false;
			scene.remove(bullet);
		}, 1000);

		//add to scene for delay in gun shots
		bullets.push(bullet);
		scene.add(bullet);
		player.canShoot = 10;
	}
	if (player.canShoot > 0) player.canShoot -= 1;

	//position for gun in front of camera
	meshes["gun"].position.set(
		camera.position.x - Math.sin(camera.rotation.y + Math.PI / 6) * 0.75,
		camera.position.y - 0.5 + Math.sin(time * 4 + camera.position.x + camera.position.z) * 0.01,
		camera.position.z + Math.cos(camera.rotation.y + Math.PI / 6) * 0.75
	);

	//gun rotation
	meshes["gun"].rotation.set(
		camera.rotation.x,
		camera.rotation.y - Math.PI,
		camera.rotation.z
	);

	renderer.render(scene, camera);
}

function keyDown(event) {
	keyboard[event.keyCode] = true;
}

function keyUp(event) {
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;