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

  // The status for the mouse click function, if true, it will register the data into the data table
  this.mouseClickStatus = false;

  // Nested array to keep array of data
  this.dataBreakdown = [];

  // To list out the label for all the controls
  this.listControlLabel = function (array) {
    controlPanel(array);
    // Draw operation label
    textAlign("left");
    textSize(16);
    fill(0);
    noStroke();
    for (var i = 0; i < array.length; i++) {
      text(array[i], operation.control_x_axis, operation.labelHeight[i]);
    }
  };

  // To display and list out all the data in the data breakdown table
  this.listDisplayData = function (array, gridLayout) {
    var length = 495;
    displayData();

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
    dataQueueCondition(array);

    stroke(1);
  };

  // Refresh the data breakdown table
  this.refreshData = function (array) {
    this.dataBreakdown = [array];
  };

  /////////////////// Private Functions /////////////////////////

  // Declare for variables in objects for private functions
  var self = this;

  // Display title on the control panel and on data breakdown box
  var displayTitle = function (title, x, y) {
    fill(0);
    noStroke();
    textSize(20);
    textAlign("center", "center");
    text(title, x, y);
  };

  //   Draw the control panel
  var controlPanel = function (labelArray) {
    // Only draw is the label array exists
    fill(210);
    noStroke();
    rect(self.x, self.y, width / 2 - 120, self.height - 10, 10);

    fill(255);
    // Create boxes for the controls to be inside of
    for (var i = 0; i < labelArray.length; i++) {
      rect(self.x + 20, self.y + 50 + 45 * i, 140, 35);
      rect(self.x + 20 + 145, self.y + 50 + 45 * i, width / 2 - 300, 35);
    }

    displayTitle("Control Panel", self.x + (width / 2 - 120) / 2, self.y + 30);
  };

  //   Draw the data table
  var displayData = function () {
    // Design of overall table
    fill(210);
    noStroke();
    rect(self.x + (width / 2 - 100), self.y, width / 2, self.height - 10, 10);

    // Display title on the top
    displayTitle(
      "Data Breakdown (Click on Points)",
      self.x + (width / 2 - 100) + (width / 2 - 20) / 2,
      self.y + 30
    );
  };

  // Condition for the data points to be added into the table
  var dataQueueCondition = function (array) {
    // to start the first data hovered
    if (self.dataBreakdown.length == 1) {
      if (self.dataBreakdown[0][1] != array[1]) {
        self.dataBreakdown.splice(1, 0, array);
      }
    }
    // For any other new data hovered, add into the queue of data for the data table
    else {
      if (
        self.dataBreakdown[1][1] != array[1] ||
        self.dataBreakdown[1][2] != array[2]
      ) {
        // If the queue have reached max, add from the front and remove the last
        if (self.dataBreakdown.length == 4) {
          self.dataBreakdown.splice(1, 0, array);
          self.dataBreakdown.pop();
        } else {
          self.dataBreakdown.splice(1, 0, array);
        }
      }
    }
  };
}
