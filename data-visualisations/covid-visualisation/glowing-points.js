function glowingPoints(
  country,
  lat,
  lng,
  date,
  totalCase,
  newCase,
  totalDeath,
  colour,
  pointSize,
  glowSpeed,
  myMap
) {
  /////////////////// Public Variables /////////////////////////

  // Country name, latitude and longitude
  this.country = country;
  //  Data of covid cases according to country, such as the date, the number of total cases and death, and new cases
  this.date = date;
  this.totalCase = totalCase;
  this.newCase = newCase;
  this.totalDeath = totalDeath;
  // The size of the point object, will be called for the hovering effect
  this.pointSize = pointSize;

  /////////////////// Public Methods /////////////////////////

  this.draw = function () {
    generatePointCoordinates();

    glowConditions();

    // Condition to make sure no point object is drawn past the map
    if (this.pointY < 566) {
      drawGlow();

      drawPoints();
    }
  };

  /////////////////// Private Methods /////////////////////////

  // Declare for variables in objects for Private Methods
  var self = this;

  // map the speed of the glow with the size of the glow
  let glowSpeedToSize = function (value, min, max) {
    return map(value, min, max, 1, 2);
  };

  // Using Mappa.js to convert the latitude and longitude to x and y coordinates
  let generatePointCoordinates = function () {
    country = myMap.latLngToPixel(lat, lng);
    self.pointX = country.x;
    self.pointY = country.y;
  };

  // Local variables for glowing condition
  var glowSizeState = false;
  var glowSize = glowSpeedToSize(glowSpeed, 1, 5);

  // Condition for the glow to increase and decrease size
  let glowConditions = function () {
    if (glowSizeState) {
      glowSize -= glowSize / (100 / glowSpeed);
    } else {
      glowSize += glowSize / (100 / glowSpeed);
    }

    if (glowSize > glowSpeedToSize(glowSpeed, 1, 5)) {
      glowSizeState = true;
    } else if (glowSize < 1) {
      glowSizeState = false;
    }
  };

  // Method to draw the glow of the object point
  let drawGlow = function () {
    fill(255, 255, 0, 185);
    noStroke();
    ellipse(
      self.pointX,
      self.pointY,
      self.pointSize * glowSize * myMap.zoom(),
      self.pointSize * glowSize * myMap.zoom()
    );
  };

  // Method to draw the point object itself
  let drawPoints = function () {
    fill(colour);
    stroke(0);
    strokeWeight(0.5);
    ellipse(
      self.pointX,
      self.pointY,
      self.pointSize * myMap.zoom(),
      self.pointSize * myMap.zoom()
    );
  };
}
