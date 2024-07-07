// This extension was inspired by the interview with the pro for the data visualisation where they show dynamic bouncing ball data visualisation. I only got the inspiration for the design, but the code was design entire by myself(Keagan Suah).
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
  this.controlsLabel = ["Filter Years", "Balls Animation"];

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Private variables
  // status for the balls to bounce or to freeze on screen
  let bounceStatus = true;

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
    this.dataHeaders = ["Gender", "Age Group", "Year", "Bankrupt Amt"];
    this.dataList = [];
    this.gridLayout = [0.25, 0.25, 0.25, 0.25];
    operation.refreshData(this.dataHeaders);

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
        let size = mapAmtSize(bankruptAmt, minAmount, maxAmount);
        let speed = mapAmtSpeed(bankruptAmt, minAmount, maxAmount);
        let ageText = this.data.columns.slice(1)[i];
        yearList.push(
          new bounchingBall(
            size,
            speed,
            colour,
            gender,
            bankruptAmt,
            ageText,
            this.layout
          )
        );
      }
      this.ball.push(yearList);
    }

    // Create filter for years
    makeYearFilter();

    // Create stop animation bouncing button
    createStopButton();
  };

  // Remove the DOM functions in Data Visualisation
  this.destroy = function () {
    this.bounceButton.remove();
    this.yearFilter.remove();
  };

  this.draw = function () {
    // Draw the title above the plot.
    this.drawTitle();

    let filterValue = this.yearFilter.value();
    let years = this.data.getColumn(0);
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
        }
        // Two loops to prevent the balls to overlap with the data
        for (let i = 0; i < this.data.getColumnCount() - 1; i++) {
          // Push the data into the operation data table when points hovered
          ballHover(this.ball, years[j], j, i);
        }
      }
    }

    // Display points hovered
    operation.listDisplayData(this.dataList, this.gridLayout);

    // Draw control labels
    operation.listControlLabel(this.controlsLabel);
  };

  // Draw the standardise title on the top of the data visualisation
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

  // map value of max and min bankrupt amount to create a better range for ball size
  let mapAmtSize = function (value, min, max) {
    return map(value, min, max, 50, 150);
  };

  // map value of max and min bankrupt amount to create a better range for ball speed, bigger amount will have slower speed, small amount will have faster speed
  let mapAmtSpeed = function (value, min, max) {
    return map(value, min, max, 2, 0.5);
  };

  // When ball hovered, it changes the details array into the data on the balls
  let ballHover = function (ball, year, j, i) {
    // Function for when the balls is clicked
    let currentBall = ball[j][i];
    let distance = dist(mouseX, mouseY, currentBall.x, currentBall.y);
    if (distance < currentBall.size / 2) {
      cursor(HAND);

      let length = 330;
      let height = 88;
      let displayX = mouseX + 10;
      let displayY = mouseY + 10;

      let hoverArray = [
        currentBall.gender,
        currentBall.ageText,
        year,
        currentBall.bankruptAmt,
      ];

      if (mouseX > width - length) {
        displayX -= length + 10;
      }

      fill(200);
      rect(displayX, displayY, length, height, 4);

      textAlign();
      fill(0);
      textSize(18);
      textAlign("center");
      text("Data Preview", displayX + length / 2, displayY + 15);

      // Create boxes for the controls to be inside of
      for (let i = 0; i < 2; i++) {
        let previous = 0;
        for (let j = 0; j < self.gridLayout.length; j++) {
          if (i == 0) {
            fill(100, 100, 190);
          } else {
            fill(255);
          }
          rect(
            displayX + 2 + previous,
            displayY + 30 + 28 * i,
            length * self.gridLayout[j] - 3,
            25
          );
          previous += length * self.gridLayout[j];
        }
      }

      textSize(12);
      textAlign("left");
      // Display text and data inside boxes
      for (let j = 0; j < 2; j++) {
        let previousText = 0;
        for (let i = 0; i < operation.dataHeader.length; i++) {
          if (j == 0) {
            fill(255);
            text(
              operation.dataHeader[i],
              displayX + previousText + 5,
              displayY + 40 + 28 * j,
              length * self.gridLayout[i] - 5
            );
          } else {
            fill(0);
            textSize(14);
            text(
              hoverArray[i],
              displayX + previousText + 5,
              displayY + 45 + 28 * j,
              length * self.gridLayout[i] - 5
            );
          }
          previousText += length * self.gridLayout[i];
        }
      }

      if (operation.mouseClickStatus) {
        self.dataList = hoverArray;
      }
    }
  };

  // Create the years filter for data visualisation to display based on years
  let makeYearFilter = function () {
    // Create a select DOM element.
    self.yearFilter = createSelect();
    self.yearFilter.position(
      450 + operation.control_x_axis,
      operation.labelHeight[0]
    );

    // Fill the options with all bankruptcy years.
    let years = self.data.getColumn(0);

    // First entry is empty.
    for (let i = 0; i < years.length; i++) {
      let year = years[i];
      self.yearFilter.option(year);
    }
  };

  // Function is to change the variable legendButton so that is alternate when it is called
  let stopBounceClick = function () {
    if (bounceStatus) {
      bounceStatus = false;
    } else {
      bounceStatus = true;
    }
  };

  // Create the button that display the legend, allowing user to open and close
  let createStopButton = function () {
    self.bounceButton = createButton("Start/Stop Bouncing");
    self.bounceButton.position(
      450 + operation.control_x_axis,
      operation.labelHeight[1] - 2
    );

    // Call repaint() when the button is pressed.
    self.bounceButton.mousePressed(stopBounceClick);
  };
}
