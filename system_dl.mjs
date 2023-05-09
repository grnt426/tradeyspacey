console.info("* *   * *   * *   * *   * *");
console.info("**** System Downloader ****");
console.info("* *   * *   * *   * *   * *");

const GAME_API = "https://api.spacetraders.io/v2/";

import {Client} from "node-rest-client";
const client = new Client();
import fs from "fs";

const auth_file = "authtoken.secret"
if(fs.existsSync(auth_file)) {
    let auth = fs.readFileSync(auth_file, 'utf8');

    const args = {
        headers: {"Authorization": "Bearer " + auth}
    }

    client.get(GAME_API + "/systems", args, function(data, resp) {
        console.info("Got Data");
        console.info(data);
    });
}
else {
    console.error("FAILURE: Need auth token to do anything *shrug*")
}