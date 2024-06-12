function bankruptDyanmicBall() {
  // To initial private variables or functions
  var self = this;
  // Add global variables

  // Name for the visualisation to appear in the menu bar.
  this.name = "Bankruptcy: 2000-2018";

  // Each visualisation must have a unique ID with no special characters.
  this.id = "bankruptcy-dyanmicball";

  // Title to display above the plot.
  this.title = "Bankruptcy Amount by Age & Sex: 2000-2018";

  // Load number of controls user has on the data
  this.labelArray = ["Display Legend", "Filter Years"];

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Private variables
  // to set the margin size for the plot
  var marginSize = 35;

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

  // Preload the data. This function is called automatically by the // gallery when a visualisation is added.
  this.preload = function () {
    var self = this;
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
    this.details = ["Nutrient", "year", "percentage"];
    operation.refreshData(this.details);
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
    operation.listDisplayData(this.details, [0.6, 0.2, 0.2]);

    // Draw control labels
    operation.listControlLabel(this.labelArray);
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
