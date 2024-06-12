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

  var selectedInput = 2;

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
    this.details = ["Nutrient", "year", "percentage"];
    operation.refreshData(this.details);

    // Get the Largest amount and smallest amount
    var maxAmount = self.getMaxAmt(this.data);
    var minAmount = self.getMinAmt(this.data);

    // Array to store all the bouncing balls objects
    this.ball = [];

    for (let j = 0; j < this.data.getRowCount(); j++) {
      var bankruptAmtByYear = this.data.getRow(j).arr.slice(1);
      var yearList = [];
      for (let i = 0; i < this.data.getColumnCount() - 1; i++) {
        var colour;
        if (i <= 6) {
          colour = color(255, 100, 100, 235);
        } else {
          colour = color(100, 100, 255, 235);
        }
        var size = self.mapAmtSize(bankruptAmtByYear[i], minAmount, maxAmount);
        var speed = self.mapAmtSpeed(
          bankruptAmtByYear[i],
          minAmount,
          maxAmount
        );
        yearList.push(new bounchingBall(size, speed, colour, this.layout));
      }
      this.ball.push(yearList);
    }
  };

  this.destroy = function () {};

  this.draw = function () {
    // Draw the title above the plot.
    this.drawTitle();

    for (let j = 0; j < this.data.getRowCount(); j++) {
      if (j == selectedInput) {
        for (let i = 0; i < this.data.getColumnCount() - 1; i++) {
          this.ball[j][i].draw();
          this.ball[j][i].checkCondition();
          this.ball[j][i].ballAcceleration(false);
        }
      }
    }

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

  self.mapAmtSize = function (value, min, max) {
    return map(value, min, max, 50, 300);
  };

  self.mapAmtSpeed = function (value, min, max) {
    return map(value, min, max, 1, 15);
  };
}
