function Operation() {
  // set the height of the operation table
  this.height = 200;
  //   set the coordinates of the operation table
  this.x = 70;
  this.y = 576;

  // Placement of label to boxs
  this.box_x_axis = this.x + 30;
  this.box1_y_axis = this.y + 68;
  this.box2_y_axis = this.y + 113;

  var self = this;

  //   To draw the operation table
  this.draw = function (noControls, breakdown) {
    self.controlPanel(noControls);
    self.displayData(breakdown);
  };

  //   Draw the control panel
  self.controlPanel = function (noControls) {
    if (noControls > 0) {
      fill(0, 0);
      stroke(0);
      strokeWeight(1);
      rect(this.x, this.y, width / 2 - 70, this.height - 10, 10);

      for (var i = 0; i < noControls; i++) {
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

  self.displayTitle = function (title, x, y) {
    fill(0);
    noStroke();
    textSize(20);
    textAlign("center", "center");
    text(title, x, y);
  };
}
