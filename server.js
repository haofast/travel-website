import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { FlightDataController } from "./src/api/controllers/FlightDataController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;
const app = express();

app.use(express.json())
app.use(express.static(path.join(__dirname, 'src', 'web')));

app.get('/api/flight/listings', (req, res) => {
  new FlightDataController(req, res).respondWithListings();
});

app.get('/api/flight/listings/:flightID', (req, res) => {
  new FlightDataController(req, res).respondWithListing()
});

app.post('/api/flight/booking', (req, res) => {
  new FlightDataController(req, res).bookFlight();
});

app.listen(PORT, () => {
  console.log('Web server is running on http://localhost:8080');
  console.log('Access the home page at: http://localhost:8080/pages/index.html');
});
