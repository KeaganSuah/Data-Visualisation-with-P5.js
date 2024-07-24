function ClimateChange() {
  /////////////////// Public Variables /////////////////////////

  // Name for the visualisation to appear in the menu bar.
  this.name = "Climate Change";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "climate-change";

  // Title to display above the plot.
  this.title = "Climate Change: 1880 - 2018";

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Load number of controls user has on the data
  this.controlsLabel = ["Zoom into 2017", "Zoom into 1880"];

  this.dataHeaders = ["degree celsius", "percentage"];
  this.dataList = [];
  this.gridLayout = [0.5, 0.5];

  /////////////////// Local Variables /////////////////////////

  // Create the margin gap for data visualisation
  let marginSize = 35;

  // Names for each axis.
  let xAxisLabel = "year";
  const drawLeftTitle = "℃";

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
    grid: false,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 8,
    numYTickLabels: 8,
  };

  /////////////////// Public Methods /////////////////////////

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    this.data = loadTable(
      "./data/surface-temperature/surface-temperature.csv",
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
    textAlign("center", "center");

    // Reset the data table for new data visualisation
    dataVisualisationTools.refreshData(this.dataHeaders);

    // Set min and max years: assumes data is sorted by year.
    this.minYear = this.data.getNum(0, "year");
    this.maxYear = this.data.getNum(this.data.getRowCount() - 1, "year");

    // Find min and max temperature for mapping to canvas height.
    this.minTemperature = min(this.data.getColumn("temperature"));
    this.maxTemperature = max(this.data.getColumn("temperature"));

    // Find mean temperature to plot average marker.
    this.meanTemperature = mean(this.data.getColumn("temperature"));

    // Count the number of frames drawn since the visualisation
    // started so that we can animate the plot.
    this.frameCount = 0;

    dataVisualisationToolsControl(this.minYear, this.maxYear);
  };

  this.destroy = function () {
    this.startSlider.remove();
    this.endSlider.remove();
  };

  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }
    // Draw the background for the visualisation
    background(255);

    // Draw control labels
    dataVisualisationTools.listControlLabel(this.controlsLabel);

    // Display points hovered
    dataVisualisationTools.listDisplayData(this.dataList, this.gridLayout);
    // reset textsize
    textSize(16);

    // Prevent slider ranges overlapping.
    if (this.startSlider.value() >= this.endSlider.value()) {
      this.startSlider.value(this.endSlider.value() - 1);
    }
    this.startYear = this.startSlider.value();
    this.endYear = this.endSlider.value();

    // Draw all y-axis tick labels.
    drawYAxisTickLabels(
      this.minTemperature,
      this.maxTemperature,
      layout,
      mapTemperatureToHeight.bind(this),
      1
    );

    // Draw x and y axis.
    drawAxis(layout);

    // Draw x and y axis labels.
    drawAxisLabels(xAxisLabel, drawLeftTitle, layout);

    // Plot average line.
    stroke(200);
    strokeWeight(1);
    line(
      layout.leftMargin,
      mapTemperatureToHeight(this.meanTemperature),
      layout.rightMargin,
      mapTemperatureToHeight(this.meanTemperature)
    );

    // Plot all temperatures between startYear and endYear using the
    // width of the canvas minus margins.
    let previous;
    let numYears = this.endYear - this.startYear;
    let segmentWidth = layout.plotWidth() / numYears;

    // Count the number of years plotted each frame to create
    // animation effect.
    let yearCount = 0;

    // my own extension
    let pointSize =
      map(self.startSlider.value(), 1880, 2017, 20, 30) -
      map(self.endSlider.value(), 1880, 2017, 0, 10);

    // Loop over all rows but only plot those in range.
    for (let i = 0; i < this.data.getRowCount(); i++) {
      // Create an object to store data for the current year.
      let current = {
        // Convert strings to numbers.
        year: this.data.getNum(i, "year"),
        temperature: this.data.getNum(i, "temperature"),
      };

      if (
        previous != null &&
        current.year > this.startYear &&
        current.year <= this.endYear
      ) {
        // Draw background gradient to represent colour temperature of
        // the current year.
        noStroke();
        fill(mapTemperatureToColour(current.temperature));
        rect(
          mapYearToWidth(previous.year),
          layout.topMargin,
          segmentWidth,
          layout.plotHeight()
        );

        // Draw line segment connecting previous year to current
        // year temperature.
        stroke(0);
        line(
          mapYearToWidth(previous.year),
          mapTemperatureToHeight(previous.temperature),
          mapYearToWidth(current.year),
          mapTemperatureToHeight(current.temperature)
        );

        // my own extension
        temperaturePoints(previous, pointSize);

        // The number of x-axis labels to skip so that only
        // numXTickLabels are drawn.
        let xLabelSkip = ceil(numYears / layout.numXTickLabels);

        // Draw the tick label marking the start of the previous year.
        if (yearCount % xLabelSkip == 0) {
          drawXAxisTickLabel(
            previous.year,
            layout,
            mapYearToWidth.bind(this),
            true
          );
        }

        // When six or fewer years are displayed also draw the final
        // year x tick label.
        if (numYears <= 6 && yearCount == numYears - 1) {
          drawXAxisTickLabel(
            current.year,
            layout,
            mapYearToWidth.bind(this),
            true
          );
        }

        yearCount++;
      }

      // Stop drawing this frame when the number of years drawn is
      // equal to the frame count. This creates the animated effect
      // over successive frames.
      if (yearCount >= this.frameCount) {
        break;
      }

      // Assign current year to previous year so that it is available
      // during the next iteration of this loop to give us the start
      // position of the next line segment.
      previous = current;
    }

    // Second Loop for data points conditions to display small data breakdown without overlapping.
    for (let i = 0; i < this.data.getRowCount(); i++) {
      // Create an object to store data for the current year.
      let current = {
        // Convert strings to numbers.
        year: this.data.getNum(i, "year"),
        temperature: this.data.getNum(i, "temperature"),
      };

      if (
        previous != null &&
        current.year > this.startYear &&
        current.year <= this.endYear
      ) {
        // Hovering conditons and design
        temperaturePointsHovered(pointSize, current, previous);
      }

      // Assign current year to previous year so that it is available
      // during the next iteration of this loop to give us the start
      // position of the next line segment.
      previous = current;
    }

    // Count the number of frames since this visualisation
    // started. This is used in creating the animation effect and to
    // stop the main p5 draw loop when all years have been drawn.
    this.frameCount++;

    // Stop animation when all years have been drawn.
    if (this.frameCount >= numYears) {
      //noLoop();
    }
  };

  /////////////////// Private Methods /////////////////////////
  // These Methods below are done by myself (Keagan Suah)

  // Declare for variables in objects for Private Methods
  var self = this;

  let mapYearToWidth = function (value) {
    return map(
      value,
      self.startYear,
      self.endYear,
      layout.leftMargin, // Draw left-to-right from margin.
      layout.rightMargin
    );
  };

  let mapTemperatureToHeight = function (value) {
    return map(
      value,
      self.minTemperature,
      self.maxTemperature,
      layout.bottomMargin, // Lower temperature at bottom.
      layout.topMargin
    ); // Higher temperature at top.
  };

  let mapTemperatureToColour = function (value) {
    let red = map(value, self.minTemperature, self.maxTemperature, 0, 255);
    let blue = 255 - red;
    return color(red, 0, blue, 100);
  };

  // Private Method, design and display the points of the graph
  let temperaturePoints = function (previous, pointSize) {
    // Draw the Points on the line
    fill(255);
    ellipse(
      mapYearToWidth(previous.year),
      mapTemperatureToHeight(previous.temperature),
      pointSize,
      pointSize
    );
  };

  // Private Method, When the temperature points is hovered, display text on to the middle of the canvas
  let temperaturePointsHovered = function (size, current, previous) {
    // Distance between the mouse coords and the point coords

    let distance = dist(
      mouseX,
      mouseY,
      mapYearToWidth(previous.year),
      mapTemperatureToHeight(previous.temperature)
    );

    // When conditions are met, draw the value on the canvas
    if (distance < size / 2) {
      // Array of data belonging to the point currently being hovered
      let hoverArray = [
        `${current.temperature} degree celsius`,
        `During ${current.year}`,
      ];
      self.dataList = dataVisualisationTools.mouseHoverTable(
        hoverArray,
        self.gridLayout
      );
    }
  };

  // Control panel label and controls
  // Display the dataVisualisationTools controls on the graph for users
  let dataVisualisationToolsControl = function (min, max) {
    // Create sliders to control start and end years. Default to
    // visualise full range.
    self.startSlider = createSlider(min, max - 1, min, 1);
    self.startSlider.position(
      dataVisualisationTools.controlXmargin +
        dataVisualisationTools.controlXaxis,
      dataVisualisationTools.labelHeight[0]
    );

    self.endSlider = createSlider(min + 1, max, max, 1);
    self.endSlider.position(
      dataVisualisationTools.controlXmargin +
        dataVisualisationTools.controlXaxis,
      dataVisualisationTools.labelHeight[1]
    );
  };
}
