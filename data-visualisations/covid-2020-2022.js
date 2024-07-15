// This is my third extension, for now its only the skeleton of how the data visualisation will load, currently no data and no visualisation. Only the control panel and data table is shown.
function covidMap(c) {
  // To initial private variables or functions
  var self = this;
  // Add global variables

  // Name for the visualisation to appear in the menu bar.
  this.name = "Covid: 2020-2022";

  // Each visualisation must have a unique ID with no special characters.
  this.id = "covid-map";

  // Title to display above the plot.
  this.title = "Covid: 2020-2022";

  // Load number of controls user has on the data
  this.controlsLabel = ["Display Legend", "Filter Years", "Play Animation"];

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

  // Mappa related variables
  let myMap;
  const mappa = new Mappa("Leaflet");

  const options = {
    lat: 33,
    lng: 50,
    zoom: 1.5,
    style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
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

    // Check to see if the map exist, if yes, do not make second copy
    exist = document.getElementById("Leaflet");
    if (exist == null) {
      // Create a tile map with the options declared
      myMap = mappa.tileMap(options);
      myMap.overlay(c);
    }
  };

  this.destroy = function () {};

  this.draw = function () {
    clear();
    const itoshima = myMap.latLngToPixel(33.511777, 130.146019);
    // Using that position, draw an ellipse
    ellipse(itoshima.x, itoshima.y, 10, 10);

    // Draw the title above the plot.
    this.drawTitle();

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
