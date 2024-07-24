import Two from "https://cdn.jsdelivr.net/npm/two.js/+esm";
import AntibioticDisk from "./antibiotic_disk.js";

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
    this.two.renderer.domElement.addEventListener("mousemove", this.mouseMove.bind(this));
    this.setup();
  }
  /**
   * Initializes petri dish
   */
  setup() {
    this.two.clear();
    this.started = false;
    this.antibioticDisks = [];
    this.antibioticDiskGroup = this.two.makeGroup();
    this.petriBackgroundGroup = this.two.makeGroup();
    this.bacteriaGroup = this.two.makeGroup();
    this.petriRingGroup = this.two.makeGroup();
    this.renderGroup = this.two.makeGroup([this.petriBackgroundGroup, this.bacteriaGroup, this.petriRingGroup, this.antibioticDiskGroup]);

    // TODO: mask on mask grouping does not work
    this.bacteriaGroup.mask = this.petriRingGroup;

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

    this.millimeterScale = petriDish.radius / 100;
  }
  /**
   * Removes bacteria and resets simulation
   * @param {boolean} keepDisks - if true, antibiotics won't be destroyed
   */
  reset(keepDisks = false) {
    this.started = false;
    this.bacteriaGroup.remove(this.bacteriaGroup.children);
    this.petriRingGroup.remove(this.petriRingGroup.children);
    this.bacteriaStrain = null;
    if (!keepDisks) {
      this.antibioticDiskGroup.remove(this.antibioticDiskGroup.children);
      this.antibioticDisks = [];
    } else {
      this.antibioticDisks.forEach(disk => {
        disk.dragShape.toggleDraggable(true);
        disk.dragShape.toggleRemovable(true);
      });
    }
  }
  /**
   * Adds an antibiotic disk to the petri plate
   * @param {Antibiotic} antibiotic - antibiotic to add to the petri plate
   */
  addAntibiotic(antibiotic) {
    if (this.started) return;
    const newDisk = new AntibioticDisk(this.two.width / 2, this.two.height / 2, 7 * this.millimeterScale, antibiotic, this.two);
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
    const bacteriaCircle = this.two.makeCircle(0, 0, 0.77 * this.two.width / 2)
    bacteriaCircle.fill = "#FFD97766";
    this.bacteriaGroup.add(bacteriaCircle);
    this.bacteriaGroup.position.x = this.two.width / 2;
    this.bacteriaGroup.position.y = this.two.height / 2;

    // disable dragging and removability for all antibiotics
    this.antibioticDisks.forEach(disk => {
      disk.dragShape.isDragging = false;
      disk.dragShape.toggleDraggable(false);
      disk.dragShape.toggleRemovable(false);
    });
    this.antibioticDisks.forEach(disk => {
      const spread = this.two.makeCircle(
        disk.dragShape.position.x,
        disk.dragShape.position.y,
        disk.antibiotic.getExpectedRing(this.bacteriaStrain) * this.millimeterScale
      );
      spread.fill = "#3F3824";
      spread.linewidth = 0;
      this.petriRingGroup.add(spread);
    });
  }
  /**
   * Ensures any antibiotics that are supposed to be dragged are updated properly
   * @param {MouseEvent} e - mouse event
   */
  mouseMove(e) {
    if (e.buttons !== 1) {
      return;
    }
    this.antibioticDisks.forEach(antibiotic => {
      if (antibiotic.dragShape.isDragging) {
        antibiotic.dragShape.mouseMove(e);
      }
    });
  }
}

export default PetriPlate;
