// Global variable to store the gallery object. The gallery object is a container for all the visualisations.
let gallery;
// Height of bottom operation display
let operation;

function setup() {
  // Create a canvas to fill the content div from index.html.
  canvasContainer = select("#app");

  // Create a new gallery object.
  gallery = new Gallery();

  // Create a new Operation Object
  operation = new Operation();

  let c = createCanvas(1024, 576 + operation.height);
  c.parent("app");

  // Add the visualisation objects here.
  gallery.addVisual(new TechDiversityRace());
  gallery.addVisual(new TechDiversityGender());
  gallery.addVisual(new PayGapByJob2017());
  gallery.addVisual(new PayGapTimeSeries());
  gallery.addVisual(new ClimateChange());
  gallery.addVisual(new NutrientsTimeSeries());
  gallery.addVisual(new bankruptDyanmicBall());
  gallery.addVisual(new covidMap(c));
  gallery.addVisual(new mapOnly());
}

function draw() {
  background(255);
  // Reset Cursor type of mouse
  cursor(ARROW);
  if (gallery.selectedVisual != null) {
    gallery.selectedVisual.draw();
  }
}

// To change the mouse click status to true so that the data will be registered into the data table in the operations object
function mousePressed() {
  operation.mouseClickStatus = true;
}

// reset the object operations variable
function mouseReleased() {
  operation.mouseClickStatus = false;
}
