class UnbalancedParentheses extends Error {
  constructor(message, fileName, lineNumber) {
    super(message, fileName, lineNumber);
    this.name = "UnbalancedParentheses";
  }
}
class MissingTruthValue extends Error {
  constructor(message, fileName, lineNumber) {
    super(message, fileName, lineNumber);
    this.name = "MissingTruthValue";
  }
}
class OperatorMismatch extends Error {
  constructor(message, fileName, lineNumber) {
    super(message, fileName, lineNumber);
    this.name = "OperatorMismatch";
  }
}
class MissingValue extends Error {
  constructor(message, fileName, lineNumber) {
    super(message, fileName, lineNumber);
    this.name = "MissingValue";
  }
}
class ValueError extends Error {
  constructor(message, fileName, lineNumber) {
    super(message, fileName, lineNumber);
    this.name = "ValueError";
  }
}
module.exports = {
  UnbalancedParentheses,
  MissingTruthValue, OperatorMismatch, MissingValue, ValueError
};
