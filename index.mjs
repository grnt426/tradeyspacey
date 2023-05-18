import express from 'express';
import fs from "fs";

const app = express();

let galaxyData = {};

app.use(express.static('src'));

app.get("/galaxy_data", (req, res) => {
    res.status(200);
    res.header("Content-Type", "application/json");
    res.send(galaxyData);
});

const server = app.listen(8080, () => {
    console.info("Server started");
});

const SYS_DATA_FILE = "systemdata.json"

if(fs.existsSync(SYS_DATA_FILE)) {
    galaxyData = JSON.parse(fs.readFileSync(SYS_DATA_FILE, 'utf8'));
    console.info("Parsed galaxy of size: " + galaxyData.length);
}
else {
    console.error("Can't find cached galaxy data....uhh, killing server I guess....");
    server.close(() => {
        process.exit(0);
    });
}