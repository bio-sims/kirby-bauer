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
      if (susceptibility.susceptible === susceptibility.resistant) {
        row.insertCell().textContent = `${susceptibility.susceptible}`;
      } else if (susceptibility.susceptible === 0) {
        row.insertCell().textContent = `0`;
      } else {
        row.insertCell().textContent = `${susceptibility.resistant + 1}-${susceptibility.susceptible}`;
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
}

main();
