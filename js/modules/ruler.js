import DraggableShape from "./draggable_shape.js";

class Ruler {
  /**
   * Creates a ruler svg
   * @param {number} x - x pos
   * @param {number} y - y pos
   * @param {number} size - number of ticks
   * @param {number} height - height in mm
   * @param {number} scale - pixel/mm ratio
   * @param {Two} two - the two objecto render to
   */
  constructor(x, y, size, height, scale, two) {
    const base = two.makeRoundedRectangle(x, y, (size + 5) * scale * 2 , height * scale * 2)
    const group = two.makeGroup(base);
    // draw ticks and numbers
    for (let i = 0; i <= size; i++) {
      const xOffsetPos = x - (size * scale) + (scale * (i * 2));
      let tickHeight = (height * scale) / 4;
      if (i % 10 === 0) {
        const text = two.makeText(i / 10, xOffsetPos, y + tickHeight + (scale * 2));
        tickHeight *= 4;
        group.add(text);
      } else if (i % 5 === 0) {
        tickHeight *= 2;
      }
      const tick = two.makeRectangle(xOffsetPos, y - (height * scale) + (tickHeight / 2), 1, tickHeight);
      tick.fill = "black";
      tick.linewidth = 0;
      group.add(tick);
    }
    group.translation.set(x, y);
    this.dragShape = new DraggableShape(group, two);
    this.dragShape.toggleRemovable(false);
  }
  get shape() {
    return this.dragShape.shape;
  }
}

export default Ruler;
