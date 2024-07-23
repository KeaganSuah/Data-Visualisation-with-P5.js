function PayGapTimeSeries() {
  /////////////////// Public Variables /////////////////////////

  // Name for the visualisation to appear in the menu bar.
  this.name = "Pay gap: 1997-2017";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "pay-gap-timeseries";

  // Title to display above the plot.
  this.title =
    "Gender Pay Gap: Average difference between male and female pay.";

  // Property to represent whether data has been loaded.
  this.loaded = false;

  /////////////////// Local Variables /////////////////////////

  // Names for each axis.
  let xAxisLabel = "year";
  let yAxisLabel = "%";

  let marginSize = 35;

  // Layout object to store all common plot layout parameters and
  // methods.
  let layout = {
    marginSize: marginSize,

    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - dataVisualisationTools.height - marginSize * 2,
    pad: 5,

    plotWidth: function () {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function () {
      return this.bottomMargin - this.topMargin;
    },

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  /////////////////// Public Methods /////////////////////////

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    this.data = loadTable(
      "./data/pay-gap/all-employees-hourly-pay-by-gender-1997-2017.csv",
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

    // Set min and max years: assumes data is sorted by date.
    this.startYear = this.data.getNum(0, "year");
    this.endYear = this.data.getNum(this.data.getRowCount() - 1, "year");

    // Find min and max pay gap for mapping to canvas height.
    this.minPayGap = 0; // Pay equality (zero pay gap).
    this.maxPayGap = max(this.data.getColumn("pay_gap"));
  };

  this.destroy = function () {};

  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }
    // Draw the background for the visualisation
    background(255);

    // Draw the title above the plot.
    drawTitle();

    // Draw all y-axis labels.
    drawYAxisTickLabels(
      this.minPayGap,
      this.maxPayGap,
      layout,
      mapPayGapToHeight.bind(this),
      0
    );

    // Draw x and y axis.
    drawAxis(layout);

    // Draw x and y axis labels.
    drawAxisLabels(xAxisLabel, yAxisLabel, layout);

    // Plot all pay gaps between startYear and endYear using the width
    // of the canvas minus margins.
    let previous;
    let numYears = this.endYear - this.startYear;

    // Loop over all rows and draw a line from the previous value to
    // the current.
    for (let i = 0; i < this.data.getRowCount(); i++) {
      // Create an object to store data for the current year.
      let current = {
        // Convert strings to numbers.
        year: this.data.getNum(i, "year"),
        payGap: this.data.getNum(i, "pay_gap"),
      };

      if (previous != null) {
        // Draw line segment connecting previous year to current
        // year pay gap.
        stroke(0);
        line(
          mapYearToWidth(previous.year),
          mapPayGapToHeight(previous.payGap),
          mapYearToWidth(current.year),
          mapPayGapToHeight(current.payGap)
        );

        // The number of x-axis labels to skip so that only
        // numXTickLabels are drawn.
        let xLabelSkip = ceil(numYears / layout.numXTickLabels);

        // Draw the tick label marking the start of the previous year.
        if (i % xLabelSkip == 0) {
          drawXAxisTickLabel(
            previous.year,
            layout,
            mapYearToWidth.bind(this),
            true
          );
        }
      }

      // Assign current year to previous year so that it is available
      // during the next iteration of this loop to give us the start
      // position of the next line segment.
      previous = current;
    }
  };

  /////////////////// Private Methods /////////////////////////

  // Declare for variables in objects for Private Methods
  var self = this;

  let drawTitle = function () {
    fill(0);
    noStroke();
    textAlign("center", "center");

    text(
      self.title,
      layout.plotWidth() / 2 + layout.leftMargin,
      layout.topMargin - layout.marginSize / 2
    );
  };

  let mapYearToWidth = function (value) {
    return map(
      value,
      self.startYear,
      self.endYear,
      layout.leftMargin, // Draw left-to-right from margin.
      layout.rightMargin
    );
  };

  let mapPayGapToHeight = function (value) {
    return map(
      value,
      self.minPayGap,
      self.maxPayGap,
      layout.bottomMargin, // Smaller pay gap at bottom.
      layout.topMargin
    ); // Bigger pay gap at top.
  };
}
