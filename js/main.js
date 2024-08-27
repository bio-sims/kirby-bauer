import PetriPlate from "./modules/petri_plate.js";
import {
  Antibiotic,
  Amoxicillin,
  Ampicillin,
  Cephalothin,
  Chloramphenicol,
  Ciprofloxacin,
  Clindamycin,
  Erythromycin,
  Oxacillin,
  Penicillin,
  Streptomycin,
  Tetracycline,
  Tobramycin,
  TrimethoprimSulfa,
  Vancomycin
} from "./modules/antibiotics.js";
import { getThemeIconData, setupTheme, toggleTheme } from "./modules/theme.js";
import bacteria from "./modules/bacteria.js";

/**
 * Array of antibiotic classes and amounts
 * @type {Array<{class: Antibiotic, amount: number}>}
 */
const antibiotics = [
  { class: Ampicillin, amount: 30 },
  { class: Amoxicillin, amount: 30 },
  { class: Cephalothin, amount: 30 },
  { class: Chloramphenicol, amount: 30 },
  { class: Ciprofloxacin, amount: 30 },
  { class: Clindamycin, amount: 30 },
  { class: Erythromycin, amount: 30 },
  { class: Oxacillin, amount: 30 },
  { class: Penicillin, amount: 30 },
  { class: Streptomycin, amount: 30 },
  { class: Tetracycline, amount: 30 },
  { class: Tobramycin, amount: 30 },
  { class: TrimethoprimSulfa, amount: 30 },
  { class: Vancomycin, amount: 30 },
]

/**
 * Primary petri plate instance
 * @type {PetriPlate}
 */
let mainPetri = null;

function updateSusceptibilityTable() {
  // get unique antibiotics on the platter, this currently assumes amount is irrelevant (which, right now it is)
  const currentAntibiotics = mainPetri.antibioticDisks.reduce((acc, disk) => {
    if (!acc.some((antibiotic) => antibiotic.name === disk.antibiotic.name)) {
      acc.push(disk.antibiotic);
    }
    return acc;
  }, []);
  // sort alphabetically
  currentAntibiotics.sort((a, b) => a.name.localeCompare(b.name));
  // get the selected bacteria
  const bacteriaType = document.getElementById("strain-type").value;
  const bacteriaObj = bacteria[bacteriaType];
  // get the table body
  const tableBody = document.getElementById("susceptibility-table-body");
  tableBody.innerHTML = "";
  // fill in the table
  if (!bacteria || currentAntibiotics.length === 0) {
    const row = tableBody.insertRow();
    row.insertCell().textContent = `No data`;
    row.insertCell().textContent = "-";
    row.insertCell().textContent = "-";
    row.insertCell().textContent = "-";
  } else {
    currentAntibiotics.forEach((antibiotic) => {
      const susceptibility = antibiotic.getSusceptibility(bacteriaObj);
      const row = tableBody.insertRow();
      row.insertCell().textContent = `${antibiotic.name} (${antibiotic.abbreviation})`;
      row.insertCell().textContent = `≤ ${susceptibility.resistant}`;
      if (Math.abs(susceptibility.resistant - susceptibility.susceptible) <= 1) {
        row.insertCell().textContent = `-`;
      } else if (susceptibility.susceptible === 0) {
        row.insertCell().textContent = `0`;
      } else {
        row.insertCell().textContent = `${susceptibility.resistant + 1}-${susceptibility.susceptible - 1}`;
      }
      row.insertCell().textContent = `≥ ${susceptibility.susceptible}`;
    });
  }
}

/**
 * Initializes the simulation and event listeners
 */
function main() {
  setupTheme();
  document.getElementById("theme-icon-path").setAttribute("d", getThemeIconData());
  mainPetri = new PetriPlate("kirby-sim");
  const originalHeight = mainPetri.two.height;

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

  const selectBacteriaForm = document.getElementById("select-bacteria-form")

  document.getElementById("add-antibiotic-button").addEventListener("click", (e) => {
    const antibioticName = document.getElementById("antibiotic-name").value;
    const antibiotic = antibiotics.find((antibiotic) => antibiotic.class.name === antibioticName);
    mainPetri.addAntibiotic(new antibiotic.class(antibiotic.amount));
    updateSusceptibilityTable();
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
    document.getElementById("reset-test-button").disabled = false;
    document.getElementById("antibiotic-name").disabled = true;
    document.getElementById("add-antibiotic-button").disabled = true;
  });

  document.getElementById("reset-test-button").addEventListener("click", (e) => {
    mainPetri.reset(!document.getElementById("do-hard-reset").checked);
    // enable forms
    selectBacteriaForm.querySelectorAll("button, input, select, textarea").forEach((elem) => elem.disabled = false);

    updateSusceptibilityTable();
  });

  document.getElementById("strain-type").addEventListener("change", (e) => {
    updateSusceptibilityTable();
  });

  // --- theme events ---
  document.getElementById("theme-toggle").addEventListener("click", () => {
    toggleTheme();
    // replace with svg of opposite theme
    const themeSvgPath = document.getElementById("theme-icon-path");
    themeSvgPath.setAttribute("d", getThemeIconData());
  });

  updateSusceptibilityTable();

  // --- petri scale events ---
  window.addEventListener("resize", () => {
    // get difference between height of svg and current height of container
    const svg = document.getElementById("kirby-sim");
    const container = svg.parentElement;
    const containerRect = container.getBoundingClientRect();
    const scale = containerRect.height / originalHeight;
    // set the scale of the svg and the width/height of the svg
    mainPetri.scale = scale;
    mainPetri.two.width = containerRect.height;
    mainPetri.two.height = containerRect.height;
  });

  window.dispatchEvent(new Event("resize"));

  let isFullscreen = false;
  const fullscreenButton = document.getElementById("main-fullscreen-button");
  // --- fullscreen events ---
  fullscreenButton.addEventListener("click", () => {
    console.log("fullscreen");
    // toggle hide on configuration
    const config = document.getElementById("side-panel");
    const petriContainer = document.getElementById("kirby-sim-container");
    isFullscreen = !isFullscreen;
    fullscreenButton.querySelector('path').setAttribute("d",
      isFullscreen ? "M6 16h2v2c0 .55.45 1 1 1s1-.45 1-1v-3c0-.55-.45-1-1-1H6c-.55 0-1 .45-1 1s.45 1 1 1m2-8H6c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1s-1 .45-1 1zm7 11c.55 0 1-.45 1-1v-2h2c.55 0 1-.45 1-1s-.45-1-1-1h-3c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1m1-11V6c0-.55-.45-1-1-1s-1 .45-1 1v3c0 .55.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1z"
                   : "M6 14c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1H7v-2c0-.55-.45-1-1-1m0-4c.55 0 1-.45 1-1V7h2c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1m11 7h-2c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1s-1 .45-1 1zM14 6c0 .55.45 1 1 1h2v2c0 .55.45 1 1 1s1-.45 1-1V6c0-.55-.45-1-1-1h-3c-.55 0-1 .45-1 1"
    );
    config.style.display = isFullscreen ? "none" : "flex";
    petriContainer.classList.toggle("fullscreen", isFullscreen);
    window.dispatchEvent(new Event("resize"));
  });
}

main();
