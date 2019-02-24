const LogicTree = require("./tree.js");
let flag = false;
// Input expression:
// Get process.stdin as the standard input object.
var standardInput = process.stdin;

// Set input character encoding.
standardInput.setEncoding('utf-8');

// Prompt user to input data in console.
console.log("Please input some logical expressions. To exit, type 'exit'.");

// When user input data and click enter key.
standardInput.on('data', function (data) {
  if (data === 'exit\n' || data === 'exit') {
    process.exit()
  }
  else {
    flag = false;
    try {
      tree = new LogicTree(data);
    } catch (e) {
      flag = true;
    }
    if (flag) {
      console.log("Invalid Expression");
    } else {
      console.log(tree.makeTable().join("\n"));
    }
  }
});
