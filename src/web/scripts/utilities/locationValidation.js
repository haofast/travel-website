export const TX_CITIES = ["Dallas", "Houston", "San Antonio", "Austin", "Fort Worth", "El Paso", "McAllen", "Denton", "Arlington", "Corpus Christi",
  "Plano", "Lubbock", "Laredo", "Killeen", "Irving", "Garland", "McKinney", "Brownsville", "College Station", "Amarillo", "Grand Prairie", "Waco",
  "Frisco", "Port Arthur", "Pasadena", "Beaumont", "Odessa", "Midland", "Mesquite", "Tyler", "Harlingen", "Carrollton", "Round Rock",
  "Pearland", "Richardson", "Abilene", "Texas City", "The Woodlands", "Lewisville", "League City", "Temple", "Allen", "Longview", "San Angelo",
  "Wichita Falls", "Edinburg", "Sugar Land", "Mission", "Conroe", "Bryan", "Texarkana", "Pharr", "New Braunfels", "Baytown", "Flower Mound", "Lake Jackson",
  "Cedar Park", "Atascocita", "Missouri City", "San Marcos", "Georgetown", "North Richland Hills", "Mansfield", "Victoria", "Sherman", "Pflugerville",
  "Rowlett", "Spring", "Euless", "Eagle Pass", "Grapevine", "DeSoto", "Wylie", "Bedford", "Leander", "Cedar Hill", "Rio Grande City", "Keller", "Galveston",
  "Little Elm", "Burleson", "Lufkin", "Del Rio", "Haltom City", "Rockwall", "Kyle", "The Colony", "Weatherford", "Coppell", "Channelview", "Weslaco", "Schertz",
  "Friendswood", "Huntsville", "Duncanville", "Lancaster", "Hurst", "Mission Bend", "Rosenberg", "Forney"
].map(city => city.toLowerCase());

export const CA_CITIES = ["Los Angeles", "San Francisco", "San Diego", "Riverside", "Sacramento", "San Jose", "Fresno", "Concord", "Mission Viejo", "Bakersfield",
  "Murrieta", "Long Beach", "Oakland", "Indio", "Stockton", "Oxnard", "Modesto", "Anaheim", "Lancaster", "Victorville", "Santa Ana", "Santa Rosa", "Santa Clarita",
  "Antioch", "Irvine", "Chula Vista", "Fremont", "Visalia", "Thousand Oaks", "San Bernardino", "Fontana", "Moreno Valley", "Santa Barbara", "Glendale",
  "Huntington Beach", "Salinas", "Santa Cruz", "Rancho Cucamonga", "Hemet", "Oceanside", "Ontario", "Garden Grove", "Vallejo", "Elk Grove", "Corona", "Hayward",
  "Palmdale", "Sunnyvale", "Pomona", "Escondido", "Fairfield", "Torrance", "Merced", "Pasadena", "Orange", "Fullerton", "Santa Maria", "Roseville", "Simi Valley",
  "Santa Clara", "East Los Angeles", "Berkeley", "Redding", "Yuba City", "Seaside", "Gilroy", "El Monte", "Carlsbad", "Temecula", "Costa Mesa", "Downey", "El Centro",
  "San Buenaventura", "Inglewood", "Richmond", "Clovis", "West Covina", "Turlock", "Daly City",
  "Chico", "Norwalk", "Jurupa Valley", "Burbank", "San Mateo", "El Cajon", "Rialto", "Vista", "Vacaville", "Manteca", "Arden-Arcade",
  "Compton", "San Marcos", "Tracy", "South Gate", "Hesperia", "Carson", "Santa Monica", "Hanford", "Westminster", "Livermore"
].map(city => city.toLowerCase());

const CITIES = {
  texas: TX_CITIES,
  california: CA_CITIES,
};

export function isValidCity(city) {
  const lowerCaseCity = city.toLowerCase();
  return Object.values(CITIES).some((cityList) => cityList.includes(lowerCaseCity));
}

export function areCitiesFromSameState(cityA, cityB) {
  const lowerCaseCityA = cityA.toLowerCase();
  const lowerCaseCityB = cityB.toLowerCase();

  return Object.values(CITIES).some((cityList) => (
    cityList.includes(lowerCaseCityA) && cityList.includes(lowerCaseCityB)
  ));
}