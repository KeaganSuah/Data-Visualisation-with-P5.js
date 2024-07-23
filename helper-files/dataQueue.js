// Queue data structure is used in the dataVisualisationTools object for the data breakdown table, where the data arrays are stored in a FIFO method. Object is created using ES6 syntax to show that I know how to create object using class syntax.
class Queue {
  // Array is used to implement a Queue
  constructor() {
    this.items = [];
  }

  // adding element to the queue
  enqueue(element) {
    this.items.push(element);
  }

  // removing element from the queue
  dequeue() {
    if (this.isEmpty()) {
      return false;
    } else {
      return this.items.shift();
    }
  }

  // Return the length of the queue
  length() {
    return this.items.length;
  }

  // return true if the queue is empty.
  isEmpty() {
    return this.items.length == 0;
  }

  // Return the queue array when method is called
  printQueue() {
    return this.items;
  }
}
