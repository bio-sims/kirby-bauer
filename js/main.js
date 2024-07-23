import PetriPlate from "./modules/petri_plate.js";
import { Antibiotic, Ampicillin, Chloramphenicol, Penicillin, Tetracycline } from "./modules/antibiotics.js";
import { getThemeIconData, setupTheme, toggleTheme } from "./modules/theme.js";
import bacteria from "./modules/bacteria.js";

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

  // -- fill select boxes --
  const antibioticName = document.getElementById("antibiotic-name");
  antibiotics.forEach((antibiotic) => {
    const option = document.createElement("option");
    option.text = antibiotic.class.name;
    antibioticName.add(option);
  });

  const strainType = document.getElementById("strain-type");
  Object.entries(bacteria).forEach(([key, value]) => {
    const option = document.createElement("option");
    option.text = value.name;
    option.value = key;
    strainType.add(option);
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
    // get bacteria strain
    const bacteriaFormData = new FormData(selectBacteriaForm);
    mainPetri.bacteriaStrain = bacteria[bacteriaFormData.get("strain-type")];
    // run simulation
    mainPetri.run();
    // disable bacteria form
    document.getElementById("run-test-button").disabled = true;
    document.getElementById("strain-type").disabled = true;
    // disable adding form
    addAntibioticForm.querySelectorAll("button, input, select, textarea").forEach((elem) => elem.disabled = true);
  });

  document.getElementById("reset-test-button").addEventListener("click", (e) => {
    mainPetri.reset(!document.getElementById("do-hard-reset").checked);
    document.getElementById("run-test-button").disabled = false;
    // enable forms
    addAntibioticForm.querySelectorAll("button, input, select, textarea").forEach((elem) => elem.disabled = false);
    selectBacteriaForm.querySelectorAll("input, select, textarea").forEach((elem) => elem.disabled = false);
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
