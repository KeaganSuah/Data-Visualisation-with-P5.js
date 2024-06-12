function Operation() {
  // set the height of the operation table
  this.height = 200;
  //   set the coordinates of the operation table
  this.x = 70;
  this.y = 576;

  // Placement of label to boxs
  this.control_x_axis = this.x + 30;
  this.data_x_axis = this.x + 425;
  this.labelHeight = [this.y + 68, this.y + 113, this.y + 158];

  // Nested array to keep array of data
  this.dataBreakdown = [];

  // Declare for private functions
  var self = this;

  //   Draw the control panel
  self.controlPanel = function (labelArray) {
    // Only draw is the label array exists
    fill(210);
    noStroke();
    rect(this.x, this.y, width / 2 - 120, this.height - 10, 10);

    fill(255);
    // Create boxes for the controls to be inside of
    for (var i = 0; i < labelArray.length; i++) {
      rect(this.x + 20, this.y + 50 + 45 * i, 140, 35);
      rect(this.x + 20 + 145, this.y + 50 + 45 * i, width / 2 - 300, 35);
    }

    self.displayTitle(
      "Control Panel",
      this.x + (width / 2 - 120) / 2,
      this.y + 30
    );
  };

  // To list out the label for all the controls
  this.listControlLabel = function (array) {
    self.controlPanel(array);
    // Draw operation label
    textAlign("left");
    textSize(16);
    fill(0);
    noStroke();
    for (var i = 0; i < array.length; i++) {
      text(array[i], operation.control_x_axis, operation.labelHeight[i]);
    }
  };

  //   Draw the data table
  self.displayData = function () {
    // Design of overall table
    fill(210);
    noStroke();
    rect(this.x + (width / 2 - 100), this.y, width / 2, this.height - 10, 10);

    // Display title on the top
    this.displayTitle(
      "Data Breakdown",
      this.x + (width / 2 - 100) + (width / 2 - 20) / 2,
      this.y + 30
    );
  };

  // To display and list out all the data in the data breakdown table
  this.listDisplayData = function (array, gridLayout) {
    var length = 495;
    self.displayData();

    // Display Industry and values
    textAlign("left");
    textSize(16);
    fill(0);
    noStroke();

    // Create boxes for the controls to be inside of
    for (var i = 0; i < 4; i++) {
      var previous = 0;
      for (var j = 0; j < gridLayout.length; j++) {
        if (i == 0) {
          fill(100, 100, 190);
        } else {
          fill(255);
        }
        rect(
          operation.data_x_axis + previous,
          this.y + 45 + 35 * i,
          length * gridLayout[j] - 5,
          30
        );
        previous += length * gridLayout[j];
      }
    }

    // Display text and data inside boxes
    for (var j = 0; j < this.dataBreakdown.length; j++) {
      var previousText = 0;
      for (var i = 0; i < this.dataBreakdown[j].length; i++) {
        if (j == 0) {
          fill(255);
        } else {
          fill(0);
        }
        text(
          this.dataBreakdown[j][i],
          operation.data_x_axis + previousText + 5,
          this.y + 60 + 35 * j,
          length * gridLayout[i] - 5
        );
        previousText += length * gridLayout[i];
      }
    }

    // To add the datas inside the data table
    self.dataQueueCondition(array);

    stroke(1);
  };

  // Condition for the data points to be added into the table
  self.dataQueueCondition = function (array) {
    // to start the first data hovered
    if (this.dataBreakdown.length == 1) {
      if (this.dataBreakdown[0][1] != array[1]) {
        this.dataBreakdown.splice(1, 0, array);
      }
    }
    // For any other new data hovered, add into the queue of data for the data table
    else {
      if (
        this.dataBreakdown[1][1] != array[1] ||
        this.dataBreakdown[1][2] != array[2]
      ) {
        // If the queue have reached max, add from the front and remove the last
        if (this.dataBreakdown.length == 4) {
          this.dataBreakdown.splice(1, 0, array);
          this.dataBreakdown.pop();
        } else {
          this.dataBreakdown.splice(1, 0, array);
        }
      }
    }
  };

  // Display title on the control panel and on data breakdown box
  self.displayTitle = function (title, x, y) {
    fill(0);
    noStroke();
    textSize(20);
    textAlign("center", "center");
    text(title, x, y);
  };

  // Refresh the data breakdown table
  this.refreshData = function (array) {
    this.dataBreakdown = [array];
  };
}
