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
  this.labelArray = ["Filter Years", "Balls Animation"];

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Private variables
  // status for the balls to bounce or to freeze on screen
  var bounceStatus = true;

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
    this.details = ["Gender", "Year", "Bankrupt Amount"];
    this.gridLayout = [0.33, 0.33, 0.33];
    operation.refreshData(this.details);

    // Get the Largest amount and smallest amount
    var maxAmount = self.getMaxAmt(this.data);
    var minAmount = self.getMinAmt(this.data);

    // Array to store all the bouncing balls objects
    this.ball = [];

    // To create the bouncing balls object and insert them into the array
    // Loop through the years
    for (let j = 0; j < this.data.getRowCount(); j++) {
      var bankruptAmtByYear = this.data.getRow(j).arr.slice(1);
      var yearList = [];
      // Loop through the age groups and genders
      for (let i = 0; i < this.data.getColumnCount() - 1; i++) {
        var colour;
        var gender;
        // Switch colours for different genders
        if (i <= 5) {
          colour = color(255, 100, 100, 235);
          gender = "Female";
        } else {
          colour = color(100, 100, 255, 235);
          gender = "Male";
        }
        // Ball details
        var bankruptAmt = bankruptAmtByYear[i];
        var size = self.mapAmtSize(bankruptAmt, minAmount, maxAmount);
        var speed = self.mapAmtSpeed(bankruptAmt, minAmount, maxAmount);
        var textAge = this.data.columns.slice(1)[i];
        yearList.push(
          new bounchingBall(
            size,
            speed,
            colour,
            gender,
            bankruptAmt,
            textAge,
            this.layout
          )
        );
      }
      this.ball.push(yearList);
    }

    // Create filter for years
    self.makeYearFilter();

    // Create stop animation bouncing button
    self.createStopButton();
  };

  // Remove the DOM functions in Data Visualisation
  this.destroy = function () {
    this.bounceButton.remove();
    this.yearFilter.remove();
  };

  this.draw = function () {
    // Draw the title above the plot.
    this.drawTitle();

    var filterValue = this.yearFilter.value();
    var years = this.data.getColumn(0);
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
          self.ballHover(this.ball, years, j, i);
        }
      }
    }

    // Display points hovered
    operation.listDisplayData(this.details, this.gridLayout);

    // Draw control labels
    operation.listControlLabel(this.labelArray);
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

  // Get the max amount among the years, age groups and gender
  self.getMaxAmt = function (data) {
    var maxNum = 0;
    for (var i = 0; i < data.getRowCount(); i++) {
      var rowList = data.getRow(i).arr.slice(1);
      rowList = stringsToNumbers(rowList);
      var maxNumList = max(rowList);
      if (maxNumList > maxNum) {
        maxNum = maxNumList;
      }
    }
    return maxNum;
  };

  // Get the min amount among the years, age groups and gender
  self.getMinAmt = function (data) {
    var minNum = 1000;
    for (var i = 0; i < data.getRowCount(); i++) {
      var rowList = data.getRow(i).arr.slice(1);
      rowList = stringsToNumbers(rowList);
      var minNumList = min(rowList);
      if (minNumList < minNum) {
        minNum = minNumList;
      }
    }
    return minNum;
  };

  // map value of max and min bankrupt amount to create a better range for ball size
  self.mapAmtSize = function (value, min, max) {
    return map(value, min, max, 50, 150);
  };

  // map value of max and min bankrupt amount to create a better range for ball speed, bigger amount will have slower speed, small amount will have faster speed
  self.mapAmtSpeed = function (value, min, max) {
    return map(value, min, max, 2, 0.5);
  };

  // When ball hovered, it changes the details array into the data on the balls
  self.ballHover = function (ball, years, j, i) {
    // Function for when the balls is clicked
    var currentBall = ball[j][i];
    var distance = dist(mouseX, mouseY, currentBall.x, currentBall.y);
    if (distance < currentBall.size / 2) {
      cursor(HAND);

      var length = 200;
      var height = 75;

      fill(200);
      rect(mouseX, mouseY, length, height, 4);

      textAlign();
      fill(0);
      text("Data Preview", mouseX + length / 2, mouseY + 15);

      // Create boxes for the controls to be inside of
      for (var i = 0; i < 2; i++) {
        var previous = 0;
        for (var j = 0; j < this.gridLayout.length; j++) {
          if (i == 0) {
            fill(100, 100, 190);
          } else {
            fill(255);
          }
          rect(
            mouseX + 2 + previous,
            mouseY + 30 + 23 * i,
            length * this.gridLayout[j] - 2,
            20
          );
          previous += length * this.gridLayout[j];
        }
      }

      this.details = [currentBall.gender, years[j], currentBall.bankruptAmt];
    }
  };

  // Create the years filter for data visualisation to display based on years
  self.makeYearFilter = function () {
    // Create a select DOM element.
    this.yearFilter = createSelect();
    this.yearFilter.position(
      450 + operation.control_x_axis,
      operation.labelHeight[0]
    );

    // Fill the options with all bankruptcy years.
    var years = this.data.getColumn(0);

    // First entry is empty.
    for (let i = 0; i < years.length; i++) {
      var year = years[i];
      this.yearFilter.option(year);
    }
  };

  // Function is to change the variable legendButton so that is alternate when it is called
  self.stopBounceClick = function () {
    if (bounceStatus) {
      bounceStatus = false;
    } else {
      bounceStatus = true;
    }
  };

  // Create the button that display the legend, allowing user to open and close
  self.createStopButton = function () {
    this.bounceButton = createButton("Start/Stop Bouncing");
    this.bounceButton.position(
      450 + operation.control_x_axis,
      operation.labelHeight[1] - 2
    );

    // Call repaint() when the button is pressed.
    this.bounceButton.mousePressed(self.stopBounceClick);
  };
}
