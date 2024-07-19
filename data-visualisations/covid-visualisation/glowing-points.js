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

  var glowSizeState = false;
  var glowSize = 2;

  this.draw = function () {
    generatePointCoordinates();

    glowConditions();

    drawGlow();

    drawPoints();
  };

  /////////////////// Private Methods /////////////////////////

  // Declare for variables in objects for Private Methods
  var self = this;

  let generatePointCoordinates = function () {
    country = myMap.latLngToPixel(lat, lng);
    self.pointX = country.x;
    self.pointY = country.y;
  };

  let glowConditions = function () {
    if (glowSizeState) {
      glowSize -= glowSpeed;
    } else {
      glowSize += glowSpeed;
    }

    if (glowSize > 2) {
      glowSizeState = true;
    } else if (glowSize < 1) {
      glowSizeState = false;
    }
  };

  let drawGlow = function () {
    fill(255, 255, 0, 135);
    noStroke();
    ellipse(
      self.pointX,
      self.pointY,
      self.pointSize * glowSize,
      self.pointSize * glowSize
    );
  };

  let drawPoints = function () {
    fill(colour);
    stroke(0);
    strokeWeight(0.5);
    ellipse(self.pointX, self.pointY, self.pointSize, self.pointSize);
  };
}
