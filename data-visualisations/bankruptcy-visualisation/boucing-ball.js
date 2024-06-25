// This bounchingBall object is used to display all the balls in the bankruptcy data visualisation
function bounchingBall(
  size,
  speed,
  colour,
  gender,
  bankruptAmt,
  ballText,
  layout
) {
  // Public Variables
  // Layout Object from Bankruptcy file
  this.layout = layout;
  // Size and coordinates
  this.size = size;
  this.x = random(
    this.layout.leftMargin + this.size / 2,
    this.layout.rightMargin - this.size / 2
  );
  this.y = random(
    this.layout.topMargin + this.size / 2,
    this.layout.bottomMargin - this.size / 2
  );
  // Coordinates speed
  this.xspeed = speed * random([-1, 1]);
  this.yspeed = speed * random([-1, 1]);
  // Ball colour
  this.colour = colour;
  // Data of balls
  this.ballText = ballText;
  this.gender = gender;
  this.bankruptAmt = bankruptAmt;

  // Draw balls on convas
  this.draw = function () {
    fill(this.colour);
    ellipse(this.x, this.y, this.size, this.size);
  };

  // Draw text in the middle of the balls
  this.displayText = function () {
    fill(0);
    textAlign("center");
    text(this.ballText, this.x, this.y);
  };

  // This condition is for the balls to move only when pause status is false, if true, all balls should freeze
  this.ballAcceleration = function (pause) {
    if (pause) {
      this.x += this.xspeed;
      this.y += this.yspeed;
    }
  };

  // Condition to keep the balls within the canvas
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
