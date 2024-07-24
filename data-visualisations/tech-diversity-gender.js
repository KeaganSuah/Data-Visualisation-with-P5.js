function TechDiversityGender() {
  /////////////////// Public Variables /////////////////////////

  // Name for the visualisation to appear in the menu bar.
  this.name = "Tech Diversity: Gender";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "tech-diversity-gender";

  // Title to display above the plot.
  this.title = "Tech Diversity: Gender.";

  // Property to represent whether data has been loaded.
  this.loaded = false;

  /////////////////// Local Variables /////////////////////////

  // Layout object to store all common plot layout parameters and methods.
  let layout = {
    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: 130,
    rightMargin: width,
    topMargin: 30,
    bottomMargin: height - dataVisualisationTools.height - 50,
    pad: 5,

    plotWidth: function () {
      return this.rightMargin - this.leftMargin;
    },

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  // Middle of the plot: for 50% line.
  let midX = layout.plotWidth() / 2 + layout.leftMargin;

  // Default visualisation colours.
  let femaleColour = color(255, 0, 0);
  let maleColour = color(0, 255, 0);

  /////////////////// Public Methods /////////////////////////

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    var self = this;
    this.data = loadTable(
      "./data/tech-diversity/gender-2018.csv",
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
  };

  this.destroy = function () {};

  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Draw the background for the visualisation
    background(255);

    // Draw Female/Male labels at the top of the plot.
    drawCategoryLabels();

    let lineHeight =
      (height - dataVisualisationTools.height - 50 - layout.topMargin) /
      this.data.getRowCount();

    for (let i = 0; i < this.data.getRowCount(); i++) {
      // Calculate the y position for each company.
      let lineY = lineHeight * i + layout.topMargin;

      // Create an object that stores data from the current row.
      let company = {
        // Convert strings to numbers.
        name: this.data.getString(i, "company"),
        female: this.data.getNum(i, "female"),
        male: this.data.getNum(i, "male"),
      };

      // Draw the company name in the left margin.
      fill(0);
      noStroke();
      textAlign("right", "top");
      text(company.name, layout.leftMargin - layout.pad, lineY);

      // Draw female employees rectangle.
      fill(femaleColour);
      rect(
        layout.leftMargin,
        lineY,
        mapPercentToWidth(company.female),
        lineHeight - layout.pad
      );

      // Draw male employees rectangle.
      fill(maleColour);
      rect(
        layout.leftMargin + mapPercentToWidth(company.female),
        lineY,
        mapPercentToWidth(company.male),
        lineHeight - layout.pad
      );
    }
    // Draw 50% line
    stroke(150);
    strokeWeight(1);
    line(midX, layout.topMargin, midX, layout.bottomMargin);
  };

  /////////////////// Private Methods /////////////////////////

  // Declare for variables in objects for Private Methods
  var self = this;

  let drawCategoryLabels = function () {
    fill(0);
    noStroke();
    textAlign("left", "top");
    text(
      "Female",
      layout.leftMargin,
      height - dataVisualisationTools.height - 50
    );
    textAlign("center", "top");
    text("50%", midX, height - dataVisualisationTools.height - 50);
    textAlign("right", "top");
    text(
      "Male",
      layout.rightMargin,
      height - dataVisualisationTools.height - 50
    );
  };

  let mapPercentToWidth = function (percent) {
    return map(percent, 0, 100, 0, layout.plotWidth());
  };
}
