function covidMap() {
  /////////////////// Public Variables /////////////////////////

  // Name for the visualisation to appear in the menu bar.
  this.name = "Covid: 2020-2022";

  // Each visualisation must have a unique ID with no special characters.
  this.id = "covid-map";

  // Title to display above the plot.
  this.title = "Covid: 2020-2022";

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Load number of controls user has on the data
  this.controlsLabel = ["Display Legend", "Filter Years", "Play Animation"];

  this.dataHeaders = ["Country", "Date", "New Case", "Total Case", "Death"];
  this.dataList = [];
  this.gridLayout = [0.22, 0.17, 0.2, 0.21, 0.2];

  /////////////////// Local Variables /////////////////////////

  // to set the margin size for the plot
  let marginSize = 35;

  // Mappa related variables
  let myMap;
  let canvas;
  let mappa = new Mappa("Leaflet");

  // put all map options in a single object
  const options = {
    lat: 33,
    lng: 50,
    zoom: 1.5,
    style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
  };

  let dateArray = [];

  let legendState = false;

  let playStatus = false;
  let playCount = 60 * 2;
  let playCurrentIndex = 0;

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

  /////////////////// Public Methods /////////////////////////

  // Preload the data. This function is called automatically by the // gallery when a visualisation is added.
  this.preload = function () {
    this.data = loadTable(
      "./data/covid/covid.csv",
      "csv",
      "header",
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
      }
    );
    this.country = loadTable(
      "./data/covid/country.csv",
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

    createMapSetup();

    // Get the Largest amount and smallest amount of cumulative covid case
    let maxAmountCovidCase = MinMaxAmt(this.data, 0, max, 2, 3);
    let minAmountCovidCase = MinMaxAmt(
      this.data,
      maxAmountCovidCase,
      min,
      2,
      3
    );

    // Get the Largest amount and smallest amount of new covid cases
    let maxAmountCovidCaseIncrement = MinMaxAmt(this.data, 0, max, 3, 4);
    let minAmountCovidCaseIncrement = MinMaxAmt(
      this.data,
      maxAmountCovidCase,
      min,
      3,
      4
    );

    // Get the Largest amount and smallest amount of cumulative Death
    let maxAmountDeathCase = MinMaxAmt(this.data, 0, max, 5, 6);
    let minAmountDeathCase = MinMaxAmt(
      this.data,
      maxAmountDeathCase,
      min,
      5,
      6
    );

    // Array of Glowing Points object
    this.covidPoints = [];

    // Loop through the rows of the file and create a point object coresponding to the data in the row
    for (let i = 0; i < this.data.getRowCount(); i++) {
      covidRow = this.data.getRow(i).arr.slice(0);
      // ['Zimbabwe', 'Jun-21', '49864', '10903', '8954', '1789', '193']
      for (let j = 0; j < this.country.getRowCount(); j++) {
        countryLocation = this.country.getRow(j).arr.slice(1);
        // ['-54.423199', '3.413194', 'Bouvet Island']
        if (covidRow[0] == countryLocation[2]) {
          let country = covidRow[0];
          let countryLat = countryLocation[0];
          let countryLng = countryLocation[1];
          let date = covidRow[1];
          let totalCase = covidRow[2];
          let newCase = covidRow[3];
          let totalDeath = covidRow[5];
          let redIntensity = map(
            totalDeath,
            minAmountDeathCase,
            maxAmountDeathCase,
            255,
            0
          );
          let colour = color(255 - redIntensity, redIntensity, 0);
          let pointSize = map(
            totalCase,
            minAmountCovidCase,
            maxAmountCovidCase,
            4,
            50
          );
          let glowSpeed = map(
            newCase,
            minAmountCovidCaseIncrement,
            maxAmountCovidCaseIncrement,
            1,
            5
          );
          this.covidPoints.push(
            new glowingPoints(
              country,
              countryLat,
              countryLng,
              date,
              totalCase,
              newCase,
              totalDeath,
              colour,
              pointSize,
              glowSpeed,
              myMap
            )
          );
        }
      }
    }

    // Create filter for Dates
    makeDateFilter();

    // Create start and stop button for the points animation over the years
    createStartStopButton();

    // Create display legend button
    createLegendButton();
  };

  this.destroy = function () {
    this.dateFilter.remove();
    this.playButton.remove();
    this.legendButton.remove();

    // To destroy the map when change to another visualisation
    select("#stage").html("<div id='app'></div>");
    //recreate a new canvas for the other app
    c.parent("app");
  };

  this.draw = function () {
    clear();
    // Based on user input, set the date for the variable
    let userSelectDate = playCondition();

    // Loop to draw every point object
    for (let point of this.covidPoints) {
      if (point.date == userSelectDate) {
        point.draw();
      }
    }

    // Loop to set the collision method on every point object
    for (let point of this.covidPoints) {
      if (point.date == userSelectDate) {
        hoverPoints(point);
      }
    }

    // Draw legend when display legend state is true
    drawLegend();

    // Draw the title above the plot.
    drawTitle();

    // Display points hovered
    dataVisualisationTools.listDisplayData(this.dataList, this.gridLayout);

    // Draw control labels
    // dataVisualisationTools.listControlLabel(this.controlsLabel);
  };

  // This public method is update the Z-index of changes made on the map
  this.onMapChange = function () {
    //put the #map_draw on top of #map
    select("#stage").elt.firstChild.style.zIndex = 2;
    select("#stage").elt.lastChild.style.zIndex = 1;

    //display the mouse event on #map_draw and pass through the mouse event to the next layer which is #map
    select("#stage").elt.firstChild.style.pointerEvents = "none";
    //need to set both #map_draw and #map position to absolute for pointerEvents=none to take effect
    select("#stage").elt.firstChild.style.position = "absolute";
    select("#stage").elt.firstChild.style.position = "absolute";
  };

  /////////////////// Private Methods /////////////////////////

  // Declare for variables in objects for Private Methods
  var self = this;

  // Functions below are to create and display the Mappa.js Map layout
  let createMapSetup = function () {
    select("#stage").html(
      "<div id='map_draw'></div><canvas id='map'></canvas>"
    );

    let c = createCanvas(1024, 576 + dataVisualisationTools.height);
    c.parent("#map_draw");
    canvas = select("#map");

    // Create a tile map with lat 0, lng 0, zoom 4
    myMap = mappa.tileMap(options);
    // Overlay the tilemap on top of the canvas
    myMap.overlay(canvas);
    myMap.onChange(self.onMapChange);
  };

  // Get the max amount among the years, age groups and gender, using Higher Order Function
  let MinMaxAmt = function (data, value, fn, firstIndex, secondIndex) {
    for (let i = 0; i < data.getRowCount(); i++) {
      let rowList = data.getRow(i).arr.slice(firstIndex, secondIndex);
      rowList = stringsToNumbers(rowList);
      let valueInList = fn(rowList);
      value = fn(value, valueInList);
    }
    return value;
  };

  // Function for the collision method to work when points hovered
  let hoverPoints = function (hoveredPoint) {
    distance = dist(hoveredPoint.pointX, hoveredPoint.pointY, mouseX, mouseY);
    if (distance < (hoveredPoint.pointSize * myMap.zoom()) / 2) {
      let hoverArray = [
        hoveredPoint.country,
        hoveredPoint.date,
        hoveredPoint.newCase,
        hoveredPoint.totalCase,
        hoveredPoint.totalDeath,
      ];

      self.dataList = dataVisualisationTools.mouseHoverTable(
        hoverArray,
        self.gridLayout
      );
    }
  };

  // Create the years filter dropdown option for data visualisation to display based on years
  let makeDateFilter = function () {
    // Create a select DOM element.
    self.dateFilter = createSelect();
    self.dateFilter.position(
      dataVisualisationTools.controlXmargin +
        dataVisualisationTools.controlXaxis,
      dataVisualisationTools.labelHeight[0]
    );

    // Fill the options with all dates in the CSV for each country.
    let years = self.data.getColumn(1).slice(0, 27);

    // First entry is empty.
    for (let year of years) {
      self.dateFilter.option(year);
      dateArray.push(year);
    }
  };

  // Function is to change the variable playStatus that start the animation or stop the animation
  let startStopClick = function () {
    if (playStatus) {
      playStatus = false;
    } else {
      playStatus = true;
    }
  };

  // Create the button that start the data animation
  let createStartStopButton = function () {
    self.playButton = createButton("Start/Stop");
    self.playButton.position(
      dataVisualisationTools.controlXmargin +
        dataVisualisationTools.controlXaxis,
      dataVisualisationTools.labelHeight[1] - 2
    );

    // Call repaint() when the button is pressed.
    self.playButton.mousePressed(startStopClick);
  };

  // Condition for the user input to start the data animation or stop
  let playCondition = function () {
    let state;
    if (!playStatus) {
      state = self.dateFilter.value();
      playCurrentIndex = 0;
    } else {
      if (playCount <= 0) {
        playCount += 60 * 2;
        playCurrentIndex += 1;
        if (playCurrentIndex == dateArray.length) {
          playStatus = false;
        }
      } else {
        state = dateArray[playCurrentIndex];
        playCount--;
        if (playCount < 60 * 2 && playCount > 60) {
          fill(0);
          textSize(80);
          text(state, width - 280, height - 250);
        }
      }
    }
    return state;
  };

  // Function is to change the variable legend status to display or stop displaying legend
  let legendClick = function () {
    if (legendState) {
      legendState = false;
    } else {
      legendState = true;
    }
  };

  // Create the button that display the legend
  let createLegendButton = function () {
    self.legendButton = createButton("Instructions");
    self.legendButton.position(
      dataVisualisationTools.controlXmargin +
        dataVisualisationTools.controlXaxis,
      dataVisualisationTools.labelHeight[2] - 2
    );

    // Call repaint() when the button is pressed.
    self.legendButton.mousePressed(legendClick);
  };

  // Gradient for the legend to represent the number of death
  let setGradient = function (x, y, w, h, c1, c2) {
    noFill();
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  };

  // Function to draw the legend and display when the legend status is true
  let drawLegend = function () {
    if (legendState) {
      fill(240);
      rect(width / 4, height / 8, width / 2, height / 2, 10);

      fill(0, 255, 0);
      ellipse((width * 3) / 8, (height * 3) / 8 + 20, 70, 70);

      setGradient(
        (width * 5) / 16,
        height / 2,
        150,
        50,
        color(255, 0, 0),
        color(0, 255, 0)
      );

      noStroke();
      fill(255, 255, 0, 185);
      ellipse((width * 3) / 8, height / 4 + 10, 70, 70);

      fill(0);
      textSize(18);
      text(
        "Glow represents the amount of new cases",
        width / 2,
        height / 4,
        width / 5
      );
      text(
        "Size of the Point represent the total number of cases",
        width / 2,
        (height * 3) / 8,
        width / 5
      );
      text(
        "Colour represent the number of death",
        width / 2,
        height / 2 + 10,
        width / 5
      );

      textSize(10);
      text("More Death", width / 3 - 40, height / 2 + 60, width / 5);
      text("Less Death", width / 2 - 60, height / 2 + 60, width / 5);

      textAlign(CENTER);
      textSize(30);
      text("Covid Visualisation Legends", width / 2, height / 6);
    }
  };

  // Draw title of the data visualisation at the top
  let drawTitle = function () {
    fill(0);
    noStroke();
    textAlign("center", "center");
    textSize(16);
    text(
      self.title,
      layout.plotWidth() / 2 + layout.leftMargin,
      layout.topMargin - layout.marginSize / 2
    );
  };
}
