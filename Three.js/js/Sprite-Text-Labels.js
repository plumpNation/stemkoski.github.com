// standard global variables
const container = document.body;
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

// STATS - the fps counter in the corner of the screen
const stats = createStats();
container.appendChild(stats.domElement); // becomes .dom in stats.js r17

// RENDERER
const renderer = createRenderer(SCREEN_WIDTH, SCREEN_HEIGHT);
container.appendChild(renderer.domElement);

// SCENE
const scene = new THREE.Scene();

// CAMERA
const camera = createCamera(SCREEN_WIDTH, SCREEN_HEIGHT);
scene.add(camera);

// CONTROLS - for OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// LIGHT
const light = createLight();
scene.add(light);

// CUBE
const cubeSize = 50;
const cube = createCube(cubeSize);
scene.add(cube);

// LABELS
const label1 = makeTextSprite(' Hello ');

label1.position.set(-cubeSize * .5, cubeSize, cubeSize);
scene.add(label1);

const label2 = makeTextSprite(' Way more text on this one!!!! ');

label2.position.set(cubeSize * .5, cubeSize, cubeSize);
scene.add(label2);

animate();

// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////

function makeTextSprite(message, parameters = {}) {
    const fontface = 'Arial';
    const fontsize = 18;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // we need to set the size before measuring
    context.font = 'Bold ' + fontsize + 'px ' + fontface;
    // get size data (height depends only on font size)
    const textWidth = context.measureText(message).width;

    canvas.width = textWidth;

    // reset the text again now
    context.font = 'Bold ' + fontsize + 'px ' + fontface;

    // text color
    context.fillStyle = 'white';
    context.fillRect(0, 0, textWidth, fontsize * 1.4);
    // 1.4 is extra height factor for text below baseline: g,j,p,q.

    context.fillStyle = 'black';
    context.fillText(message, 0, fontsize);

    // canvas contents will be used for a texture
    const map = new THREE.CanvasTexture(canvas);
    // texture.needsUpdate = true; // not required when using the CanvasTexture

    const spriteMaterial = new THREE.SpriteMaterial({map});

    const sprite = new THREE.Sprite(spriteMaterial);

    sprite.scale.set(textWidth * .5, 75, 1);

    return sprite;
}

function animate() {
    requestAnimationFrame(animate);
    render();
    update();
}

function update() {
    controls.update();
    stats.update();
}

function render() {
    renderer.render(scene, camera);
}

function createRenderer(width, height) {
    const renderer = Detector.webgl
        ? new THREE.WebGLRenderer({antialias: true})
        : new THREE.CanvasRenderer();

    renderer.setSize(width, height);

    return renderer;
}

function createStats() {
    const stats = new Stats();

    stats.showPanel(0);
    stats.domElement.classList.add('stats-js'); // to target with CSS

    return stats;
}

function createCamera(width, height) {
    // @see https://en.wikipedia.org/wiki/Viewing_frustum
    const frustrumSize = 250;
    const aspect = width / height;

    const camera = new THREE.OrthographicCamera(
        frustrumSize * aspect / -2, // left
        frustrumSize * aspect / 2,  // right
        frustrumSize / 2,           // top
        frustrumSize / -2,          // bottom
        1,                          // near
        frustrumSize * 2            // far
    );

    camera.position.set(0, 150, 400);

    return camera;
}

function createLight() {
    const light = new THREE.PointLight(0xffffff);

    light.position.set(0, 250, 0);

    return light;
}

function createCube(size) {
    const cubeGeometry = new THREE.CubeGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    cube.position.set(0, size * .5, 0);
    cube.name = 'Cube';

    return cube;
}
