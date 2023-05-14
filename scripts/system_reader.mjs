import fs from "fs";

console.info("* *   * *   * *   * *   * *");
console.info("**** System     Reader ****");
console.info("* *   * *   * *   * *   * *");

const SYS_DATA_FILE = "systemdata.json"

if(fs.existsSync(SYS_DATA_FILE)) {
    let galaxy = JSON.parse(fs.readFileSync(SYS_DATA_FILE, 'utf8'));
    console.info("Parsed galaxy of size: " + galaxy.length);
    let star_types = ["RED_STAR","ORANGE_STAR","YOUNG_STAR","BLUE_STAR"];
    let types = {
        "RED_STAR":0,
        "ORANGE_STAR":0,
        "BLUE_STAR":0,
        "YOUNG_STAR":0,
        "NEUTRON_STAR":0,
        "WHITE_DWARF":0,
        "BLACK_HOLE":0,
        "HYPERGIANT":0,
        "UNSTABLE":0,
        "null":0,
    }
    
    for(let i in galaxy) {
        let sys = galaxy[i];
        if(sys == null) {
            types.null++;
        }
        else {
            types[sys.type]++;
        }
    }
    
    console.info(types);
}
else {
    console.error("File doesn't exist")
}
