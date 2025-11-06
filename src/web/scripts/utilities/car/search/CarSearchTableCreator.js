import { Cart } from "../../Cart.js";
import { SearchTableCreator } from "../../SearchTableCreator.js";
import { CAR_TABLE_COLUMNS_NAMES } from "../CarConstants.js";

export class CarSearchTableCreator extends SearchTableCreator {

  getColumnNames() {
    return CAR_TABLE_COLUMNS_NAMES;
  }

  getDetailsListForRow(carListing) {
    return [
      carListing.id,
      carListing.type,
      carListing.city,
      carListing.checkInDate,
      carListing.checkOutDate,
      `$${carListing.pricePerDay}`,
    ];
  }

  clickCartButton(carListing) {
    Cart.addCar(carListing.id);
    alert(`Car ${carListing.id} added to cart!`);
  }
}