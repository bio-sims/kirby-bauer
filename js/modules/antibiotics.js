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
   * @param {Object} bacteria - the bacteria object the antibiotic is placed near/on
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
  /**
   * Get the table of susceptibility for the antibiotic (rings of inhibition).
   * @param {Object} bacteria - the bacteria object to get the susceptibility for
   */
  getSusceptibility(bacteria) {
    // for each possible bacteria, return the susceptibility
    return { "resistant": 0, "susceptible": 0 }
  }
}

class Ampicillin extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Ampicillin";
    this.abbreviation = "AM";
  }
  getExpectedRing(bacteria) {
    switch (bacteria.name) {
      case "Escherichia coli":
        return 21;
      default:
        return super.getExpectedRing(bacteria);
    }
  }
  getSusceptibility(bacteria) {
    switch (bacteria.name) {
      case "Escherichia coli":
        return { "resistant": 11, "susceptible": 14 };
      default:
        return super.getSusceptibility(bacteria);
    }
  }
}

class Chloramphenicol extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Chloramphenicol";
    this.abbreviation = "C";
  }
  getExpectedRing(bacteria) {
    switch (bacteria.name) {
      case "Escherichia coli":
        return 24;
      default:
        return super.getExpectedRing(bacteria);
    }
  }
  getSusceptibility(bacteria) {
    switch (bacteria.name) {
      case "Escherichia coli":
        return { "resistant": 12, "susceptible": 18 };
      default:
        return super.getSusceptibility(bacteria);
    }
  }
}

class Penicillin extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Penicillin";
    this.abbreviation = "P";
  }
  getExpectedRing(bacteria) {
    switch (bacteria.name) {
      case "Escherichia coli":
        return 9;
      default:
        return super.getExpectedRing(bacteria);
    }
  }
  getSusceptibility(bacteria) {
    switch (bacteria.name) {
      case "Escherichia coli":
        return { "resistant": 20, "susceptible": 29 };
      default:
        return super.getSusceptibility(bacteria);
    }
  }
}

class Tetracycline extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Tetracycline";
    this.abbreviation = "TE";
  }
  getExpectedRing(bacteria) {
    switch (bacteria.name) {
      case "Escherichia coli":
        return 22;
      default:
        return super.getExpectedRing(bacteria);
    }
  }
  getSusceptibility(bacteria) {
    switch (bacteria.name) {
      case "Escherichia coli":
        return { "resistant": 14, "susceptible": 19 };
      default:
        return super.getSusceptibility(bacteria);
    }
  }
}

export {
  Antibiotic,
  Ampicillin,
  Chloramphenicol,
  Penicillin,
  Tetracycline,
}
