$( document ).ready( processData );

const HOSTNAME = "http://localhost:8080";

let cameraPos = {x:0, y:0};
const CAMERA_SPEED = 5;

let controller = {
    "s": {pressed:false, velocity:{x:0, y:CAMERA_SPEED}},
    "a": {pressed:false, velocity:{x:-1*CAMERA_SPEED, y:0}},
    "d": {pressed:false, velocity:{x:CAMERA_SPEED, y:0}},
    "w": {pressed:false, velocity:{x:0, y:-1*CAMERA_SPEED}}
}

const ORIG_CAM_VEC = {x:0, y:0};
let moveCameraVector = {x:0, y:0};

let zoom = false;
const MAX_ZOOM_LEVEL = 23;
let zoomLevel = MAX_ZOOM_LEVEL;

let galaxyData = {};
let canvas, context;
let star_types = {
    "RED_STAR": "#ec2e2e",
    "ORANGE_STAR": "#ff7811",
    "YOUNG_STAR": "#fafa06",
    "BLUE_STAR": "#0000FF",
    "NEUTRON_STAR":"#c7eaff",
    "WHITE_DWARF":"#fffafa",
    "BLACK_HOLE":"#7e7e7e",
    "HYPERGIANT":"#8fc0ff",
    "UNSTABLE":"#f702ff"
};

function processData() {
    getGalaxyData();
    canvas = $("#mapCanvas").get(0);
    context = canvas.getContext("2d");
    cameraPos.x = canvas.width / 2;
    cameraPos.y = canvas.height / 2;
    setupListeners();
}

function getGalaxyData() {
    $.ajax({
        url: HOSTNAME + "/galaxy_data",
        success: function(res) {
            galaxyData = res;
            setInterval(gameLoop, 10);
        }
    });
}

function setupListeners() {
    canvas.addEventListener('keydown', function(event) {
        if(event.key in controller)
            controller[event.key].pressed = true;
        else
            console.log("unknown key, ignoring");
    });
    canvas.addEventListener('keyup', function(event) {
        if(event.key in controller) {
            controller[event.key].pressed = false;
        }
        else
            console.log("unknown key, ignoring");
    });

    canvas.addEventListener('wheel', function(event){

        // Prevent the browser window scrolling
        event.preventDefault();

        zoom = event.deltaY;

    }, false);
}

function gameLoop() {
    handleController();
    paint();
}

function handleController() {
    moveCameraVector.x = 0;
    moveCameraVector.y = 0;
    
    Object.values(controller).forEach(control =>  {
        if(control.pressed) {
            moveCameraVector.x += control.velocity.x;
            moveCameraVector.y += control.velocity.y;
        }
    });

    if(zoom) {
        zoomLevel += (zoom * 0.04);
        if(zoomLevel < 2)
            zoomLevel = 2;
        if(zoomLevel > MAX_ZOOM_LEVEL)
            zoomLevel = MAX_ZOOM_LEVEL;

        zoom = false;
    }

    cameraPos.x -= moveCameraVector.x;
    cameraPos.y -= moveCameraVector.y;
    if(moveCameraVector.x !== 0 || moveCameraVector.y !== 0)
        console.log(JSON.stringify(moveCameraVector) + " '" + JSON.stringify(cameraPos) + "' " + zoomLevel);
    
    moveCameraVector = ORIG_CAM_VEC;
}

function paint() {
    clear();
    clear();
    Object.values(galaxyData).forEach(sys => {
        if(sys != null) {
            let x = sys.x / zoomLevel + cameraPos.x;
            let y = sys.y / zoomLevel + cameraPos.y;
            let type = sys.type;
            let color = star_types[type];
            context.beginPath();
            context.arc(x, y, 1, 0, 2 * Math.PI);
            context.fillStyle = color;
            context.fill();
        }
    });
}

function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}