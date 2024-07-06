function PieChart(x, y, diameter) {
  // Public Variables
  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.labelSpace = 30;

  // Declare for variables in objects for Private Methods
  var self = this;

  // Private Variables, not needed to be accessed outside
  let previousWord = "";
  let word = "";
  let wordSize = 20;
  let hoverColour = "";

  /////////////////// Public Methods /////////////////////////

  // Convert the data into radians for the slice
  this.get_radians = function (datas) {
    let total = sum(datas);
    let radians = [];

    // Use ES6 method of taking element in array instead of by index
    for (let data of datas) {
      radians.push((data / total) * TWO_PI);
    }

    return radians;
  };

  this.draw = function (data, labels, colours, title) {
    // Test that data is not empty and that each input array is the
    // same length.
    if (data.length == 0) {
      alert("Data has length zero!");
    } else if (
      ![labels, colours].every((array) => {
        return array.length == data.length;
      })
    ) {
      alert(
        `Data (length: ${data.length})Labels (length: ${labels.length}) Colours (length: ${colours.length}) Arrays must be the same length!`
      );
    }

    // https://p5js.org/examples/form-pie-chart.html

    let angles = this.get_radians(data);
    let lastAngle = 0;
    let colour;

    // Distance between mouse and center of circle
    let distance = dist(mouseX, mouseY, this.x, this.y);

    for (let i = 0; i < data.length; i++) {
      if (colours) {
        colour = colours[i];
      } else {
        colour = map(i, 0, data.length, 0, 255);
      }

      fill(colour);
      stroke(0);
      strokeWeight(1);

      // When the arc has been hovered, increase the size of the arc
      if (hoverColour == colour) {
        arc(
          this.x,
          this.y,
          this.diameter + 50,
          this.diameter + 50,
          lastAngle,
          lastAngle + angles[i] + 0.001
        );
      }
      // When the arc is not hovered
      else {
        arc(
          this.x,
          this.y,
          this.diameter,
          this.diameter,
          lastAngle,
          lastAngle + angles[i] + 0.001
        );
      }

      mouseHover(distance, lastAngle, angles[i], data[i], colour);

      // Design the center of the pie chart to display the values
      displayCirlceData();

      if (labels) {
        this.makeLegendItem(labels[i], i, colour, hoverColour == colour);
      }

      lastAngle += angles[i];
    }

    if (title) {
      noStroke();
      textAlign("center");
      textSize(24);
      fill(0);
      text(title, this.x, this.y - this.diameter * 0.6);
    }
  };

  this.makeLegendItem = function (label, i, colour, hover) {
    let x = this.x + 50 + this.diameter / 2;
    let y = this.y + this.labelSpace * i - this.diameter / 3;
    let boxWidth = this.labelSpace / 2;
    let boxHeight = this.labelSpace / 2;

    fill(colour);
    rect(x, y, boxWidth, boxHeight);

    fill("black");
    noStroke();
    textAlign("left");
    textSize(12);
    text(label, x + boxWidth + 10, y + boxWidth / 2);

    // When slice is hovered, it will highlight the label as well
    if (hover) {
      noFill();
      stroke(0, 0, 255);
      rect(x - 5, y - 5, 100, 25, 5);
    }
  };

  /////////////////// Private Methods /////////////////////////
  // These Methods below are done by myself (Keagan Suah)

  // Private Method, Mouse condition to hover on the slice
  let mouseHover = function (distance, lastAngle, angle, data, colour) {
    // see the hover
    if (
      lastAngle < mouseHoverAngle(distance) &&
      mouseHoverAngle(distance) < lastAngle + angle + 0.001
    ) {
      if (distance > self.diameter / 2) {
        wordSize = 20;
        word = "Hover over the Slice for Percentage";
        hoverColour = "";
      } else if (distance < self.diameter / 2 && distance > 150) {
        wordSize = 32;
        word = data;
        hoverColour = colour;
        previousWord = word;
        // Change mouse cursor type
        cursor(HAND);
      } else if (distance < 150) {
        wordSize = 32;
        word = previousWord;
      }
    }
  };

  // Private Method, Using Trigonometric Functions to find the angle of the mouse
  let mouseHoverAngle = function (hypotenuse) {
    // Length of variables
    let opposite = abs(mouseY - self.y);
    let angle = 0;
    let mouse_radian = asin(opposite / hypotenuse);

    // Bottom-right quadrant
    if (mouseX < self.x && mouseY > self.y) {
      angle = abs(PI / 2 - mouse_radian) + PI / 2;
      return angle;
    }
    // Bottom-left quadrant
    else if (mouseX < self.x && mouseY < self.y) {
      angle = mouse_radian + PI;
      return angle;
    }
    // Top-left quadrant
    else if (mouseX > self.x && mouseY < self.y) {
      angle = abs(PI / 2 - mouse_radian) + PI + PI / 2;
      return angle;
    }
    // Top-right quadrant
    else if (mouseX > self.x && mouseY > self.y) {
      angle = mouse_radian;
      return angle;
    }
  };

  // Private method, to create the center circle in the middle that displays the percentage as well
  let displayCirlceData = function () {
    // Design the center of the pie chart to display the values
    fill(255);
    ellipse(self.x, self.y, 300, 300);
    fill(0);
    textAlign(CENTER);
    textSize(wordSize);
    noStroke();
    if (word != "Hover over the Slice for Percentage") {
      let displayWord = `${Number(word).toFixed(2)}%`;
      text(displayWord, self.x - 95, self.y - 5, 200);
    } else {
      text("Hover over the Slice for Percentage", self.x - 95, self.y - 5, 200);
    }
  };
}
