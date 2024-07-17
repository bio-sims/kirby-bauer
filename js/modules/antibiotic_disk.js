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
  constructor(x, y, antibiotic, two) {
    this.antibiotic = antibiotic;
    const circle = two.makeCircle(x, y, 18);
    const text = two.makeText(antibiotic.abbreviation, x, y);
    this.shape = new DraggableShape(two.makeGroup([circle, text]), two);
  }
}

export default AntibioticDisk;
