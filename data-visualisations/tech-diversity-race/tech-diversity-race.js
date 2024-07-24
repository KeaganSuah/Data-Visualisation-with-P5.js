function TechDiversityRace() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Tech Diversity: Race";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "tech-diversity-race";

  // Title to display above the plot.
  this.title = "Tech Diversity: Race";

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Load number of controls user has on the data
  this.controlsLabel = ["Select Company"];

  // Declare for variables in objects for Private Methods
  var self = this;

  /////////////////// Public Methods /////////////////////////

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

    companyFilter();

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
    (height - dataVisualisationTools.height) / 2,
    width * 0.4
  );

  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Draw the background for the visualisation
    background(255);

    // Draw dataVisualisationTools label
    dataVisualisationTools.listControlLabel(this.controlsLabel);

    // Get the value of the company we're interested in from the
    // select item.
    var companyName = this.select.value();

    // Make a title.
    title = "Employee diversity at " + companyName;

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

  /////////////////// Private Methods /////////////////////////
  // These Methods below are done by myself (Keagan Suah)

  // Control panel label and controls
  // Display the companyFilter controls on the graph for users
  let companyFilter = function () {
    // Create a select DOM element.
    self.select = createSelect();
    self.select.position(
      dataVisualisationTools.controlXmargin +
        dataVisualisationTools.controlXaxis,
      dataVisualisationTools.labelHeight[0]
    );
  };
}
