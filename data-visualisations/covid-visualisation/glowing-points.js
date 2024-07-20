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
  // Country name, latitude and longitude
  this.country = country;
  //  Data of covid cases according to country, such as the date, the number of total cases and death, and new cases
  this.date = date;
  this.totalCase = totalCase;
  this.newCase = newCase;
  this.totalDeath = totalDeath;
  this.pointSize = pointSize;

  /////////////////// Public Methods /////////////////////////

  this.draw = function () {
    generatePointCoordinates();

    glowConditions();

    drawGlow();

    drawPoints();
  };

  /////////////////// Private Methods /////////////////////////

  // Declare for variables in objects for Private Methods
  var self = this;

  let glowSpeedToSize = function (value, min, max) {
    return map(value, min, max, 1, 2);
  };

  let generatePointCoordinates = function () {
    country = myMap.latLngToPixel(lat, lng);
    self.pointX = country.x;
    self.pointY = country.y;
  };

  var glowSizeState = false;
  var glowSize = glowSpeedToSize(glowSpeed, 1, 5);

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
