import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { FlightDataController } from "./src/api/controllers/FlightDataController.js";
import { ContactDataController } from "./src/api/controllers/ContactDataController.js";
import { CarDataController } from "./src/api/controllers/CarDataController.js";
import { HotelDataController } from "./src/api/controllers/HotelDataController.js";


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
  new FlightDataController(req, res).respondWithListing();
});

app.post('/api/flight/booking', (req, res) => {
  new FlightDataController(req, res).bookFlight();
});

app.post('/api/contact/submission', (req, res) => {
  new ContactDataController(req, res).saveSubmission();
})

app.get('/api/car/listings', (req, res) => {
  new CarDataController(req, res).respondWithListings();
});

app.get('/api/car/listings/:carID', (req, res) => {
  new CarDataController(req, res).respondWithListing();
});

app.post('/api/car/booking', (req, res) => {
  new CarDataController(req, res).bookCar();
});

app.get('/api/hotel/listings', (req, res) => {
  new HotelDataController(req, res).respondWithListings();
});

app.get('/api/hotel/listings/:hotelID', (req, res) => {
  new HotelDataController(req, res).respondWithListing();
});

app.post('/api/hotel/booking', (req, res) => {
  new HotelDataController(req, res).bookHotel();
});


app.listen(PORT, () => {
  console.log('Web server is running on http://localhost:8080');
  console.log('Access the home page at: http://localhost:8080/pages/index.html');
});
