// This operation object is used to improve the overall UI/UX design of the data visualisation. This entire object is done by myself (Keagan Suah)
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

  // Array for data table headers
  this.dataHeader = [];

  /////////////////// Public Methods /////////////////////////

  // To list out the label for all the controls
  this.listControlLabel = function (array) {
    controlPanel(array);
    // Draw operation label
    textAlign("left");
    textSize(16);
    fill(0);
    noStroke();
    // unable to use ES6 as index is important
    for (let i = 0; i < array.length; i++) {
      text(array[i], this.control_x_axis, this.labelHeight[i]);
    }
  };

  // To display and list out all the data in the data breakdown table
  this.listDisplayData = function (array, gridLayout) {
    let length = 495;
    displayData();

    // Display Industry and values
    textAlign("left");
    textSize(16);
    fill(0);
    noStroke();

    // Create boxes for the controls to be inside of
    for (let i = 0; i < 4; i++) {
      let previous = 0;
      for (let j = 0; j < gridLayout.length; j++) {
        if (i == 0) {
          fill(100, 100, 190);
        } else {
          fill(255);
        }
        rect(
          this.data_x_axis + previous,
          this.y + 45 + 35 * i,
          length * gridLayout[j] - 5,
          30
        );
        previous += length * gridLayout[j];
      }
    }

    // Display Data Headers
    displayTextRow(this.dataHeader, gridLayout, color(255), length, 0);

    // Display text and data inside boxes
    for (let j = 0; j < this.dataBreakdown.length; j++) {
      displayTextRow(
        this.dataBreakdown[j],
        gridLayout,
        color(0),
        length,
        j + 1
      );
    }

    // To add the datas inside the data table
    dataQueueCondition(array);

    stroke(1);
  };

  // Refresh the data breakdown table
  this.refreshData = function (array) {
    this.dataHeader = array;
    this.dataBreakdown = [];
  };

  /////////////////// Private Methods /////////////////////////

  // Declare for variables in objects for Private Methods
  var self = this;

  // Display title on the control panel and on data breakdown box
  let displayTitle = function (title, x, y) {
    fill(0);
    noStroke();
    textSize(20);
    textAlign("center", "center");
    text(title, x, y);
  };

  //   Draw the control panel
  let controlPanel = function (controlsLabel) {
    // Only draw is the label array exists
    fill(210);
    noStroke();
    rect(self.x, self.y, width / 2 - 120, self.height - 10, 10);

    fill(255);
    // Create boxes for the controls to be inside of, unable to use ES6 as index is important
    for (let i = 0; i < controlsLabel.length; i++) {
      rect(self.x + 20, self.y + 50 + 45 * i, 140, 35);
      rect(self.x + 20 + 145, self.y + 50 + 45 * i, width / 2 - 300, 35);
    }

    displayTitle("Control Panel", self.x + (width / 2 - 120) / 2, self.y + 30);
  };

  //   Draw the data table
  let displayData = function () {
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

  let displayTextRow = function (array, layout, colour, length, rowNumber) {
    // Display Header for Data Table
    let previousHeader = 0;
    for (let i = 0; i < array.length; i++) {
      fill(colour);
      text(
        array[i],
        self.data_x_axis + previousHeader + 5,
        self.y + 60 + 35 * rowNumber,
        length * layout[i] - 5
      );
      previousHeader += length * layout[i];
    }
  };

  // Condition for the data points to be added into the table
  let dataQueueCondition = function (array) {
    // Only when points are clicked, array will not be empty and can proceed with function
    if (!array.length == 0) {
      // To initalise the first data inside dataBreakdown Array
      if (self.dataBreakdown.length == 0) {
        self.dataBreakdown.push(array);
      }
      // For any other new data Clicked, add into the queue of data for the data table
      else {
        if (
          self.dataBreakdown[0][1] != array[1] ||
          self.dataBreakdown[0][2] != array[2]
        ) {
          // If the queue have reached max, add from the front and remove the last
          if (self.dataBreakdown.length == 3) {
            self.dataBreakdown.splice(0, 0, array);
            self.dataBreakdown.pop();
          } else {
            self.dataBreakdown.splice(0, 0, array);
          }
        }
      }
    }
  };
}
