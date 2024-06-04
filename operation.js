function Operation() {
  // set the height of the operation table
  this.height = 200;
  //   set the coordinates of the operation table
  this.x = 70;
  this.y = 576;

  // Placement of label to boxs
  this.control_x_axis = this.x + 30;
  this.data_x_axis = this.x + 490;
  this.labelHeight = [this.y + 68, this.y + 113, this.y + 158];

  // Declare for private functions
  var self = this;

  //   To draw the operation table
  this.draw = function (labelArray, breakdown) {
    if(typeof labelArray !== 'undefined'){
    self.controlPanel(labelArray);
  }
    self.displayData(breakdown);
  };

  //   Draw the control panel
  self.controlPanel = function (labelArray) {
    if (labelArray.length > 0) {
      fill(0, 0);
      stroke(0);
      strokeWeight(1);
      rect(this.x, this.y, width / 2 - 70, this.height - 10, 10);

      for (var i = 0; i < labelArray.length; i++) {
        rect(this.x + 20, this.y + 50 + 45 * i, width / 2 - 110, 35, 5);
      }

      self.displayTitle(
        "Control Panel",
        this.x + (width / 2 - 70) / 2,
        this.y + 30
      );
    }
  };

  //   Draw the data table
  self.displayData = function (breakdown) {
    if (breakdown) {
      fill(0, 0);
      stroke(0);
      strokeWeight(1);
      rect(
        this.x + (width / 2 - 50),
        this.y,
        width / 2 - 70,
        this.height - 10,
        10
      );

      this.displayTitle(
        "Data Breakdown",
        this.x + (width / 2 - 50) + (width / 2 - 70) / 2,
        this.y + 30
      );
    }
  };

  self.listDisplayData = function (array) {
    // Display Industry and values
    textAlign("left");
    textSize(20);
    fill(0);
    noStroke();
    for (var i = 0; i < array.length; i++) {
      ellipse(operation.data_x_axis - 10, operation.labelHeight[i], 5, 5);
      text(array[i], operation.data_x_axis, operation.labelHeight[i], 400);
    }
    stroke(1);
  };

  self.listControlLabel = function (array) {
    // Draw operation label
    textAlign("left");
    textSize(16);
    fill(0);
    for (var i = 0; i < array.length; i++) {
      text(array[i], operation.control_x_axis, operation.labelHeight[i]);
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
}
