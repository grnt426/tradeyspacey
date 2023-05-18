$( document ).ready( processData );

const HOSTNAME = "http://localhost:8080";

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
}

function getGalaxyData() {
    $.ajax({
        url: HOSTNAME + "/galaxy_data",
        success: function(res) {
            galaxyData = res;
            setInterval(renderer, 10);
        }
    });
}

function renderer() {
    Object.values(galaxyData).forEach(sys => {
        if(sys != null) {
            let x = sys.x / 17 + 625;
            let y = sys.y / 17 + 625;
            let type = sys.type;
            let color = star_types[type];
            context.beginPath();
            context.arc(x, y, 3, 0, 2 * Math.PI);
            context.fillStyle = color;
            context.fill();
        }
    });
}