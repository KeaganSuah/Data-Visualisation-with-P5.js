function TechDiversityRace() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Tech Diversity: Race";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "tech-diversity-race";

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Load number of controls user has on the data
  this.controlsLabel = ["Select Company"];

  var self = this;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    this.data = loadTable(
      "./data/tech-diversity/race-2018.csv",
      "csv",
      "header",
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
      }
    );
  };

  this.setup = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    operationControl();

    // Fill the options with all company names.
    let companies = this.data.columns;
    // First entry is empty, so not able to use ES6
    for (let i = 1; i < companies.length; i++) {
      this.select.option(companies[i]);
    }
  };

  this.destroy = function () {
    this.select.remove();
  };

  // Create a new pie chart object.
  this.pie = new PieChart(
    width / 2,
    (height - operation.height) / 2,
    width * 0.4
  );

  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Draw operation label
    operation.listControlLabel(this.controlsLabel);

    // Make a title.
    let title = "Employee diversity at " + companyName;

    // Get the value of the company we're interested in from the
    // select item.
    var companyName = this.select.value();

    // Get the column of raw data for companyName.
    let col = this.data.getColumn(companyName);
    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    let labels = this.data.getColumn(0);

    // Colour to use for each category.
    let colours = ["blue", "red", "green", "pink", "purple", "yellow"];

    // Draw the pie chart!
    this.pie.draw(col, labels, colours, title);
  };

  // Control panel label and controls
  // Display the operation controls on the graph for users
  let operationControl = function () {
    // Create a select DOM element.
    self.select = createSelect();
    self.select.position(
      450 + operation.control_x_axis,
      operation.labelHeight[0]
    );
  };
}
