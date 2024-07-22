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
   * Returns the expected zone of inhibition radius for a given bacteria environment.
   * @param {Bacteria} bacteria - the bacteria object the antibiotic is placed near/on
   * @returns {number} radius in mm
   */
  getExpectedRing(bacteria) {
    return 0;
  }
  /**
   * Returns the concentration of the antibiotic at a given radius from the center of the paper disk.
   * @param {number} radius - radius in millimeters from the center of the paper disk
   * @returns {number} concentration of the antibiotic in micrograms per milliliter
   */
  getConcentration(radius) {
    return 10;
  }
}

class Ampicillin extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Ampicillin";
    this.abbreviation = "AM";
  }
  getExpectedRing(bacteria) {
    return 21;
  }
}

class Chloramphenicol extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Chloramphenicol";
    this.abbreviation = "C";
  }
  getExpectedRing(bacteria) {
    return 24;
  }
}

class Penicillin extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Penicillin";
    this.abbreviation = "P";
  }
  getExpectedRing(bacteria) {
    return 9;
  }
}

class Tetracycline extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Tetracycline";
    this.abbreviation = "TE";
  }
  getExpectedRing(bacteria) {
    return 22;
  }
}

export {
  Antibiotic,
  Ampicillin,
  Chloramphenicol,
  Penicillin,
  Tetracycline,
}
