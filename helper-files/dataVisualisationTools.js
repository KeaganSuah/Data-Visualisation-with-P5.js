// This dataVisualisationTools object is used to improve the overall UI/UX design of the data visualisation. This entire object is done by myself (Keagan Suah)
function DataVisualisationTools() {
  /////////////////// Public Variables /////////////////////////

  // set the height of the dataVisualisationTools table
  this.height = 200;
  //   set the coordinates of the dataVisualisationTools table
  this.x = 70;
  this.y = 576;

  // Array of the row Y axis for the data visualisations to place their DOM object and for this object to place the data on the rows
  this.labelHeight = [this.y + 68, this.y + 113, this.y + 158];

  // The status for the mouse click function, if true, it will register the data into the data table
  this.mouseClickStatus = false;

  // Control panel X axis for data visualisations to place their DOM object
  this.controlXmargin = 465;
  this.controlXaxis = this.x + 30;

  /////////////////// Local Variables /////////////////////////

  // Nested array to keep array of data
  let dataQueue = new Queue();

  // Array for data table headers
  let dataHeader = [];

  // Data breakdown table X axis for data visualisations to place their data
  const dataXaxis = this.x + 425;

  // To keep track of previous click data, this prevents the data table to add in same data
  let previousClicked = [];

  /////////////////// Public Methods /////////////////////////

  // Standardise the DOM object design
  this.designDOM = function (domObject) {
    domObject.style("z-index", "2");
    domObject.style("width", "200px");
    domObject.style("font-size", "16px");
  };

  // Draw title of the data visualisation at the top
  this.drawTitle = function (title) {
    fill(0);
    noStroke();
    textAlign("center", "center");
    textSize(18);
    text(title, width / 2, 15);
  };

  // To list out the label for all the controls
  this.listControlLabel = function (array) {
    controlPanel(array);
    // Draw dataVisualisationTools label
    textAlign("left");
    textSize(16);
    fill(0);
    noStroke();
    // unable to use ES6 as index is important
    for (let i = 0; i < array.length; i++) {
      text(array[i], this.controlXaxis, this.labelHeight[i]);
    }
  };

  // To display and list out all the data in the data breakdown table
  this.listDisplayData = function (array, gridLayout) {
    const length = 495;
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
          dataXaxis + previous,
          this.y + 45 + 35 * i,
          length * gridLayout[j] - 5,
          30
        );
        previous += length * gridLayout[j];
      }
    }

    // Display the row of elements of the data the user has clicked
    for (let j = 0; j < dataQueue.length(); j++) {
      displayTextRow(
        dataQueue.printQueue()[j],
        gridLayout,
        color(0),
        length,
        dataQueue.length() - j
      );
    }

    // Display Data breakdown table header
    displayTextRow(dataHeader, gridLayout, color(255), length, 0);

    // Only when points are clicked, array will not be empty and can proceed with function
    if (!array.length == 0) {
      // To add the datas inside the data table
      // dataQueueCondition(array);
      dataQueueSwitch(array);
    }

    stroke(1);
  };

  // Method to display the small data breakdown table beside the mouse to inform user of the data they are adding to the data table
  this.mouseHoverTable = function (hoverArray, gridLayout) {
    cursor(HAND);

    // Variables for the mouse Hover Table
    const length = 330;
    const height = 88;
    let displayX = mouseX + 10;
    let displayY = mouseY + 10;

    // To shift the table to the left side of the mouse, this is to prevent the table from being out of the canvas
    if (mouseX > width - length) {
      displayX -= length + 10;
    }

    // To shift the table of the top of the mouse, this is to prevent the table from overlapping the control panel and data breakdown table
    if (mouseY > 470) {
      displayY -= height + 10;
    }

    // For the base grey rectangle
    noStroke();
    fill(200);
    rect(displayX, displayY, length, height, 4);

    // Title of the hoverable Data Table
    textAlign();
    fill(0);
    textSize(18);
    textAlign("center");
    text("Data Preview", displayX + length / 2, displayY + 15);

    // Create boxes for the controls to be inside of
    for (let i = 0; i < 2; i++) {
      let previous = 0;
      for (let j = 0; j < gridLayout.length; j++) {
        if (i == 0) {
          fill(100, 100, 190);
        } else {
          fill(255);
        }
        rect(
          displayX + 2 + previous,
          displayY + 30 + 28 * i,
          length * gridLayout[j] - 3,
          25
        );
        previous += length * gridLayout[j];
      }
    }

    textSize(12);
    textAlign("left");
    // Display text and data inside boxes
    for (let j = 0; j < 2; j++) {
      let previousText = 0;
      for (let i = 0; i < dataHeader.length; i++) {
        if (j == 0) {
          fill(255);
          text(
            dataHeader[i],
            displayX + previousText + 5,
            displayY + 40 + 28 * j,
            length * gridLayout[i] - 5
          );
        } else {
          fill(0);
          textSize(14);
          text(
            hoverArray[i],
            displayX + previousText + 5,
            displayY + 45 + 28 * j,
            length * gridLayout[i] - 5
          );
        }
        previousText += length * gridLayout[i];
      }
    }

    // Condition to check if user click the points, if yes, return the data array to transfer the data to the data breakdown table
    if (this.mouseClickStatus) {
      return hoverArray;
    } else {
      return false;
    }
  };

  // Refresh the data breakdown table
  this.refreshData = function (array) {
    dataHeader = array;
    emptyQueue(dataQueue.length(), dataQueue);
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

  // Display the elements in the array on to the data table row base on the row number
  let displayTextRow = function (array, layout, colour, length, rowNumber) {
    // Display Header for Data Table
    let previousHeader = 0;
    for (let i = 0; i < array.length; i++) {
      fill(colour);
      text(
        array[i],
        dataXaxis + previousHeader + 5,
        self.y + 60 + 35 * rowNumber,
        length * layout[i] - 5
      );
      previousHeader += length * layout[i];
    }
  };

  // To compare the previous array and currently clicked array to see if its the same
  let compareArrays = function (array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] != previousClicked[i]) {
        return true;
      }
    }
    return false;
  };

  // Condition for the data points to be added into the table
  let dataQueueSwitch = function (array) {
    switch (dataQueue.length()) {
      // To initalise the first data inside dataQueue Array
      case "Empty":
        dataQueue.enqueue(array);
        previousClicked = array;
      // For any other new data Clicked, add into the queue of data for the data table
      case 1:
      case 2:
        if (compareArrays(array)) {
          dataQueue.enqueue(array);
          previousClicked = array;
        }
      // When the queue have reached max, add from the front and remove the last
      case 3:
        if (compareArrays(array)) {
          dataQueue.dequeue();
          dataQueue.enqueue(array);
          previousClicked = array;
        }
    }
  };

  // Recursive Function used to empty the data table queue when changing between visualisations
  let emptyQueue = function (length, queue) {
    if (queue.isEmpty()) {
      return;
    } else {
      queue.dequeue();
      emptyQueue(length - 1, queue);
    }
  };
}
