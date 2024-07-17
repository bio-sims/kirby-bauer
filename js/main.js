import PetriPlate from './modules/petri_plate.js';
import { Antibiotic, Ampicillin, Chloramphenicol, Penicillin, Tetracycline } from './modules/antibiotics.js';

/**
 * Array of antibiotic classes and amounts
 * @type {Array<{class: Antibiotic, amount: number}>}
 */
const antibiotics = [
  { class: Ampicillin, amount: 30 },
  { class: Chloramphenicol, amount: 30 },
  { class: Penicillin, amount: 30 },
  { class: Tetracycline, amount: 30 },
]

/**
 * Primary petri plate instance
 * @type {PetriPlate}
 */
let mainPetri = null;

/**
 * Initializes the simulation and event listeners
 */
function main() {
  mainPetri = new PetriPlate("kirby-sim-container");
  mainPetri.addAntibiotic(new Ampicillin(30));

  // -- temporary fill dropdown with antibiotics --
  const dropdown = document.getElementById("antibiotic-name");
  antibiotics.forEach((antibiotic) => {
    const option = document.createElement("option");
    option.text = antibiotic.class.name;
    dropdown.add(option);
  });

  // handle form submission
  document.getElementById("add-antibiotic-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const antibioticName = document.getElementById("antibiotic-name").value;
    const antibiotic = antibiotics.find((antibiotic) => antibiotic.class.name === antibioticName);
    mainPetri.addAntibiotic(new antibiotic.class(antibiotic.amount));
  });
}

main();
