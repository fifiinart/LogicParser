const logicErrors = require("./errors.js");

module.exports = class LogicVar {

  constructor(value = null, hasNot = null, operatorType = null, nodeObj = null) {
    [this.pseudo, this.discrete, this.java] = [...Array(3).keys()];
    this.operators = ["not", "~", "!"];

    // Check if value is null and nodeObj is null
    if (value == null && nodeObj == null) {
      throw new logicErrors.MissingValue("Required variable for LogicVar. Must use either value or nodeObj.");
    }

    // Check if value is not null
    else if (value) {
      this.value = value;
      this.hasNot = hasNot;
      this.operatorType = operatorType ? operatorType : this.discrete;
    }

    // Check if nodeObj is not null
    else if (nodeObj) {

      // Try to load value
      if (!("value" in nodeObj)) {
        throw new logicErrors.MissingValue("Required key for LogicVar. Must have \"value\" key in nodeObj.");
      } else {
        this.value = nodeObj["value"];
      }

      // Try to load hasNot
      if (!("hasNot" in nodeObj)) {
        this.hasNot = hasNot;
      } else {
        this.hasNot = nodeObj["hasNot"];
      }

      // Try to load operatorType
      if (!("operatorType" in nodeObj)) {
        this.operatorType = this.discrete;
      } else {
        this.operatorType = nodeObj["operatorType"];
      }
    }
  }
  // toString serialization
  toString() {
    if (this.getHasNot()) {
      return this.operators[this.operatorType] + this.getValue();
    }
    return this.getValue();
  }
  // custom compare func
  compare(value) {
    if (!(value instanceof LogicVar)) {
      return false;
    }

    return (
      this.getValue() == value.getValue() &&
      this.getHasNot() == value.getHasNot() &&
      this.getOperatorType() == value.getOperatorType()
    )
  }

  // ___Getters___
  getValue() {
    return this.value;
  }

  getHasNot() {
    return this.hasNot;
  }

  getOperatorType() {
    return this.operatorType;
  }


  getTruthValues(truthValues = []) {

    // Keep track of evaluations
    let evaluations = [];

    // Only run this if there is a hasNot
    if (!this.getHasNot()) {
      return evaluations;
    }

    // Iterate through truthValues
    for (const truthValue of truthValues) {
      let evaluation = {
        "expression": "" + this,
        truthValue,
        "value": this.evaluate(truthValue)
      }

      // Only add the evaluation if it doesn't already exist
      if (!valueIn(evaluation, evaluations)) {
        evaluations.push(evaluation);
      }
    }

    return evaluations;
  }

  evaluate(truthValue = {}) {

    if (!(this.getValue() in truthValue)) {
      throw new logicErrors.MissingTruthValue(`Required truth value for the variable "${this.getValue()}".`);
    }

    if (this.getHasNot()) {
      return !truthValue[this.getValue()];
    }

    return truthValue[this.getValue()];
  }
}
