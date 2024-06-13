function bounchingBall(
  size,
  speed,
  colour,
  gender,
  bankruptAmt,
  ballText,
  layout
) {
  this.layout = layout;
  // Public Variables
  this.size = size;
  this.x = random(
    this.layout.leftMargin + this.size / 2,
    this.layout.rightMargin - this.size / 2
  );
  this.y = random(
    this.layout.topMargin + this.size / 2,
    this.layout.bottomMargin - this.size / 2
  );
  this.xspeed = speed;
  this.yspeed = speed;
  this.colour = colour;
  this.ballText = ballText;
  this.gender = gender;
  this.bankruptAmt = bankruptAmt

  this.draw = function () {
    fill(this.colour);
    ellipse(this.x, this.y, this.size, this.size);
  };

  this.displayText = function () {
    fill(0);
    textAlign("center");
    text(this.ballText, this.x, this.y);
  };

  this.ballAcceleration = function (pause) {
    if (pause) {
      this.x += this.xspeed;
      this.y += this.yspeed;
    }
  };

  this.checkCondition = function () {
    if (
      this.x > this.layout.rightMargin - this.size / 2 ||
      this.x < this.layout.leftMargin + this.size / 2
    ) {
      this.xspeed *= -1;
    }
    if (
      this.y > this.layout.bottomMargin - this.size / 2 ||
      this.y < this.layout.topMargin + this.size / 2
    ) {
      this.yspeed *= -1;
    }
  };
}
