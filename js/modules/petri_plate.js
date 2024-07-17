import Two from 'https://cdn.jsdelivr.net/npm/two.js/+esm';
import AntibioticDisk from "./antibiotic_disk.js";

/**
 * Renders and manages a petri plate with bacteria and antibiotics
 * @param {string} containerId - id of the container element
 */
class PetriPlate {
  constructor(containerId) {
    this.two = new Two({
      width: 500,
      height: 500,
      autostart: true
    }).appendTo(document.getElementById(containerId));
    this.antibiotics = [];
    this.petriBackgroundGroup = null;
    this.two.renderer.domElement.style.backgroundColor = '#000000';
    this.drawPetriBackground();
  }
  /**
   * Draws the petri dish background layer
   */
  drawPetriBackground() {
    this.petriBackgroundGroup = this.two.makeGroup();
    const petriDish = this.two.makeCircle(0, 0, 0.8 * this.two.width / 2);
    petriDish.fill = '#3F3824';
    petriDish.stroke = '#909090';
    petriDish.linewidth = 4;

    const petriInnerLine = this.two.makeCircle(0, 0, 0.925 * petriDish.radius);
    petriInnerLine.fill = 'transparent';
    petriInnerLine.stroke = '#635C48';
    this.petriBackgroundGroup.add(petriDish);
    this.petriBackgroundGroup.add(petriInnerLine);
    this.petriBackgroundGroup.center();
    this.petriBackgroundGroup.position.x = this.two.width / 2;
    this.petriBackgroundGroup.position.y = this.two.height / 2;
  }
  /**
   * Adds an antibiotic disk to the petri plate
   * @param {Antibiotic} antibiotic - antibiotic to add to the petri plate
   */
  addAntibiotic(antibiotic) {
    this.antibiotics.push(new AntibioticDisk(this.two.width / 2, this.two.height / 2, antibiotic, this.two));
  }
}

export default PetriPlate;
