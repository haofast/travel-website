
export class SearchTableCreator {

  constructor(items) {
    this.items = items;
  }

  getColumnNames() {
    throw new Error("Method 'getColumnNames()' must be implemented.");
  }

  getDetailsListForRow(item) {
    throw new Error("Method 'getDetailsListForRow()' must be implemented.");
  }

  clickCartButton(item) {
    throw new Error("Method 'clickCartButton()' must be implemented.");
  }

  createTable() {
    const table = document.createElement("table");
    const header = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const tableBody = document.createElement("tbody");

    header.appendChild(headerRow);
    table.appendChild(header);
    table.appendChild(tableBody);

    // build header row
    [...this.getColumnNames(), "" /* CART */].forEach((columnName) => {
      const headerCell = document.createElement("th");
      headerCell.textContent = columnName;
      headerRow.appendChild(headerCell);
    });

    // build data rows
    this.items.forEach((item) => {
      const dataRow = this.createTableDataRow(item);
      tableBody.appendChild(dataRow);
    });

    return table;
  }

  createTableDataRow(item) {
    const dataRow = document.createElement("tr");

    // create data cells
    this.getDetailsListForRow(item).forEach((detail) => {
      const dataCell = document.createElement("td");
      dataCell.textContent = detail;
      dataRow.appendChild(dataCell);
    });

    // create cart cell
    const cartButtonCell = document.createElement("td");
    dataRow.appendChild(cartButtonCell);

    // create cart button
    const cartButton = document.createElement("button");
    cartButton.textContent = "Add to Cart";
    cartButton.style.minWidth = "120px";
    cartButton.addEventListener("click", () => this.clickCartButton(item));
    cartButtonCell.appendChild(cartButton);

    return dataRow;
  }
}