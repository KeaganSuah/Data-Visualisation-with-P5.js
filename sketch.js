// Global variable to store the gallery object. The gallery object is a container for all the visualisations.
let gallery;
// Global variable to be assigned with the dataVisualisationToolss object
let dataVisualisationTools;
// Global variable of the canvas, which has to be accessed throughout all data visualisations
var c;

function setup() {
  // Create a canvas to fill the content div from index.html.
  canvasContainer = select("#app");

  // Create a new gallery object.
  gallery = new Gallery();

  // Create a new dataVisualisationTools Object
  dataVisualisationTools = new DataVisualisationTools();

  c = createCanvas(1024, 576 + dataVisualisationTools.height);
  c.parent("app");

  // Add the visualisation objects here.
  gallery.addVisual(new TechDiversityRace());
  gallery.addVisual(new TechDiversityGender());
  gallery.addVisual(new PayGapByJob2017());
  gallery.addVisual(new PayGapTimeSeries());
  gallery.addVisual(new ClimateChange());
  gallery.addVisual(new NutrientsTimeSeries());
  gallery.addVisual(new bankruptDyanmicBall());
  gallery.addVisual(new covidMap());
}

function draw() {
  // Reset Cursor type of mouse
  cursor(ARROW);
  if (gallery.selectedVisual != null) {
    gallery.selectedVisual.draw();
  }
}

// To change the mouse click status to true so that the data will be registered into the data table in the dataVisualisationToolss object
function mousePressed() {
  dataVisualisationTools.mouseClickStatus = true;
}

// reset the object dataVisualisationToolss variable
function mouseReleased() {
  dataVisualisationTools.mouseClickStatus = false;
}
