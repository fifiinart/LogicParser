const errors = require("./errors.js");
const LogicNode = require("./node.js");
const { valueIn, range, center } = require("./globals.js")
operators = {
  "NAND": "|",
  "nand": "|",

  "NOR": "⬇",
  "nor": "⬇",

  "OR": "v",
  "or": "v",
  "\|\|": "v",

  "AND": "^",
  "and": "^",
  "&&": "^",

  "NOT ": "~",
  "not ": "~",
  "NOT": "~",
  "not": "~",
  "!": "~",

  "IFF": "-",
  "iff": "-",
  "<->": "-",

  "IMPLIES": ">",
  "implies": ">",
  "->": ">"
}

module.exports = class LogicTree {

  constructor(expression) {
    this.expression = expression;
    this.variables = []
    this.root = null;
    this.parse();
  }

  toString() {
    return "" + this.root;
  }

  compare(value) {
    if (!(value instanceof LogicTree)) {
      return false;
    }
    return (
      this.expression === value.getExpression() &&
      this.variables === value.getVariables() &&
      this.root === value.root
    );
  }


  getExpression() {
    return this.expression;
  }

  getVariables() {
    return this.variables;
  }


  parse() {
    let exp = parseExpression(this.getExpression());
    let expression = exp["expression"];
    let variables = exp["variables"];

    this.root = new LogicNode(null, null, null, null, null, expression);

    this.variables = variables;
    this.expression = "" + this.root;
  }


  getTruthValues() {
    // Create every possible truth combination for all variables
    let truthValues = []

    // Iterate through 2 ** variables.length possible combinations
    for (const value in range(0, 2 ** this.getVariables().length)) {

      // Iterate through all variables
      let truthValue = {};
      for (const index in this.getVariables()) {

        // Get the power based off of the variable's index in the list
        let power = this.getVariables().length - index - 1;
        let variable = this.getVariables()[index];

        // Get the truth value using the getTruthValue method
        truthValue[variable] = getTruthValue(value, power);
      }

      truthValues.push(truthValue);
    }

    // Create truth values for other operations
    // For example, if there is a "~a", then there will be a column designated to that.
    //              if there is a "~(a v b)", then there will be a column designated to that.
    //                  as well as the "a v b" part.
    let truthEvaluations = [];

    let rootTruthEvaluations = this.root.getTruthValues(truthValues);

    // Add all the truth values as evaluations
    for (const truthValue of truthValues) {
      for (const truthVariable in truthValue) {
        let truthEvaluation = {
          "expression": truthVariable,
          "truthValue": {
            truthVariable: truthValue[truthVariable]
          },
          "value": truthValue[truthVariable]
        }

        truthEvaluations.push(truthEvaluation);
      }
    }

    // Add all the truth evaluations from the root
    for (const truthEvaluation of rootTruthEvaluations) {
      if (!valueIn(truthEvaluation, truthEvaluations)) {
        truthEvaluations.push(truthEvaluation);
      }
    }

    return truthEvaluations;
  }

  makeTable() {

    let lines = [];
    let line = "";
    let result = "";

    // Setup truth table
    let evaluations = this.getTruthValues();
    let tableObj = {};
    for (const evaluation of evaluations) {
      if (!(evaluation["expression"] in tableObj)) {
        tableObj[evaluation["expression"]] = [];
      }

      tableObj[evaluation["expression"]].push(evaluation["value"]);
    }
    // Add column labels
    let count = 0;
    let length = tableObj.length;
    for (const column in tableObj) {
      line = "| " + center(column, column.length);
      if (count > 0) {
        line = " " + line;
      }
      if (count == length - 1) {
        line += " |";
      }
      result += line;
      count += 1;
    }
    result += " |"
    lines.push(result);
    result = "";
    count = 0;
    for (const column in tableObj) {
      line = "+" + center("-", column.length + 1, "-");
      if (count > 0) {
        line = "-" + line;
      }
      if (count == length - 1) {
        line += "-+";
      }
      result += line;
      count += 1;
    }
    result += "-+"
    lines.push(result);
    result = "";
    // Add truth values
    let maxTruths = -1;
    for (const column in tableObj) {
      if (maxTruths === -1) {
        maxTruths = tableObj[column].length;
        break;
      }
    }

    for (const index in range(0, maxTruths)) {
      count = 0;
      for (const column in tableObj) {
        let value = tableObj[column][index];
        value = value === true ? "T" : ((value === false) ? "F" : "-");
        line = "| " + center(value, column.length);
        if (count > 0) {
          line = " " + line;
        }
        if (count == length - 1) {
          line += " |";
        }
        result += line;
        count += 1;
      }
      result += " |"
      lines.push(result);
      result = "";
    }
    return lines;
  }
}
getTruthValue = function(value, power) {
  return Math.floor(value / (2 ** power)) % 2 === 0;
}

function isExpressionValid(expression) {

    // Remove parentheses and spaces and nots
    expression = expression.replace("(", "").replace(")", "").replace(" ", "").replace("~", "");

    // Iterate through operators and split by it
    // Find if there are variables containing multiple characters
    for (const operator of LogicNode.operators) {
        let tokenSplit = expression.split(operator);
        if (tokenSplit.length > 1) {

            // Go through each index of the tokenSplit array
            // And check if the item has multiple characters
            for (const item of tokenSplit) {

                // Check if length of item is greater than 1
                if (item.length > 1) {

                    // Check if item has an operator in last or first index
                    if (item[0] in LogicNode.operators || item[item.length - 1] in LogicNode.operators) {
                        return false;
                    }

                    // Check if there are any operators in the item
                    let found = false;
                    for (const tempOp of LogicNode.operators) {
                        if (~item.indexOf(tempOp)) {
                            found = true;
                            break;
                        }
                    }

                    // If no operators are found, the item is invalid
                    // It just has "ab" or something of the sort
                    if (!found) {
                        return false;
                    }

                    // recursive call
                    return isExpressionValid(item);
                }

                // Check if length of item is 0
                else if (item.length == 0) {
                    return false;
                }
            }
        }
    }

    return true;
}

function parseExpression(expression, hasNot = false, operatorType = null) {

  // Remove all spaces from expressions
  expression = expression.replace(/[\x00-\x20]/g, "");

  // Standardize all operators
  let regex;
  for (const operator in operators) {

    // Find first operator that can be replaced and set operatorType to the proper type
    if (~expression.indexOf(operator) && operatorType == null) {

      // Iterate through operator types
      for (const opType of [LogicNode.discrete, LogicNode.java, LogicNode.pseudo]) {
        if (valueIn(operator.toLowerCase(), LogicNode.operators[opType])) {
          operatorType = opType;
          break;
        }
      }

      if (operatorType == null) {
        operatorType = LogicNode.discrete;
      }
    }
    if (~expression.indexOf(operator)) {
      regex = new RegExp(operator, 'g')
      if (operator == "\|\|") {
        expression = expression.replace(/\|\|/g, operators[operator])
      } else {
        expression = expression.replace(regex, operators[operator]);
      }
    }
  }

  // Loop through and find any operators and turn them into expressions
  let left = null;
  let right = null;
  let operator = null;
  let variables = [];

  let parentDepth = 0;
  let last = 0;

  let charHasNot = false;
  let tempHasNot = false;

  // Check if expression is valid
  if (!isExpressionValid(expression)) {
      console.log('exp', expression)
      throw new errors.ValueError("That is an invalid expression.");
  }

  for (const index in expression) {
    let char = expression[index];
    // Check for open parenthesis
    if (char === '(') {
      if (parentDepth === 0) {
        last = +index + 1;
      }
      parentDepth++;
    }

    // Check for close parenthesis
    else if (char === ')') {
      parentDepth--;

      // Parse expression if parenthesis depth reaches 0
      if (parentDepth === 0) {

        // Check if there is a ~ (NOT) operator directly in front of the parenthesis
        if (last - 1 > 0) {
          if (expression[last - 2] === '~') {
            tempHasNot = true;
          }
        }

        let exp = parseExpression(expression.substring(last, index), tempHasNot, operatorType)
        if (index === expression.length - 1 && last === 0) {
          hasNot = tempHasNot;
        }
        tempHasNot = false;

        // Check if there is no operator; Must be left side
        if (operator == null) {
          left = exp["expression"];
        } else {
          right = exp["expression"];
        }
      }
    }

    // No parenthesis depth anymore
    if (parentDepth === 0) {

      // Check for operator only if not within a parenthesis
      if (valueIn(char, ["^", "v", ">", "-", "|", "⬇"])) {

        // Check if operator does not exist yet
        if (operator == null) {

          if (char === '^') {
            operator = 1; // AND operator
          } else if (char === 'v') {
            operator = 2; // OR operator
          } else if (char === '>') {
            operator = 3; // IMPLIES operator
          } else if (char === '-') {
            operator = 4; // BICONDITIONAL operator
          } else if (char === '|') {
            operator = 5; // NAND operator
          } else if (char === '⬇') {
            operator = 6; // NOR operator
          }
        }

        // Operator exists; String of logical expressions exists
        // Make the left, operator, right, into the left expression
        else {
          left = {
            "hasNot": hasNot,
            "left": left,
            "operator": operator,
            "operatorType": operatorType,
            "right": right
          };

          if (char === '^') {
            operator = 1; // AND operator
          } else if (char === 'v') {
            operator = 2; // OR operator
          } else if (char === '>') {
            operator = 3; // IMPLIES operator
          } else if (char === '-') {
            operator = 4; // BICONDITIONAL operator
          } else if (char === '|') {
            operator = 5; // NAND operator
          } else if (char === '⬇') {
            operator = 6; // NOR operator
          }

          right = null;
          hasNot = false;
        }
      }
    }

    // Check for variables only if not within parentheses
    if (valueIn(char.charCodeAt(0), range('a'.charCodeAt(0), 'z'.charCodeAt(0))) && char.charCodeAt(0) !== 'v'.charCodeAt(0)) {

      // See if there is a ~ (NOT) operator directly in front of the variable
      if (index > 0) {
        if (expression[index - 1] == '~') {
          charHasNot = true;
        } else {
          charHasNot = false;
        }
      }

      // Check if there is no operator; Must be left side
      if (operator == null) {
        left = {
          "hasNot": charHasNot,
          "value": char
        }
      } else {
        right = {
          "hasNot": charHasNot,
          "value": char
        }
      }

      charHasNot = false;

      if (!valueIn(char, variables)) {
        variables.push(char);
      }
    }
  }

  if (parentDepth !== 0) {
    throw new errors.UnbalancedParentheses("You have a missing parenthesis somewhere.");
  }
  variables.sort();
  // Check if the expression is a single expression wrapped in parentheses
  if (operator == null && right == null) {
    hasNot = left["hasNot"];
    operator = left["operator"];
    operatorType = left["operatorType"];
    right = left["right"];
    left = left["left"];
  }
  return {
    "expression": {
      hasNot,
      left,
      operator,
      operatorType,
      right
    },
    variables
  };
}
