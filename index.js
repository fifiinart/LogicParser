const LogicTree = require("./tree.js");

let expressions = {
    "a ^ b": "This is the most basic expression",
    "~(a v b)": "Here is an example of an expression with wrapped entirely in parentheses",
    "(a ^ b) ^ c": "This is one expression that has parentheses at the front.",
    "a ^ b ^ c": "This is an expression with no parentheses but you'll notice that the parentheses are automatically added.",
    "a ^ (b ^ c)": "Here is another expression with explicit parentheses placed.",
    "~(a v b) ^ c": "This is an expression with a ~ (NOT) operator placed for JUST the left side.",
    "~(a v b) ^ ~(a v c)": "This expression has ~ (NOT) operators on each side but not the whole expression.",
    "~(~(a v b) ^ ~(a v c))": "Remember that has_not thing in the tutorial? This is what would happen if we ignored it.",
    "a v b v c v d": "This just shows you that the parentheses continue to stack."
};

for (const e in expressions) {
  console.log(e, expressions[e]);
  let table = (new LogicTree(e)).makeTable();
  for (const line of table) {
    console.log(line);
  }
}

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
  tree = new LogicTree(data);
  console.log(tree.makeTable().join("\n"));
  }
});
