$( document ).ready( processData );

const HOSTNAME = "http://localhost:8080";

let cameraPos = {x:625, y:625};
const CAMERA_SPEED = 1;

let controller = {
    "s": {pressed:false, velocity:{x:0, y:CAMERA_SPEED}},
    "a": {pressed:false, velocity:{x:-1*CAMERA_SPEED, y:0}},
    "d": {pressed:false, velocity:{x:CAMERA_SPEED, y:0}},
    "w": {pressed:false, velocity:{x:0, y:-1*CAMERA_SPEED}}
}

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
        if(event.key in controller)
            controller[event.key].pressed = false;
        else
            console.log("unknown key, ignoring");
    });
}

function gameLoop() {
    handleController();
    paint();
}

function handleController() {
    Object.values(controller).forEach(control =>  {
        if(control.pressed) {
            cameraPos.x += control.velocity.x;
            cameraPos.y += control.velocity.y;
        }
    });
}

function paint() {
    clear();
    Object.values(galaxyData).forEach(sys => {
        if(sys != null) {
            let x = sys.x / 17 + cameraPos.x;
            let y = sys.y / 17 + cameraPos.y;
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