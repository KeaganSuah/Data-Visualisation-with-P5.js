// This extension was inspired by the interview with the pro for the data visualisation where they show dynamic bouncing ball data visualisation. I only got the inspiration for the design, but the code was design entire by myself(Keagan Suah).
function bankruptDyanmicBall() {
  /////////////////// Public Variables /////////////////////////

  // Name for the visualisation to appear in the menu bar.
  this.name = "Bankruptcy: 2000-2018";

  // Each visualisation must have a unique ID with no special characters.
  this.id = "bankruptcy-dyanmicball";

  // Title to display above the plot.
  this.title = "Bankruptcy Amount by Age & Sex: 2000-2018";

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Load number of controls user has on the data
  this.controlsLabel = ["Filter Years", "Balls Animation", "Balls Speed"];

  this.dataHeaders = ["Gender", "Age Group", "Year", "Bankrupt Amt"];
  this.dataList = [];
  this.gridLayout = [0.25, 0.25, 0.25, 0.25];

  /////////////////// Local Variables /////////////////////////

  // status for the balls to bounce or to freeze on screen
  let bounceStatus = true;

  // to set the margin size for the plot
  let marginSize = 35;

  // Get the previous speed of the ball
  let previousSpeed = 0;
  // Get the previous year of the filter the user change
  let previousYear = 2000;

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
  };

  // Preload the data. This function is called automatically by the // gallery when a visualisation is added.
  this.preload = function () {
    let self = this;
    this.data = loadTable(
      "./data/Bankruptcy/Bankruptcy_by_Age_&_Gender_2000-2018.csv",
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

    // Get the Largest amount and smallest amount
    let maxAmount = MinMaxAmt(this.data, 0, max);
    let minAmount = MinMaxAmt(this.data, maxAmount, min);

    // Array to store all the bouncing balls objects
    this.ball = [];

    // To create the bouncing balls object and insert them into the array
    // Loop through the years
    for (let j = 0; j < this.data.getRowCount(); j++) {
      let bankruptAmtByYear = this.data.getRow(j).arr.slice(1);
      let yearList = [];
      // Loop through the age groups and genders
      for (let i = 0; i < this.data.getColumnCount() - 1; i++) {
        let colour;
        let gender;
        // Switch colours for different genders
        if (i <= 5) {
          colour = color(255, 100, 100, 235);
          gender = "Female";
        } else {
          colour = color(100, 100, 255, 235);
          gender = "Male";
        }
        // Ball dataHeaders
        let bankruptAmt = bankruptAmtByYear[i];
        let size = map(bankruptAmt, minAmount, maxAmount, 50, 150);
        let speed = map(bankruptAmt, minAmount, maxAmount, 2, 0.1);
        let ageText = this.data.columns.slice(1)[i];
        yearList.push(
          new bounchingBall(
            size,
            speed,
            colour,
            gender,
            bankruptAmt,
            ageText,
            layout
          )
        );
      }
      this.ball.push(yearList);
    }

    // Create Speed Slider
    createSpeedSlider();

    // Create filter for years
    makeYearFilter();

    // Create stop animation bouncing button
    createStopButton();
  };

  // Remove the DOM functions in Data Visualisation
  this.destroy = function () {
    this.bounceButton.remove();
    this.yearFilter.remove();
    this.speedSlider.remove();
  };

  this.draw = function () {
    // Draw the background for the visualisation
    background(255);

    let filterValue = this.yearFilter.value();
    let years = this.data.getColumn(0);
    let updateSpeed = this.speedSlider.value();
    // Loop through the years
    for (let j = 0; j < this.data.getRowCount(); j++) {
      // Display the ball according to the year that is filtered
      if (years[j] == filterValue) {
        // Loop through the age groups and genders
        for (let i = 0; i < this.data.getColumnCount() - 1; i++) {
          this.ball[j][i].draw();
          this.ball[j][i].displayText();
          this.ball[j][i].checkCondition();
          this.ball[j][i].ballAcceleration(bounceStatus);
          if (updateSpeed != previousSpeed || filterValue != previousYear) {
            this.ball[j][i].increaseSpeed(updateSpeed);
          }
        }
        // Two loops to prevent the balls to overlap with the data
        for (let i = 0; i < this.data.getColumnCount() - 1; i++) {
          // Push the data into the dataVisualisationTools data table when points hovered
          ballHover(this.ball, years[j], j, i);
        }
      }
    }
    // Update the previous speed with the new speed the user selected
    previousSpeed = updateSpeed;
    previousYear = filterValue;

    // Display points hovered
    dataVisualisationTools.listDisplayData(this.dataList, this.gridLayout);

    // Draw control labels
    dataVisualisationTools.listControlLabel(this.controlsLabel);
  };

  /////////////////// Private Methods /////////////////////////

  // Declare for variables in objects for Private Methods
  var self = this;

  // Get the max amount among the years, age groups and gender, using Higher Order Function
  let MinMaxAmt = function (data, value, fn) {
    for (let i = 0; i < data.getRowCount(); i++) {
      let rowList = data.getRow(i).arr.slice(1);
      rowList = stringsToNumbers(rowList);
      let valueInList = fn(rowList);
      value = fn(value, valueInList);
    }
    return value;
  };

  // When ball hovered, it changes the details array into the data on the balls
  let ballHover = function (ball, year, j, i) {
    // Function for when the balls is clicked
    let currentBall = ball[j][i];
    let distance = dist(mouseX, mouseY, currentBall.x, currentBall.y);

    if (distance < currentBall.size / 2) {
      // Array of data belonging to the point currently being hovered
      let hoverArray = [
        currentBall.gender,
        currentBall.ageText,
        year,
        currentBall.bankruptAmt,
      ];

      self.dataList = dataVisualisationTools.mouseHoverTable(
        hoverArray,
        self.gridLayout
      );
    }
  };

  // Create the years filter for data visualisation to display based on years
  let makeYearFilter = function () {
    // Create a select DOM element.
    self.yearFilter = createSelect();
    self.yearFilter.position(
      dataVisualisationTools.controlXmargin +
        dataVisualisationTools.controlXaxis,
      dataVisualisationTools.labelHeight[0]
    );

    // Fill the options with all bankruptcy years.
    let years = self.data.getColumn(0);

    // First entry is empty.
    for (let i = 0; i < years.length; i++) {
      let year = years[i];
      self.yearFilter.option(year);
    }
  };

  let createSpeedSlider = function () {
    self.speedSlider = createSlider(0.2, 3, 1, 0.2);
    self.speedSlider.position(
      dataVisualisationTools.controlXmargin +
        dataVisualisationTools.controlXaxis,
      dataVisualisationTools.labelHeight[2]
    );
  };

  // Function is to change the variable legendButton so that is alternate when it is called
  let stopBounceClick = function () {
    if (bounceStatus) {
      bounceStatus = false;
    } else {
      bounceStatus = true;
    }
  };

  // Create the button that start and stop the ball movement animation
  let createStopButton = function () {
    self.bounceButton = createButton("Start/Stop Bouncing");
    self.bounceButton.position(
      dataVisualisationTools.controlXmargin +
        dataVisualisationTools.controlXaxis,
      dataVisualisationTools.labelHeight[1] - 2
    );

    // Call repaint() when the button is pressed.
    self.bounceButton.mousePressed(stopBounceClick);
  };
}
