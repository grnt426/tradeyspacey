import {Client} from "node-rest-client";
import { setTimeout } from 'timers/promises';
import fs from "fs";

const GAME_API = "https://api.spacetraders.io/v2/";
const client = new Client();
const auth_file = "authtoken.secret"

console.info("* *   * *   * *   * *   * *");
console.info("**** System Downloader ****");
console.info("* *   * *   * *   * *   * *");

if(fs.existsSync(auth_file)) {
    let systems = [];
    let auth = fs.readFileSync(auth_file, 'utf8');

    let args = {
        headers: {"Authorization": "Bearer " + auth},
        parameters: {page: 1}
    }

    for (let i = 1; i <= 500; i++) {
        if(i % 50 === 0) {
            console.info((i / 500) * 100 + "% complete");
        }
        args.parameters.page = i;
        client.get(GAME_API + "/systems", args, function(data, _) {
            console.info("Got Data");
            systems = systems.concat(data.data);
        });

        // we get rate limited at 2 TPS. We are allowed some burst, but meh. This is fine for now.
        await setTimeout(510);
    }
    
    fs.writeFileSync("systemdata.json", JSON.stringify(systems))
}
else {
    console.error("FAILURE: Need auth token to do anything *shrug*")
}