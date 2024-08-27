import DraggableShape from "./draggable_shape.js";
import { Antibiotic } from "./antibiotics.js";

class AntibioticDisk {
  /**
   * Antibiotic disk instance to be placed on the petri plate
   * @param {number} x - x-coordinate of the disk
   * @param {number} y - y-coordinate of the disk
   * @param {Antibiotic} antibiotic - antibiotic instance
   * @param {Two} two - Two.js instance
   */
  constructor(x, y, radius, antibiotic, two) {
    this.antibiotic = antibiotic;
    const circle = two.makeCircle(x, y, radius);
    const text = two.makeText(antibiotic.abbreviation, x, y);
    text.size = 9;
    const group = two.makeGroup([circle, text]);
    group.center();
    group.translation.set(x, y);
    this.dragShape = new DraggableShape(group, two);
  }
  get shape() {
    return this.dragShape.shape;
  }
}

export default AntibioticDisk;
