function NutrientsTimeSeries() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Nutrients: 1974-2016";

  // Each visualisation must have a unique ID with no special characters.
  this.id = "nutrients-timeseries";

  // Title to display above the plot.
  this.title = "Nutrients: 1974-2016.";

  //Names for each axis
  this.xAxisLabel = "year";
  this.yAxisLabel = "%";

  // Colour list of each nutrient line
  this.colors = [];

  // Declare for variables in objects for private functions
  var self = this;

  // Private variables
  // to set the margin size for the plot
  let marginSize = 35;

  // Legend status if click or unclick
  let legendButton = false;

  // Load number of controls user has on the data
  this.controlsLabel = ["Select Nutrient", "Zoom into 2017", "Zoom into 1880"];

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
    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on // top of one another.
    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  // Property to represent whether data has been loaded.
  this.loaded = false;

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
    this.dataHeaders = ["Nutrient", "year", "percentage"];
    this.dataList = [];
    this.gridLayout = [0.6, 0.2, 0.2];
    operation.refreshData(this.dataHeaders);

    // Set min and max years: assumes data is sorted by date.
    this.startYear = Number(this.data.columns[1]);
    this.endYear = Number(this.data.columns[this.data.columns.length - 1]);

    // Using ES6 wont make a different
    for (let i = 0; i < this.data.getRowCount(); i++) {
      this.colors.push(color(random(0, 200), random(0, 200), random(0, 200)));
    }

    // Set the min and max percentage,
    //do a dynamic find min and max in the data source
    this.minPercentage = 80;
    this.maxPercentage = 400;

    // Display filter selection button
    operationControl();

    // Display Legend button
    createLegendButton();
  };

  this.destroy = function () {
    this.filterNutrient.remove();
    this.button.remove();
    this.startSlider.remove();
    this.endSlider.remove();
  };

  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Draw the title above the plot.
    this.drawTitle();

    // Prevent slider ranges overlapping.
    if (this.startSlider.value() >= this.endSlider.value() - 10) {
      this.startSlider.value(this.endSlider.value() - 11);
    }
    // Get the value from user to see what are the year range user want to see, similar to climate-change visualisation
    this.startYearValue = this.startSlider.value();
    this.endYearValue = this.endSlider.value();

    // Draw all y-axis labels.
    drawYAxisTickLabels(
      this.minPercentage,
      this.maxPercentage,
      this.layout,
      this.mapNutrientsToHeight.bind(this),
      0
    );

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);

    // Plot all pay gaps between startYear and endYear using the width
    // of the canvas minus margins.
    let numYears = this.endYearValue - this.startYearValue;

    // Loop over all rows and draw a line from the previous value to // the current.
    for (let i = 0; i < this.data.getRowCount(); i++) {
      let row = this.data.getRow(i);
      let previous = null;
      let title = row.getString(0);

      for (let j = 1; j < numYears; j++) {
        // Create an object to store data for the current year.
        let current = {
          // Convert strings to numbers.
          year: this.startYearValue + j - 1,
          percentage: row.getNum(j + (this.startYearValue - this.startYear)),
        };

        if (previous != null) {
          if (
            this.filterNutrient.value() == title ||
            this.filterNutrient.value() == "All"
          ) {
            // Draw line segment connecting previous year to current
            // year pay gap.
            stroke(this.colors[i]);
            line(
              this.mapYearToWidth(previous.year),
              this.mapNutrientsToHeight(previous.percentage),
              this.mapYearToWidth(current.year),
              this.mapNutrientsToHeight(current.percentage)
            );

            // Points on line graph that can be hovered
            pointHover(current, title);
          }

          // The number of x-axis labels to skip so that only
          // numXTickLabels are drawn.
          let xLabelSkip = this.data.rows.length;

          // Draw the tick label marking the start of the previous year.
          if (i % xLabelSkip == 0) {
            // variable to determine if the variable has to be displayed or not
            let displayLabel = true;
            if (
              previous.year == this.endYearValue - 3 ||
              previous.year % 5 == 0
            ) {
              displayLabel = true;
            } else {
              displayLabel = false;
            }
            // Create vertical grid line, label at the bottom depends on the value of displayLabel variable
            drawXAxisTickLabel(
              previous.year,
              this.layout,
              this.mapYearToWidth.bind(this),
              displayLabel
            );
          }
        } else {
          if (
            this.filterNutrient.value() == title ||
            this.filterNutrient.value() == "All"
          ) {
            noStroke();
            // draw nutrients legend table
            makeLegendItem(title, i, this.colors[i], legendButton);

            //draw the nutrients label
            fill(this.colors[i]);
            text(
              title,
              width - 200,
              this.mapNutrientsToHeight(row.getNum(numYears - 3) + 15)
            );
          }
        }
        // Assign current year to previous year so that it is available // during the next iteration of this loop to give us the start // position of the next line segment.
        previous = current;
      }
    }

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

  this.mapYearToWidth = function (value) {
    return map(
      value,
      this.startYearValue,
      this.endYearValue,
      this.layout.leftMargin,
      this.layout.rightMargin
    );
  };

  this.mapNutrientsToHeight = function (value) {
    return map(
      value,
      this.minPercentage,
      this.maxPercentage,
      this.layout.bottomMargin,
      this.layout.topMargin
    );
  };

  /////////////////// Private Functions /////////////////////////
  // Addition Extension of the nutrients graph
  // function display the legend only when the variable legendButton is true
  let makeLegendItem = function (label, i, colour, show) {
    textAlign("left", "center");
    if (show) {
      // Private variables for the legend, showing the axis and length
      let boxWidth = 50;
      let boxHeight = 15;
      let x = 700;
      let y = 50 + (boxHeight + 2) * i;

      fill(245);
      rect(x, y, 250, 20);

      // Draw the legend box with colours
      noStroke();
      fill(colour);
      rect(x, y, boxWidth, boxHeight);

      // Display the text beside the legend box
      fill(0);
      noStroke();
      textSize(14);
      text(label, x + boxWidth + 10, y + boxHeight / 2);
      // Reset back the font size
      textSize(16);
    }
  };

  // Create points on line graph that can be hovered to display breakdown of data in each point
  let pointHover = function (current, title) {
    let pointSize =
      map(self.startSlider.value(), 1974, 2016, 20, 30) -
      map(self.endSlider.value(), 1974, 2016, 0, 10);
    // Create Points on Line graph to hover on
    ellipse(
      self.mapYearToWidth(current.year),
      self.mapNutrientsToHeight(current.percentage),
      pointSize,
      pointSize
    );
    let distancePoint = dist(
      mouseX,
      mouseY,
      self.mapYearToWidth(current.year),
      self.mapNutrientsToHeight(current.percentage)
    );
    if (distancePoint < pointSize / 2) {
      cursor(HAND);
      // Display Industry and values
      if (operation.mouseClickStatus) {
        self.dataList = [title, current.year, `${current.percentage}%`];
      }
    }
  };

  // Function is to change the variable legendButton so that is alternate when it is called
  let legendButtonClick = function () {
    if (legendButton) {
      legendButton = false;
    } else {
      legendButton = true;
    }
  };

  // Create the button that display the legend, allowing user to open and close
  let createLegendButton = function () {
    self.button = createButton("Show Legend");
    self.button.position(width + 130, 12);

    // Call repaint() when the button is pressed.
    self.button.mousePressed(legendButtonClick);
  };

  // Control panel label and controls
  // Display the operation controls on the graph for users
  let operationControl = function () {
    makeNutrientFilter(operation.control_x_axis, operation.labelHeight[0]);

    // Create sliders to control start and end years. Default to
    // To reduce the starting range of years.
    self.startSlider = createSlider(
      self.startYear,
      self.endYear - 11,
      self.startYear,
      1
    );
    self.startSlider.position(
      450 + operation.control_x_axis,
      operation.labelHeight[1]
    );

    // To reduce the ending range of years.
    self.endSlider = createSlider(
      self.startYear + 11,
      self.endYear,
      self.endYear,
      1
    );
    self.endSlider.position(
      450 + operation.control_x_axis,
      operation.labelHeight[2]
    );
  };

  // To create the filter option button to filter the nutrients, user can pick which nutrient they would like to see
  let makeNutrientFilter = function (x, y) {
    // Create a select DOM element.
    self.filterNutrient = createSelect();
    self.filterNutrient.position(450 + x, y);

    // Fill the options with all company names.
    let nutrients = self.data.rows;

    // Fill all first
    self.filterNutrient.option("All");

    // First entry is empty.
    // Use ES6 method of taking element in array instead of by index
    for (let nutrient of nutrients) {
      let nutrientString = nutrient.getString(0);
      self.filterNutrient.option(nutrientString);
    }
  };
}
