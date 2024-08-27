import Two from "https://cdn.jsdelivr.net/npm/two.js/+esm";
import AntibioticDisk from "./antibiotic_disk.js";
import Ruler from "./ruler.js";

/**
 * Renders and manages a petri plate with bacteria and antibiotics
 * @param {string} containerId - id of the container element
 */
class PetriPlate {
  constructor(containerId) {
    /**
     * If the simulation has been started
     * @type {boolean}
     */
    this.started = false;
    /**
     * The bacteria strain that's plated
     * @type {Object}
     */
    this.bacteriaStrain = null;
    /**
     * The two.js object responsible for rendering the dish
     * @type {Two}
     */
    this.two = new Two({
      width: 500,
      height: 500,
      autostart: true
    }).appendTo(document.getElementById(containerId));
    this.two.originalHeight = this.two.height;
    /**
     * List of antibiotic disks on the dish
     * @type {Array<AntibioticDisk>}
     */
    this.antibioticDisks = []
    /**
     * Layer where disks are rendered (foreground)
     * @type {Two.Group}
     */
    this.antibioticDiskGroup = null;
    /**
     * Layer where the petri dish background is rendered
     * @type {Two.Group}
     */
    this.petriBackgroundGroup = null;
    /**
     * Layer where the bacteria is rendered
     * @type {Two.Group}
     */
    this.bacteriaGroup = null;
    /**
     * Layer where the masks for the bacteria reside
     * @type {Two.Group}
     */
    this.petriRingGroup = null;
    /**
     * Draggable ruler object
     * @type {Ruler}
     */
    this.rulerWrapper = null;
    /**
     * Layer for the ruler graphic
     * @type {Two.Group}
     */
    this.rulerGroup = null;
    /**
     * Group that orders all the layers
     * @type {Two.Group}
     */
    this.renderGroup = null;
    /**
     * Number to scale millimeters by
     * @type {number}
     */
    this.millimeterScale = 1;
    this.two.renderer.domElement.style.backgroundColor = "transparent";
    this.setup();
  }
  /**
   * Initializes petri dish
   */
  setup() {
    this.two.unbind("update");
    this.two.clear();
    this.started = false;
    this.antibioticDisks = [];
    this.antibioticDiskGroup = this.two.makeGroup();
    this.petriBackgroundGroup = this.two.makeGroup();
    this.bacteriaGroup = this.two.makeGroup();
    this.petriRingGroup = this.two.makeGroup();
    this.rulerGroup = this.two.makeGroup();
    // TODO: mask on mask grouping does not work
    // this.bacteriaGroup.mask = this.petriRingGroup;

    // draw the petri dish background
    const petriDish = this.two.makeCircle(0, 0, 0.8 * this.two.width / 2);
    petriDish.fill = "#3F3824";
    petriDish.stroke = "#909090";
    petriDish.linewidth = 4;

    const petriInnerLine = this.two.makeCircle(0, 0, 0.925 * petriDish.radius);
    petriInnerLine.fill = "transparent";
    petriInnerLine.stroke = "#635C48";
    this.petriBackgroundGroup.add(petriDish);
    this.petriBackgroundGroup.add(petriInnerLine);
    this.petriBackgroundGroup.center();
    this.petriBackgroundGroup.position.x = this.two.width / 2;
    this.petriBackgroundGroup.position.y = this.two.height / 2;

    this.millimeterScale = petriDish.radius / 150;

    // draw the ruler
    this.rulerWrapper = new Ruler(this.millimeterScale * 25 + 5, this.millimeterScale * 10 + 5, 50, 10, this.millimeterScale, this.two);
    this.rulerGroup = this.rulerWrapper.shape;

    // mask the ring group with a circle (matches bacteria circle)
    const mask = this.two.makeCircle(0, 0, 0.77 * this.two.width / 2);
    mask.fill = "#FFFFFF";
    mask.linewidth = 0;
    // center the mask
    mask.position.x = this.two.width / 2;
    mask.position.y = this.two.height / 2;
    this.petriRingGroup.mask = mask;
    this.renderGroup = this.two.makeGroup([this.petriBackgroundGroup, this.bacteriaGroup, this.petriRingGroup, this.antibioticDiskGroup, this.rulerGroup]);
  }
  /**
   * Removes bacteria and resets simulation
   * @param {boolean} keepDisks - if true, antibiotics won't be destroyed
   */
  reset(keepDisks = false) {
    this.two.unbind("update");
    if (keepDisks) {
      this.bacteriaGroup.remove(...this.bacteriaGroup.children);
      this.petriRingGroup.remove(...this.petriRingGroup.children);
      this.bacteriaStrain = null;
      this.started = false;
      this.antibioticDisks.forEach(disk => {
        disk.dragShape.toggleDraggable(true);
        disk.dragShape.toggleRemovable(true);
      });
    } else {
      this.setup();
    }
  }
  /**
   * Adds an antibiotic disk to the petri plate
   * @param {Antibiotic} antibiotic - antibiotic to add to the petri plate
   */
  addAntibiotic(antibiotic) {
    if (this.started) return;
    const newDisk = new AntibioticDisk((this.two.width / 2) / this.scale, (this.two.height / 2) / this.scale, 7 * this.millimeterScale, antibiotic, this.two);
    this.antibioticDisks.push(newDisk)
    this.antibioticDiskGroup.add(newDisk.shape);
  }
  /**
   * Run simulation
   */
  run() {
    // remove stale antibiotic placements
    this.antibioticDisks = this.antibioticDisks.filter((disk) => !disk.dragShape._removed);
    this.started = true;
    // don't plate if no bacteria
    if (!this.bacteriaStrain) return;
    // draw the bacteria
    console.log(this.two.width);
    const bacteriaCircle = this.two.makeCircle(0, 0, 0.77 * this.two.width / 2 / this.scale);
    bacteriaCircle.fill = "#FFD97766";
    this.bacteriaGroup.add(bacteriaCircle);
    this.bacteriaGroup.position.x = this.two.width / 2 / this.scale;
    this.bacteriaGroup.position.y = this.two.height / 2 / this.scale;

    // disable dragging and removability for all antibiotics
    this.antibioticDisks.forEach(disk => {
      disk.dragShape.isDragging = false;
      disk.dragShape.toggleDraggable(false);
      disk.dragShape.toggleRemovable(false);
    });
    this.antibioticDisks.forEach(disk => {
      // if the antibiotic is outside the dish, skip
      if (disk.dragShape.position.distanceTo(this.bacteriaGroup.position) > 0.8 * this.two.width / 2) return;
      const expectedRing = disk.antibiotic.getExpectedRing(this.bacteriaStrain) * this.millimeterScale;
      const spread = this.two.makeCircle(
        disk.dragShape.position.x,
        disk.dragShape.position.y,
        0,
      );
      spread.fill = "#3F3824";
      spread.linewidth = 0;
      spread.radius = 0;
      spread.maxRadius = expectedRing;
      this.petriRingGroup.add(spread);
    });

    // animate the bacteria and rings
    this.two.bind("update", update);
    this.two.play();

    this.bacteriaGroup.opacity = 0;
    const animationDuration = 1500;
    const initialFrameCount = this.two.frameCount;

    let self = this;
    function update(frameCount) {
      self.bacteriaGroup.opacity = Math.min(1, self.bacteriaGroup.opacity + 1 / animationDuration);
      self.petriRingGroup.children.forEach((ring) => {
        ring.radius = Math.min(ring.maxRadius, ring.radius + ring.maxRadius / animationDuration);
      });
      if (self.two.frameCount - initialFrameCount > animationDuration) {
        self.two.unbind("update");
      }
    }
  }

  /**
   * @param {number} value - scale factor
   */
  set scale(value) {
    if (!this.renderGroup) return;
    this.renderGroup.scale = value;
  }

  get scale() {
    return this.renderGroup ? this.renderGroup.scale : 1;
  }
}

export default PetriPlate;
