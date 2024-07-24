function PayGapByJob2017() {
  /////////////////// Public Variables /////////////////////////

  // Name for the visualisation to appear in the menu bar.
  this.name = "Pay gap by job: 2017";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "pay-gap-by-job-2017";

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Title to display above the plot.
  this.title = "Pay Gap by job 2017 quadrant chart";

  // Reset the data table for new data visualisation
  this.dataHeaders = ["Industry", "Female", "Pay Gap"];
  this.dataList = [];
  this.gridLayout = [0.6, 0.2, 0.2];

  /////////////////// Local Variables /////////////////////////

  // Graph properties.
  const pad = 20;
  const dotSizeMin = 15;
  const dotSizeMax = 40;

  /////////////////// Public Methods /////////////////////////

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    this.data = loadTable(
      "./data/pay-gap/occupation-hourly-pay-by-gender-2017.csv",
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
    dataVisualisationTools.refreshData(this.dataHeaders);
  };

  this.destroy = function () {};

  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }
    // Draw the background for the visualisation
    background(255);

    // Draw the axes.
    addAxes();

    // Display points hovered
    dataVisualisationTools.listDisplayData(this.dataList, this.gridLayout);

    // Get data from the table object.
    let jobs = this.data.getColumn("job_subtype");
    let propFemale = this.data.getColumn("proportion_female");
    let payGap = this.data.getColumn("pay_gap");
    let numJobs = this.data.getColumn("num_jobs");

    // Convert numerical data from strings to numbers.
    propFemale = stringsToNumbers(propFemale);
    payGap = stringsToNumbers(payGap);
    numJobs = stringsToNumbers(numJobs);

    // Set ranges for axes.
    //
    // Use full 100% for x-axis (proportion of women in roles).
    const propFemaleMin = 0;
    const propFemaleMax = 100;

    // For y-axis (pay gap) use a symmetrical axis equal to the
    // largest gap direction so that equal pay (0% pay gap) is in the
    // centre of the canvas. Above the line means men are paid
    // more. Below the line means women are paid more.
    const payGapMin = -20;
    const payGapMax = 20;

    // Find smallest and largest numbers of people across all
    // categories to scale the size of the dots.
    let numJobsMin = min(numJobs);
    let numJobsMax = max(numJobs);

    fill(255);

    // Unable to use ES6 as index is important
    for (i = 0; i < this.data.getRowCount(); i++) {
      stroke(0);
      strokeWeight(1);
      // Set the colour for each points for the intensity to see how far it is from the center
      colourIntensifier(
        payGap[i],
        propFemale[i],
        propFemaleMin,
        propFemaleMax,
        payGapMax
      );

      ellipse(
        map(propFemale[i], propFemaleMin, propFemaleMax, pad, width - pad),
        map(
          payGap[i],
          payGapMin,
          payGapMax,
          height - dataVisualisationTools.height - pad,
          pad
        ),
        map(numJobs[i], numJobsMin, numJobsMax, dotSizeMin, dotSizeMax)
      );

      // When points hovered, show breakdown details
      pointHover(
        propFemale[i],
        propFemaleMin,
        propFemaleMax,
        payGap[i],
        payGapMin,
        payGapMax,
        numJobs[i],
        numJobsMin,
        numJobsMax,
        jobs[i]
      );
    }

    // Second Loop for data points conditions to display small data breakdown without overlapping.
    for (i = 0; i < this.data.getRowCount(); i++) {
      // When points hovered, show breakdown details
      pointHover(
        propFemale[i],
        propFemaleMin,
        propFemaleMax,
        payGap[i],
        payGapMin,
        payGapMax,
        numJobs[i],
        numJobsMin,
        numJobsMax,
        jobs[i]
      );
    }
  };

  /////////////////// Private Methods /////////////////////////
  // These Methods below are done by myself (Keagan Suah)

  // Declare for variables in objects for Private Methods
  var self = this;

  let addAxes = function () {
    // Add quadrant onto the axis
    quadrant();

    stroke(100);
    strokeWeight(2);
    // Add vertical line.
    line(
      width / 2,
      0 + pad,
      width / 2,
      height - dataVisualisationTools.height - pad - 20
    );

    // Add horizontal line.
    line(
      0 + pad,
      (height - dataVisualisationTools.height) / 2,
      width - pad,
      (height - dataVisualisationTools.height) / 2
    );
  };

  let colourIntensifier = function (
    payGap,
    propFemale,
    propFemaleMin,
    propFemaleMax,
    payGapMax
  ) {
    // Check the distance between pay gap to the center
    let distanceAveragePay = abs(payGap);
    // Check the distance between percentage of female to the center
    let distanceAverageProp = abs(
      (propFemaleMin + propFemaleMax) / 2 - propFemale
    );
    // Change the pay gap colour intensity
    let colourIntensityPay = map(distanceAveragePay, 0, payGapMax, 0, 255 / 2);
    // Change the percentage of female colour intensity
    let colourIntensityProp = map(
      distanceAverageProp,
      0,
      propFemaleMax / 2,
      0,
      255 / 2
    );

    // For points further away from the center, the more intense the redness will be
    return fill(
      255,
      255 - (colourIntensityPay + colourIntensityProp),
      255 - (colourIntensityPay + colourIntensityProp)
    );
  };

  // Private function, when points is hovered, display the breakdown details of the points by showing the percentage of female, pay gap and industry of the point
  let pointHover = function (
    propFemale,
    propFemaleMin,
    propFemaleMax,
    payGap,
    payGapMin,
    payGapMax,
    numJobs,
    numJobsMin,
    numJobsMax,
    jobs
  ) {
    // Get distance from mouse axis to the points axis
    distance = dist(
      mouseX,
      mouseY,
      map(propFemale, propFemaleMin, propFemaleMax, pad, width - pad),
      map(
        payGap,
        payGapMin,
        payGapMax,
        height - dataVisualisationTools.height - pad,
        pad
      )
    );

    // when mouse is on the points, it passes the condition
    if (
      distance <
      map(numJobs, numJobsMin, numJobsMax, dotSizeMin, dotSizeMax) / 2
    ) {
      // Array of data belonging to the point currently being hovered
      let hoverArray = [
        `${jobs}`,
        `${propFemale.toFixed(2)}%`,
        `${payGap.toFixed(2)}`,
      ];
      self.dataList = dataVisualisationTools.mouseHoverTable(
        hoverArray,
        self.gridLayout
      );
    }
  };

  let quadrant = function () {
    // Add Quadrant boxes to distinguish the quadrants
    noStroke();
    // Top-Left Quadrant
    fill(0, 0, 255, 50);
    rect(
      pad,
      pad,
      width / 2 - pad,
      (height - dataVisualisationTools.height) / 2 - pad
    );
    // Top-Right Quadrant
    fill(128, 0, 128, 50);
    rect(
      width / 2,
      pad,
      width / 2 - pad,
      (height - dataVisualisationTools.height) / 2 - pad
    );
    // Bottom-Left Quadrant
    fill(255, 165, 0, 50);
    rect(
      pad,
      (height - dataVisualisationTools.height) / 2,
      width / 2 - pad,
      (height - dataVisualisationTools.height) / 2 - pad - 20
    );
    // Bottom-Left Quadrant
    fill(255, 192, 203, 50);
    rect(
      width / 2,
      (height - dataVisualisationTools.height) / 2,
      width / 2 - pad,
      (height - dataVisualisationTools.height) / 2 - pad - 20
    );

    // Add Quadrant boxes label
    textSize(25);
    textAlign("center", "center");
    // Top-Left Quadrant
    fill(0, 0, 55);
    text(
      "Male-Dominated, Higher Male Pay",
      width / 4,
      (height - dataVisualisationTools.height) / 4
    );
    // Top-Right Quadrant
    fill(0, 0, 55);
    text(
      "Female-Dominated, Higher Male Pay",
      3 * (width / 4),
      (height - dataVisualisationTools.height) / 4
    );
    // Bottom-Left Quadrant
    fill(0, 0, 55);
    text(
      "Male-Dominated, Higher Female Pay",
      width / 4,
      3 * ((height - dataVisualisationTools.height) / 4)
    );
    // Bottom-Left Quadrant
    fill(0, 0, 55);
    text(
      "Female-Dominated, Higher Female Pay",
      3 * (width / 4),
      3 * ((height - dataVisualisationTools.height) / 4)
    );
  };
}
