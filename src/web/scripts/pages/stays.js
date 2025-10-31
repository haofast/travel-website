const texasCities = ["Dallas", "Houston", "San Antonio", "Austin", "Fort Worth", "El Paso", "McAllen", "Denton", "Arlington", "Corpus Christi",
  "Plano", "Lubbock", "Laredo", "Killeen", "Irving", "Garland", "McKinney", "Brownsville", "College Station", "Amarillo", "Grand Prairie", "Waco",
  "Frisco", "Port Arthur", "Pasadena", "Beaumont", "Odessa", "Midland", "Mesquite", "Tyler", "Harlingen", "Carrollton", "Round Rock",
  "Pearland", "Richardson", "Abilene", "Texas City", "The Woodlands", "Lewisville", "League City", "Temple", "Allen", "Longview", "San Angelo",
  "Wichita Falls", "Edinburg", "Sugar Land", "Mission", "Conroe", "Bryan", "Texarkana", "Pharr", "New Braunfels", "Baytown", "Flower Mound", "Lake Jackson",
  "Cedar Park", "Atascocita", "Missouri City", "San Marcos", "Georgetown", "North Richland Hills", "Mansfield", "Victoria", "Sherman", "Pflugerville",
  "Rowlett", "Spring", "Euless", "Eagle Pass", "Grapevine", "DeSoto", "Wylie", "Bedford", "Leander", "Cedar Hill", "Rio Grande City", "Keller", "Galveston",
  "Little Elm", "Burleson", "Lufkin", "Del Rio", "Haltom City", "Rockwall", "Kyle", "The Colony", "Weatherford", "Coppell", "Channelview", "Weslaco", "Schertz",
  "Friendswood", "Huntsville", "Duncanville", "Lancaster", "Hurst", "Mission Bend", "Rosenberg", "Forney"];

  const calCities = ["Los Angeles", "San Francisco", "San Diego", "Riverside", "Sacramento", "San Jose", "Fresno", "Concord", "Mission Viejo", "Bakersfield",
  "Murrieta", "Long Beach", "Oakland", "Indio", "Stockton", "Oxnard", "Modesto", "Anaheim", "Lancaster", "Victorville", "Santa Ana", "Santa Rosa", "Santa Clarita",
  "Antioch", "Irvine", "Chula Vista", "Fremont", "Visalia", "Thousand Oaks", "San Bernardino", "Fontana", "Moreno Valley", "Santa Barbara", "Glendale",
  "Huntington Beach", "Salinas", "Santa Cruz", "Rancho Cucamonga", "Hemet", "Oceanside", "Ontario", "Garden Grove", "Vallejo", "Elk Grove", "Corona", "Hayward",
  "Palmdale", "Sunnyvale", "Pomona", "Escondido", "Fairfield", "Torrance", "Merced", "Pasadena", "Orange", "Fullerton", "Santa Maria", "Roseville", "Simi Valley",
  "Santa Clara", "East Los Angeles", "Berkeley", "Redding", "Yuba City", "Seaside", "Gilroy", "El Monte", "Carlsbad", "Temecula", "Costa Mesa", "Downey", "El Centro",
  "San Buenaventura", "Inglewood", "Richmond", "Clovis", "West Covina", "Turlock", "Daly City",
  "Chico", "Norwalk", "Jurupa Valley", "Burbank", "San Mateo", "El Cajon", "Rialto", "Vista", "Vacaville", "Manteca", "Arden-Arcade",
  "Compton", "San Marcos", "Tracy", "South Gate", "Hesperia", "Carson", "Santa Monica", "Hanford", "Westminster", "Livermore"];

class Form {
  static getMessageElement() {
    return document.getElementById("formMessage");
  }

  static setMessageText(text) {
    Form.getMessageElement().textContent = text;
  }

  static setFailMessage(text) {
    Form.getMessageElement().className = "form-message form-message-failure";
    Form.setMessageText(text);
  }

  static setSuccessMessage(text) {
    Form.getMessageElement().className = "form-message form-message-success";
    Form.setMessageText(text);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const staysForm = document.forms["staysForm"];

  staysForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const city = staysForm["city"].value.trim();
    const checkinDate = new Date(staysForm["checkinDate"].value.trim());
    const checkoutDate = new Date(staysForm["checkoutDate"].value.trim());
    const adults = staysForm["numAdults"].value.trim();
    const children = staysForm["numChildren"].value.trim();
    const infants = staysForm["numInfants"].value.trim();

    startDate = new Date("2024-09-01");
    endDate = new Date("2024-12-01");

    const texasCitiesLower = texasCities.map(city => city.toLowerCase());
    const calCitiesLower = calCities.map(city => city.toLowerCase());

    if ((!texasCitiesLower.includes(city.toLowerCase())) && (!calCitiesLower.includes(city.toLowerCase()))) {
      Form.setFailMessage("Origin must be either Texas or California");
      return false
    }

    if (!(checkinDate >= startDate && checkinDate < endDate)) {
      Form.setFailMessage("Please enter a valid check in date. Date must be on or after September 1st, 2024 and before December 1st, 2024.");
      return false;
    }

    if (!(checkoutDate > checkinDate && checkoutDate <= endDate)) {
      Form.setFailMessage("Please enter a valid check in date. Date must be after your check in date and before December 1st, 2024.");
      return false;
    }

    var nadults = Number(adults);
    var nchildren = Number(children);
    var rooms = Math.ceil((nadults + nchildren) / 2);

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const normIn = checkinDate.toLocaleDateString('en-US', options);
    const normOut = checkoutDate.toLocaleDateString('en-US', options);

    var infoback = "Location: " + city + ", Check in date: " + normIn + ", Check out date: " + normOut + ", Number of Adults: " + adults + ", Number of Children: " + children +
      ", Number of Infants: " + infants + ", Number of Rooms needed: " + rooms;

    Form.setSuccessMessage(infoback);
    return true;
  });
});