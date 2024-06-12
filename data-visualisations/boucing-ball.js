function bounchingBall(size, speed,colour, layout) {
  this.layout = layout;
  // Public Variables
  this.x = random(this.layout.leftMargin+ size / 2,this.layout.rightMargin- size / 2);
  this.y = random(this.layout.topMargin+ size / 2,this.layout.bottomMargin- size / 2);
  this.xspeed = speed;
  this.yspeed = speed;
  this.colour = colour


  this.draw = function () {
    fill(this.colour)
    ellipse(this.x, this.y, size, size);
  };

  this.ballAcceleration = function (pause) {
    if (!pause) {
      this.x += this.xspeed;
      this.y += this.yspeed;
    }
  };

  this.checkCondition = function () {
    if (
      this.x > this.layout.rightMargin - size / 2 ||
      this.x < this.layout.leftMargin + size / 2
    ) {
      this.xspeed *= -1;
    }
    if (
      this.y > this.layout.bottomMargin - size / 2 ||
      this.y < this.layout.topMargin + size / 2
    ) {
      this.yspeed *= -1;
    }
  };
}
