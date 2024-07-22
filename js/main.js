import PetriPlate from "./modules/petri_plate.js";
import { Antibiotic, Ampicillin, Chloramphenicol, Penicillin, Tetracycline } from "./modules/antibiotics.js";
import { getThemeIconData, setupTheme, toggleTheme } from "./modules/theme.js";

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
  setupTheme();
  document.getElementById("theme-icon-path").setAttribute("d", getThemeIconData());
  mainPetri = new PetriPlate("kirby-sim-container");

  // -- temporary fill dropdown with antibiotics --
  const dropdown = document.getElementById("antibiotic-name");
  antibiotics.forEach((antibiotic) => {
    const option = document.createElement("option");
    option.text = antibiotic.class.name;
    dropdown.add(option);
  });

  // handle form submission
  const addAntibioticForm = document.getElementById("add-antibiotic-form");
  const selectBacteriaForm = document.getElementById("select-bacteria-form")

  addAntibioticForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const antibioticName = document.getElementById("antibiotic-name").value;
    const antibiotic = antibiotics.find((antibiotic) => antibiotic.class.name === antibioticName);
    mainPetri.addAntibiotic(new antibiotic.class(antibiotic.amount));
  });

  selectBacteriaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (mainPetri.started) return;
    mainPetri.run();
    // disable adding form
    addAntibioticForm.querySelectorAll("button, input, select, textarea").forEach((elem) => elem.disabled = true);
  });

  document.getElementById("reset-test-button").addEventListener("click", (e) => {
    mainPetri.setup();
    // enable adding form
    addAntibioticForm.querySelectorAll("button, input, select, textarea").forEach((elem) => elem.disabled = false);
  });

  // --- theme events ---
  document.getElementById("theme-toggle").addEventListener("click", () => {
    toggleTheme();
    // replace with svg of opposite theme
    const themeSvgPath = document.getElementById("theme-icon-path");
    themeSvgPath.setAttribute("d", getThemeIconData());
  });
}

main();
