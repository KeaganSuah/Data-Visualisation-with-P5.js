function NutrientsTimeSeries() {
  /////////////////// Public Variables /////////////////////////

  // Name for the visualisation to appear in the menu bar.
  this.name = "Nutrients: 1974-2016";

  // Each visualisation must have a unique ID with no special characters.
  this.id = "nutrients-timeseries";

  // Title to display above the plot.
  this.title = "Nutrients: 1974-2016.";

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Load number of controls user has on the data
  this.controlsLabel = ["Select Nutrient", "Zoom into 2017", "Zoom into 1880"];

  this.dataHeaders = ["Nutrient", "year", "percentage"];
  this.dataList = [];
  this.gridLayout = [0.6, 0.2, 0.2];

  /////////////////// Local Variables /////////////////////////

  //Names for each axis
  const xAxisLabel = "year";
  const yAxisLabel = "%";

  // Colour list of each nutrient line
  let colors = [];

  // to set the margin size for the plot
  const marginSize = 35;

  // Legend status if click or unclick
  let legendButton = false;

  // Layout object to store all common plot layout parameters and methods.
  let layout = {
    marginSize: marginSize,
    // Locations of margin positions. Left and bottom have double margin // size due to axis and tick labels.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - dataVisualisationTools.height - marginSize * 2,

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
    dataVisualisationTools.refreshData(this.dataHeaders);

    // Set min and max years: assumes data is sorted by date.
    this.startYear = Number(this.data.columns[1]);
    this.endYear = Number(this.data.columns[this.data.columns.length - 1]);

    // Using ES6 wont make a different
    for (let i = 0; i < this.data.getRowCount(); i++) {
      colors.push(color(random(0, 200), random(0, 200), random(0, 200)));
    }

    // Set the min and max percentage,
    //do a dynamic find min and max in the data source
    this.minPercentage = 80;
    this.maxPercentage = 400;

    // Display filter selection button
    dataVisualisationToolsControl();

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
    // Draw the background for the visualisation
    background(255);

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
      layout,
      mapNutrientsToHeight.bind(this),
      0
    );

    // Draw x and y axis.
    drawAxis(layout);

    // Draw x and y axis labels.
    drawAxisLabels(xAxisLabel, yAxisLabel, layout);

    // Plot all pay gaps between startYear and endYear using the width
    // of the canvas minus margins.
    let numYears = this.endYearValue - this.startYearValue;

    // Dynamic point size to increase when zoom in
    let pointSize =
      map(self.startSlider.value(), 1974, 2016, 20, 30) -
      map(self.endSlider.value(), 1974, 2016, 0, 10);

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
            stroke(colors[i]);
            line(
              mapYearToWidth(previous.year),
              mapNutrientsToHeight(previous.percentage),
              mapYearToWidth(current.year),
              mapNutrientsToHeight(current.percentage)
            );

            // Points on line graph that can be hovered
            fill(colors[i]);
            pointHover(current, pointSize);
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
              layout,
              mapYearToWidth.bind(this),
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
            makeLegendItem(title, i, colors[i], legendButton);

            //draw the nutrients label
            fill(colors[i]);
            textSize(16);
            text(
              title,
              width - 200,
              mapNutrientsToHeight(row.getNum(numYears - 3) + 15)
            );
          }
        }
        // Assign current year to previous year so that it is available // during the next iteration of this loop to give us the start // position of the next line segment.
        previous = current;
      }
    }

    // Second Loop for data points conditions to display small data breakdown without overlapping.
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
            pointHoverCondition(current, title, pointSize);
          }
        }
        // Assign current year to previous year so that it is available // during the next iteration of this loop to give us the start // position of the next line segment.
        previous = current;
      }
    }

    // Display points hovered
    dataVisualisationTools.listDisplayData(this.dataList, this.gridLayout);

    // Draw control labels
    dataVisualisationTools.listControlLabel(this.controlsLabel);
  };

  /////////////////// Private Methods /////////////////////////

  // Declare for variables in objects for Private Methods
  var self = this;

  let mapYearToWidth = function (value) {
    return map(
      value,
      self.startYearValue,
      self.endYearValue,
      layout.leftMargin,
      layout.rightMargin
    );
  };

  let mapNutrientsToHeight = function (value) {
    return map(
      value,
      self.minPercentage,
      self.maxPercentage,
      layout.bottomMargin,
      layout.topMargin
    );
  };

  // These Methods below are done by myself (Keagan Suah) Addition Extension of the nutrients graph
  // function display the legend only when the variable legendButton is true
  let makeLegendItem = function (label, i, colour, show) {
    textAlign("left", "center");
    if (show) {
      // Private variables for the legend, showing the axis and length
      const boxWidth = 50;
      const boxHeight = 15;
      const x = 700;
      const y = 50 + (boxHeight + 2) * i;

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
  let pointHover = function (current, pointSize) {
    // Create Points on Line graph to hover on
    ellipse(
      mapYearToWidth(current.year),
      mapNutrientsToHeight(current.percentage),
      pointSize,
      pointSize
    );
  };

  let pointHoverCondition = function (current, title, pointSize) {
    let distancePoint = dist(
      mouseX,
      mouseY,
      mapYearToWidth(current.year),
      mapNutrientsToHeight(current.percentage)
    );
    if (distancePoint < pointSize / 2) {
      // Array of data belonging to the point currently being hovered
      let hoverArray = [title, current.year, `${current.percentage}%`];
      self.dataList = dataVisualisationTools.mouseHoverTable(
        hoverArray,
        self.gridLayout
      );
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
    dataVisualisationTools.designDOM(self.button);

    // Call repaint() when the button is pressed.
    self.button.mousePressed(legendButtonClick);
  };

  // Control panel label and controls
  // Display the dataVisualisationTools controls on the graph for users
  let dataVisualisationToolsControl = function () {
    makeNutrientFilter(
      dataVisualisationTools.controlXaxis,
      dataVisualisationTools.labelHeight[0]
    );

    // Create sliders to control start and end years. Default to
    // To reduce the starting range of years.
    self.startSlider = createSlider(
      self.startYear,
      self.endYear - 11,
      self.startYear,
      1
    );
    self.startSlider.position(
      dataVisualisationTools.controlXmargin +
        dataVisualisationTools.controlXaxis,
      dataVisualisationTools.labelHeight[1]
    );

    dataVisualisationTools.designDOM(self.startSlider);

    // To reduce the ending range of years.
    self.endSlider = createSlider(
      self.startYear + 11,
      self.endYear,
      self.endYear,
      1
    );
    self.endSlider.position(
      dataVisualisationTools.controlXmargin +
        dataVisualisationTools.controlXaxis,
      dataVisualisationTools.labelHeight[2]
    );
    dataVisualisationTools.designDOM(self.endSlider);
  };

  // To create the filter option button to filter the nutrients, user can pick which nutrient they would like to see
  let makeNutrientFilter = function (x, y) {
    // Create a select DOM element.
    self.filterNutrient = createSelect();
    self.filterNutrient.position(dataVisualisationTools.controlXmargin + x, y);

    dataVisualisationTools.designDOM(self.filterNutrient);
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
