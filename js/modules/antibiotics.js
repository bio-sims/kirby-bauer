class Antibiotic {
  /**
   * An instance of the antibiotic loaded into a paper disk.
   * @param {number} amount - initial amount of the antibiotic in the paper disk in micrograms
   */
  constructor(amount) {
    /**
     * Friendly name of the antibiotic.
     * @type {string}
     */
    this.name = "Antibiotic";
    /**
     * Abbreviation of the antibiotic name.
     * @type {string}
     */
    this.abbreviation = "Abbr.";
    /**
     * Initial amount of the antibiotic in the paper disk in micrograms.
     * @type {number}
     */
    this.initialAmount = amount ?? 0;
  }
  /**
   * Returns the concentration of the antibiotic at a given radius from the center of the paper disk.
   * @param {number} radius - radius in millimeters from the center of the paper disk
   * @returns {number} - concentration of the antibiotic in micrograms per milliliter
   */
  getConcentration(radius) {
    return 1;
  }
}

class Ampicillin extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Ampicillin";
    this.abbreviation = "AM";
  }
  getConcentration(radius) {
    return 1;
  }
}

class Chloramphenicol extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Chloramphenicol";
    this.abbreviation = "C";
  }
  getConcentration(radius) {
    return 1;
  }
}

class Penicillin extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Penicillin";
    this.abbreviation = "P";
  }
  getConcentration(radius) {
    return 1;
  }
}

class Tetracycline extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Tetracycline";
    this.abbreviation = "Tc";
  }
  getConcentration(radius) {
    return 1;
  }
}

export {
  Antibiotic,
  Ampicillin,
  Chloramphenicol,
  Penicillin,
  Tetracycline,
}
