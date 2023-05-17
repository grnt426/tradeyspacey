import fs from "fs";

const Client = require('node-rest-client').Client;
const client = new Client();

export default class API {
    constructor(authTokenFile) {
        this.AUTH_TOKEN_FILE = authTokenFile;
        this.GAME_API = "https://api.spacetraders.io/v2/";
        if(fs.existsSync(this.AUTH_TOKEN_FILE)) {
            this.authToken = fs.readFileSync(this.AUTH_TOKEN_FILE, 'utf8');
        }
    }
    
    getBaseHeaders() {
        return {
            headers: {"Authorization": "Bearer " + this.authToken}
        }
    }
}