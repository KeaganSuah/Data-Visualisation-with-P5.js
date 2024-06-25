function covidMap() {
  // To initial private variables or functions
  var self = this;
  // Add global variables

  // Name for the visualisation to appear in the menu bar.
  this.name = "Covid: 2020-2022";

  // Each visualisation must have a unique ID with no special characters.
  this.id = "covid-mapl";

  // Title to display above the plot.
  this.title = "Covid: 2020-2022";

  // Load number of controls user has on the data
  this.controlsLabel = ["Display Legend", "Filter Years"];

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Private variables
  // to set the margin size for the plot
  let marginSize = 35;

  // Layout object to store all common plot layout parameters and methods.
  this.layout = {
    marginSize: marginSize,
    // Locations of margin positions. Left and bottom have double margin // size due to axis and tick labels.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - operation.height - marginSize * 2,
    plotWidth: function () {
      return this.rightMargin - this.leftMargin;
    },
    plotHeight: function () {
      return this.bottomMargin - this.topMargin;
    },
  };

  /////////////////// Public Methods /////////////////////////

  // Preload the data. This function is called automatically by the // gallery when a visualisation is added.
  this.preload = function () {
    this.data = loadTable(
      "./data/food/nutrients74-16.csv",
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
    // Font defaults.
    textSize(16);

    // Reset the data table for new data visualisation
    this.dataHeaders = ["Country", "Date", "Infected", "Death"];
    this.dataList = [];
    this.gridLayout = [0.4, 0.2, 0.2, 0.2];
    operation.refreshData(this.dataHeaders);
  };

  this.destroy = function () {};

  this.draw = function () {
    // Draw the title above the plot.
    this.drawTitle();

    rect(
      this.layout.leftMargin,
      this.layout.topMargin,
      this.layout.rightMargin,
      this.layout.bottomMargin
    );

    // Display points hovered
    operation.listDisplayData(this.dataList, this.gridLayout);

    // Draw control labels
    operation.listControlLabel(this.controlsLabel);
  };

  this.drawTitle = function () {
    fill(0);
    noStroke();
    textAlign("center", "center");
    textSize(16);
    text(
      this.title,
      this.layout.plotWidth() / 2 + this.layout.leftMargin,
      this.layout.topMargin - this.layout.marginSize / 2
    );
  };
}
