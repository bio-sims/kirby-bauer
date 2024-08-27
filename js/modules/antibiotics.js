// This file is very repetitive due to the potential for extensive customization of each antibiotic.
// https://bio.libretexts.org/Learning_Objects/Laboratory_Experiments/Microbiology_Labs/Microbiology_Labs_I/09%3A_Kirby-Bauer_(Antibiotic_Sensitivity)
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

class Amoxicillin extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Amoxicillin";
    this.abbreviation = "AMC";
  }
  getExpectedRing(bacteria) {
    const expected = {
      "Escherichia coli": 17,
      "Pseudomonas aeruginosa": 0,
      "Staphylococcus aureus": 31,
    };
    return expected[bacteria.name] ?? super.getExpectedRing(bacteria);
  }
  getSusceptibility(bacteria) {
    if (bacteria.genus === "Staphylococcus") return { "resistant": 19, "susceptible": 21 };
    return { "resistant": 13, "susceptible": 17 };
  }
}

class Ampicillin extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Ampicillin";
    this.abbreviation = "AM";
  }
  getExpectedRing(bacteria) {
    const expected = {
      "Escherichia coli": 15,
      "Pseudomonas aeruginosa": 0,
      "Staphylococcus aureus": 30,
    };
    return expected[bacteria.name] ?? super.getExpectedRing(bacteria);
  }
  getSusceptibility(bacteria) {
    if (bacteria.genus === "Staphylococcus") return { "resistant": 28, "susceptible": 29 };
    return { "resistant": 13, "susceptible": 18 };
  }
}

class Cephalothin extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Cephalothin";
    this.abbreviation = "CF";
  }
  getExpectedRing(bacteria) {
    const expected = {
      "Escherichia coli": 19,
      "Pseudomonas aeruginosa": 0,
      "Staphylococcus aureus": 32,
    };
    return expected[bacteria.name] ?? super.getExpectedRing(bacteria);
  }
  getSusceptibility(bacteria) {
    return { "resistant": 13, "susceptible": 24 };
  }
}

class Chloramphenicol extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Chloramphenicol";
    this.abbreviation = "C";
  }
  getExpectedRing(bacteria) {
    const expected = {
      "Escherichia coli": 27,
      "Pseudomonas aeruginosa": 0,
      "Staphylococcus aureus": 25,
    };
    return expected[bacteria.name] ?? super.getExpectedRing(bacteria);
  }
  getSusceptibility(bacteria) {
    return { "resistant": 12, "susceptible": 18 };
  }
}

class Ciprofloxacin extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Ciprofloxacin";
    this.abbreviation = "CIP";
  }
  getExpectedRing(bacteria) {
    const expected = {
      "Escherichia coli": 32,
      "Pseudomonas aeruginosa": 28,
      "Staphylococcus aureus": 28,
    };
    return expected[bacteria.name] ?? super.getExpectedRing(bacteria);
  }
  getSusceptibility(bacteria) {
    if (bacteria.genus === "Pseudomonas") return { "resistant": 18, "susceptible": 25 };
    if (bacteria.genus === "Staphylococcus") return { "resistant": 15, "susceptible": 21 };
    return { "resistant": 21, "susceptible": 26 };
  }
}

class Clindamycin extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Clindamycin";
    this.abbreviation = "CC";
  }
  getExpectedRing(bacteria) {
    const expected = {
      "Escherichia coli": 0,
      "Pseudomonas aeruginosa": 0,
      "Staphylococcus aureus": 29,
    };
    return expected[bacteria.name] ?? super.getExpectedRing(bacteria);
  }
  getSusceptibility(bacteria) {
    return { "resistant": 14, "susceptible": 21 };
  }
}

class Erythromycin extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Erythromycin";
    this.abbreviation = "E";
  }
  getExpectedRing(bacteria) {
    const expected = {
      "Escherichia coli": 0,
      "Pseudomonas aeruginosa": 0,
      "Staphylococcus aureus": 25,
    };
    return expected[bacteria.name] ?? super.getExpectedRing(bacteria);
  }
  getSusceptibility(bacteria) {
    return { "resistant": 13, "susceptible": 23 };
  }
}

class Oxacillin extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Oxacillin";
    this.abbreviation = "OX";
  }
  getExpectedRing(bacteria) {
    const expected = {
      "Escherichia coli": 0,
      "Pseudomonas aeruginosa": 0,
      "Staphylococcus aureus": 23,
    };
    return expected[bacteria.name] ?? super.getExpectedRing(bacteria);
  }
  getSusceptibility(bacteria) {
    return { "resistant": 21, "susceptible": 22 };
  }
}

class Penicillin extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Penicillin G";
    this.abbreviation = "P";
  }
  getExpectedRing(bacteria) {
    const expected = {
      "Escherichia coli": 0,
      "Pseudomonas aeruginosa": 0,
      "Staphylococcus aureus": 32,
    };
    return expected[bacteria.name] ?? super.getExpectedRing(bacteria);
  }
  getSusceptibility(bacteria) {
    if (bacteria.genus === "Staphylococcus") return { "resistant": 28, "susceptible": 29 };
    return { "resistant": 13, "susceptible": 17 };
  }
}

class Streptomycin extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Streptomycin";
    this.abbreviation = "S";
  }
  getExpectedRing(bacteria) {
    const expected = {
      "Escherichia coli": 20,
      "Pseudomonas aeruginosa": 0,
      "Staphylococcus aureus": 21,
    };
    return expected[bacteria.name] ?? super.getExpectedRing(bacteria);
  }
  getSusceptibility(bacteria) {
    return { "resistant": 11, "susceptible": 15 };
  }
}

class Tetracycline extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Tetracycline";
    this.abbreviation = "TE";
  }
  getExpectedRing(bacteria) {
    const expected = {
      "Escherichia coli": 18,
      "Pseudomonas aeruginosa": 0,
      "Staphylococcus aureus": 25,
    };
    return expected[bacteria.name] ?? super.getExpectedRing(bacteria);
  }
  getSusceptibility(bacteria) {
    if (bacteria.genus === "Staphylococcus") return { "resistant": 14, "susceptible": 19 };
    return { "resistant": 11, "susceptible": 15 };
  }
}

class Tobramycin extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Tobramycin";
    this.abbreviation = "TM";
  }
  getExpectedRing(bacteria) {
    const expected = {
      "Escherichia coli": 25,
      "Pseudomonas aeruginosa": 21,
      "Staphylococcus aureus": 24,
    };
    return expected[bacteria.name] ?? super.getExpectedRing(bacteria);
  }
  getSusceptibility(bacteria) {
    return { "resistant": 12, "susceptible": 15 };
  }
}

class TrimethoprimSulfa extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Trimethoprim-sulfamethoxazole";
    this.abbreviation = "SXT";
  }
  getExpectedRing(bacteria) {
    const expected = {
      "Escherichia coli": 27,
      "Pseudomonas aeruginosa": 0,
      "Staphylococcus aureus": 28,
    };
    return expected[bacteria.name] ?? super.getExpectedRing(bacteria);
  }
  getSusceptibility(bacteria) {
    return { "resistant": 10, "susceptible": 16 };
  }
}

class Vancomycin extends Antibiotic {
  constructor(amount) {
    super(amount);
    this.name = "Vancomycin";
    this.abbreviation = "VA";
  }
  getExpectedRing(bacteria) {
    const expected = {
      "Escherichia coli": 0,
      "Pseudomonas aeruginosa": 0,
      "Staphylococcus aureus": 19,
    };
    return expected[bacteria.name] ?? super.getExpectedRing(bacteria);
  }
  getSusceptibility(bacteria) {
    return { "resistant": 14, "susceptible": 17 };
  }
}

export {
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
}
