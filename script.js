let scene, camera, renderer;

// Postavka scene i kamere
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.lookAt(scene.position);
camera.position.z = 500; 

// Kreiranje instance renderera
renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000);
renderer.shadowMap.enabled = true;

// Ambijentalno osvetljenje scene
const ambientLight = new THREE.AmbientLight(); 
scene.add(ambientLight);

// Senke
const light = new THREE.DirectionalLight(); // Senke
light.position.set(200, 100, 200);
light.castShadow = true;
light.shadow.camera.left = -100;
light.shadow.camera.right = 100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;
scene.add(light);

let rocks, myPlanet;
const colors = [
  0x37be95,
  0xf3f3f3,
  0x6549c0,
  0xf4d03f,
  0x8e44ad,
  0xdfff00,
  0xff7f50,
  0xde3163
];

function drawRocks() {
  rocks = new THREE.Group(); // Kamenje ce biti grupa 3D objekata
  scene.add(rocks);
  const geometry = new THREE.TetrahedronGeometry(6, 1); // Oblik kamena (piramida + 1 = pentahedron)

  // Kreiranje 500 kamenja
  for (let i = 0; i < 500; i++) {
    
    // Kreiranje sjajnog materijala nasumicno izabrane boje iz liste  
    const material = new THREE.MeshPhongMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      shading: THREE.FlatShading
    });
    
    // Kreiranje jednog kamena od definisanog oblika i materijala
    const mesh = new THREE.Mesh(geometry, material);
    
    // Nasumicna postavka koordinata kamena (x,y,z)
    mesh.position.set(
      (Math.random() - 0.5) * 1000,
      (Math.random() - 0.5) * 1000,
      (Math.random() - 0.5) * 1000
    );
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false; // Sprecavanje update-a pri svakom frejmu
    rocks.add(mesh); // Dodavanje jednog kamena u grupu
  }
}

function drawMyPlanet() {
  myPlanet = new THREE.Group(); // Planeta ce biti grupa koja se sastoji od lopte i prstena
  myPlanet.rotation.set(0.4, 0.3, 0);
  scene.add(myPlanet);

  // Kreiranje planete
  const planetGeometry = new THREE.IcosahedronGeometry(100, 1); // 100 je precnik planete a 1 daje oblik lopte

  // Kreiranje sjajnog materijala za loptu
  const planetMaterial = new THREE.MeshPhongMaterial({
    color: 0x37be95,
    shading: THREE.FlatShading
  });

  // Kreiranje planete zadatog oblika i materijala
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);

  planet.castShadow = true;
  planet.receiveShadow = true;
  planet.position.set(0, 40, 0); // Postavljanje lopte u centar scene
  myPlanet.add(planet);

  // Kreiranje prstena
  const ringGeometry = new THREE.TorusGeometry(140, 12, 6, 15);
  const ringMeterial = new THREE.MeshStandardMaterial({
    color: 0x6549c0,
    shading: THREE.FlatShading
  });
  const ring = new THREE.Mesh(ringGeometry, ringMeterial);
  ring.position.set(0, 40, 0);
  ring.rotateX(80);
  ring.castShadow = true;
  ring.receiveShadow = true;
  myPlanet.add(ring);
}

// Funkcija koja ce renderovati i animirati svet
function render() {
  requestAnimationFrame(render);

  rocks.rotation.x += 0.001;
  rocks.rotation.y -= 0.004;
  myPlanet.rotation.y += 0.003;
  renderer.render(scene, camera);
}

// Kreiranje kamenja i planete
drawRocks();
drawMyPlanet();

// Dodavanje renderer-a u HTML dokument (<canvas> element u kom ce se prikazati scena)
document.getElementById("world").appendChild(renderer.domElement);

render();
