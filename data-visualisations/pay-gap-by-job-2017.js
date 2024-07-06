function PayGapByJob2017() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Pay gap by job: 2017";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "pay-gap-by-job-2017";

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Graph properties.
  this.pad = 20;
  this.dotSizeMin = 15;
  this.dotSizeMax = 40;

  // Title to display above the plot.
  this.title = "Pay Gap by job 2017 quadrant chart";

  // Load number of controls user has on the data
  this.controlsLabel = 0;

  // Declare for variables in objects for Private Methods
  var self = this;

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
    // Reset the data table for new data visualisation
    this.dataHeaders = ["Industry", "Female", "Pay Gap"];
    this.dataList = [];
    this.gridLayout = [0.7, 0.15, 0.15];
    operation.refreshData(this.dataHeaders);
  };

  this.destroy = function () {};

  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Draw the title above the plot.
    this.drawTitle();

    // Draw the axes.
    this.addAxes();

    // Display points hovered
    operation.listDisplayData(this.dataList, this.gridLayout);

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
    let propFemaleMin = 0;
    let propFemaleMax = 100;

    // For y-axis (pay gap) use a symmetrical axis equal to the
    // largest gap direction so that equal pay (0% pay gap) is in the
    // centre of the canvas. Above the line means men are paid
    // more. Below the line means women are paid more.
    let payGapMin = -20;
    let payGapMax = 20;

    // Find smallest and largest numbers of people across all
    // categories to scale the size of the dots.
    let numJobsMin = min(numJobs);
    let numJobsMax = max(numJobs);

    fill(255);
    stroke(0);
    strokeWeight(1);

    // Unable to use ES6 as index is important
    for (i = 0; i < this.data.getRowCount(); i++) {
      // Set the colour for each points for the intensity to see how far it is from the center
      colourIntensifier(
        payGap[i],
        propFemale[i],
        propFemaleMin,
        propFemaleMax,
        payGapMax
      );

      ellipse(
        map(
          propFemale[i],
          propFemaleMin,
          propFemaleMax,
          this.pad,
          width - this.pad
        ),
        map(
          payGap[i],
          payGapMin,
          payGapMax,
          height - operation.height - this.pad,
          this.pad
        ),
        map(
          numJobs[i],
          numJobsMin,
          numJobsMax,
          this.dotSizeMin,
          this.dotSizeMax
        )
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
  };

  this.addAxes = function () {
    // Add quadrant onto the axis
    quadrant();

    stroke(100);
    strokeWeight(2);
    // Add vertical line.
    line(
      width / 2,
      0 + this.pad,
      width / 2,
      height - operation.height - this.pad - 20
    );

    // Add horizontal line.
    line(
      0 + this.pad,
      (height - operation.height) / 2,
      width - this.pad,
      (height - operation.height) / 2
    );
  };

  this.drawTitle = function () {
    fill(0);
    noStroke();
    textAlign("center", "center");

    textSize(16);
    text(this.title, width / 2, 10);
  };

  /////////////////// Private Methods /////////////////////////
  // These Methods below are done by myself (Keagan Suah)

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
      map(propFemale, propFemaleMin, propFemaleMax, self.pad, width - self.pad),
      map(
        payGap,
        payGapMin,
        payGapMax,
        height - operation.height - self.pad,
        self.pad
      )
    );

    // when mouse is on the points, it passes the condition
    if (
      distance <
      map(numJobs, numJobsMin, numJobsMax, self.dotSizeMin, self.dotSizeMax) / 2
    ) {
      // Change mouse cursor type
      cursor(HAND);
      // Display Industry and values
      if (operation.mouseClickStatus) {
        self.dataList = [
          `${jobs}`,
          `${propFemale.toFixed(2)}%`,
          `${payGap.toFixed(2)}`,
        ];
      }
    }
  };

  let quadrant = function () {
    // Add Quadrant boxes to distinguish the quadrants
    noStroke();
    // Top-Left Quadrant
    fill(0, 0, 255, 50);
    rect(
      self.pad,
      self.pad,
      width / 2 - self.pad,
      (height - operation.height) / 2 - self.pad
    );
    // Top-Right Quadrant
    fill(128, 0, 128, 50);
    rect(
      width / 2,
      self.pad,
      width / 2 - self.pad,
      (height - operation.height) / 2 - self.pad
    );
    // Bottom-Left Quadrant
    fill(255, 165, 0, 50);
    rect(
      self.pad,
      (height - operation.height) / 2,
      width / 2 - self.pad,
      (height - operation.height) / 2 - self.pad - 20
    );
    // Bottom-Left Quadrant
    fill(255, 192, 203, 50);
    rect(
      width / 2,
      (height - operation.height) / 2,
      width / 2 - self.pad,
      (height - operation.height) / 2 - self.pad - 20
    );

    // Add Quadrant boxes label
    textSize(25);
    textAlign("center", "center");
    // Top-Left Quadrant
    fill(0, 0, 55);
    text(
      "Male-Dominated, Higher Male Pay",
      width / 4,
      (height - operation.height) / 4
    );
    // Top-Right Quadrant
    fill(0, 0, 55);
    text(
      "Female-Dominated, Higher Male Pay",
      3 * (width / 4),
      (height - operation.height) / 4
    );
    // Bottom-Left Quadrant
    fill(0, 0, 55);
    text(
      "Male-Dominated, Higher Female Pay",
      width / 4,
      3 * ((height - operation.height) / 4)
    );
    // Bottom-Left Quadrant
    fill(0, 0, 55);
    text(
      "Female-Dominated, Higher Female Pay",
      3 * (width / 4),
      3 * ((height - operation.height) / 4)
    );
  };
}
