class DraggableShape {
  /**
   * Wraps a Two.js shape to manage drag state and events
   * @param {Two.Shape} shape - shape to make draggable
   * @param {Two} two - Two.js instance
   */
  constructor(shape, two) {
    /**
     * Two.js shape wrapped by this class
     * @type {Two.Shape}
     */
    this.shape = shape;

    two.update(); // ensures passed shape exists on the dom
    this.shape._renderer.elem.addEventListener("mousedown", this.mouseDown.bind(this));
    this.shape._renderer.elem.addEventListener("mouseup", this.mouseUp.bind(this));
    this.shape._renderer.elem.addEventListener("mousemove", this.mouseMove.bind(this));
    this.shape._renderer.elem.addEventListener("mouseleave", this.mouseLeave.bind(this));

    /**
     * Whether the shape is currently being dragged
     * @type {boolean}
     */
    this.isDragging = false;
    /**
     * Offset from the shape's position to the click event
     * @type {Object}
     */
    this.clickOffset = { x: 0, y: 0 };
    /**
     * Two.js instance
     * @type {Two}
     */
    this.two = two;
    /**
     * Whether the shape is currently draggable
     * @type {boolean}
     * @private
     */
    this._draggable = true;

    this.shape._renderer.elem.style.cursor = "grab";
  }
  /**
   * Gives coordinates of the click event relative to the two.js instance
   * @param {MouseEvent} e - mouse event
   * @returns {Object} - x and y position of the click event
   */
  getClickPosition(e) {
    const container = this.two.renderer.domElement;
    const containerRect = container.getBoundingClientRect();
    const containerStyle = window.getComputedStyle(container, null);
    const paddingLeft = parseInt(containerStyle.paddingLeft, 10);
    const paddingTop = parseInt(containerStyle.paddingTop, 10);
    const borderLeft = parseInt(containerStyle.borderLeftWidth, 10);
    const borderTop = parseInt(containerStyle.borderTopWidth, 10);

    return {
      x: e.clientX - containerRect.left - paddingLeft - borderLeft,
      y: e.clientY - containerRect.top - paddingTop - borderTop,
    };
  }
  /**
   * Provide position to move the shape to based on the click event
   * @param {MouseEvent} e - mouse event
   * @returns {Object} - x and y offset from the shape's position
   */
  calculateClickOffset(e) {
    const clickPosition = this.getClickPosition(e);
    const position = this.shape.position;
    const clickOffsetX = clickPosition.x - position.x;
    const clickOffsetY = clickPosition.y - position.y;
    return { x: clickOffsetX, y: clickOffsetY };
  }
  /**
   * Handles when the shape is left-clicked
   * @param {MouseEvent} e - mouse event
   */
  mouseDown(e) {
    if (e.button !== 0) {
      return;
    }
    if (!this._draggable) {
      this.isDragging = false;
      return;
    }
    this.isDragging = true;
    this.shape._renderer.elem.style.cursor = "grabbing";
    this.clickOffset = this.calculateClickOffset(e);
  }
  /**
   * Handles when the shape is released
   * @param {MouseEvent} e - mouse event
   */
  mouseUp(e) {
    // only stop dragging if left mouse button is released
    if (!this._draggable || e.button !== 0) {
      return;
    }
    this.isDragging = false;
    this.shape._renderer.elem.style.cursor = "grab";
  }
  /**
   * Handles when the mouse is moved over the shape while dragging
   * @param {MouseEvent} e - mouse event
   */
  mouseMove(e) {
    if (e.buttons !== 1) {
      this.mouseUp({ button: 0 });
      return;
    }
    // print distance between center of shape and mouse position
    if (!this._draggable) {
      return;
    }
    if (this.isDragging) {
      const clickPosition = this.getClickPosition(e);
      const translatePosition = { x: clickPosition.x - this.clickOffset.x, y: clickPosition.y - this.clickOffset.y };
      this.shape.translation.set(translatePosition.x, translatePosition.y);
      this._lastMousePosition = clickPosition;
    }
  }
  /**
   * Toggles the draggable state of the shape
    * @param {boolean} enable - enable or disable dragging, default toggles the current state
   */
  toggleDraggable(enable = !this._draggable) {
    this._draggable = enable;
    this.shape._renderer.elem.style.cursor = this._draggable ? "grab" : "default";
  }
  /**
   * Handles when the mouse leaves the shape, as it's possible for the mouse to leave the shape while dragging
   */
  mouseLeave(e) {
    if (e.buttons !== 1) {
      this.mouseUp({ button: 0 });
    }
  };
}

export default DraggableShape;
