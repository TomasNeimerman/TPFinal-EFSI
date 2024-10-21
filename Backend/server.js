import express from "express";
import cors from "cors";
import usersController from "./src/controllers/users-controller.js";
import eventController from "./src/controllers/events-controller.js";
import provinceController from "./src/controllers/provinces-controller.js"
import locationController from "./src/controllers/location-controller.js"
import eventlocationController from "./src/controllers/event-location-controller.js"
import eventcategoryController from "./src/controllers/event-category-controller.js"

const app=express();

app.use(cors());
app.use(express.json());
app.use('/front', express.static('public'));
app.use("/api/user", usersController);
app.use("/api/event", eventController);
app.use("/api/province", provinceController);
app.use("/api/location", locationController);
app.use("/api/event-location", eventlocationController);
app.use("/api/event-category", eventcategoryController);
const port = 3508;

app.listen(port, () => { 
    console.log(`Listening on http://localhost:${port}`) 
})
