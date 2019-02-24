# LogicParser
This is a node.js version of FellowHashbrown's [PyLogic](https://github.com/FellowHashbrown/PyLogic). If you don't have the time to read his, or want to know about mine, I'll break it down for you.

This is a Node.js project for parsing and evaluating logical expressions such as those in Discrete Mathematics.

## Process of Parsing
In order to parse a logical expression, LogicParser will use the `parseExpression` function in tree.js to iterate through the entire expression. It removes all the spaces beforehand because spaces don't necessarily matter in the parsing.

It will then return an `object` of information pertaining to the expression that will be stored as a `LogicNode` instance as the root of a `LogicTree`. Each value is then parsed through (recursively if needed) to create instances to use in the final evaluation.

## Examples of Logical Expressions
When evaluating logical expressions, there is a function, `makeTable()`, that will generate a truth table for you with the order of the expressions in ascending order that way you can read it as you would write a normal truth table.

Here are some examples:

### ` a ^ b `

```
| a | b | a ^ b |
+---+---+-------+
| T | T |   T   |
| T | F |   F   |
| F | T |   F   |
| F | F |   F   |
```
### ` ~(a v b) `

```
| a | b | ~(a v b) |
+---+---+----------+
| T | T |    F     |
| T | F |    F     |
| F | T |    F     |
| F | F |    T     |
```
### ` a v b v c v d `

```
| a | b | c | d | a v b | (a v b) v c | ((a v b) v c) v d |
+---+---+---+---+-------+-------------+-------------------+
| T | T | T | T |   T   |      T      |         T         |
| T | T | T | F |   T   |      T      |         T         |
| T | T | F | T |   T   |      T      |         T         |
| T | T | F | F |   T   |      T      |         T         |
| T | F | T | T |   T   |      T      |         T         |
| T | F | T | F |   T   |      T      |         T         |
| T | F | F | T |   T   |      T      |         T         |
| T | F | F | F |   T   |      T      |         T         |
| F | T | T | T |   T   |      T      |         T         |
| F | T | T | F |   T   |      T      |         T         |
| F | T | F | T |   T   |      T      |         T         |
| F | T | F | F |   T   |      T      |         T         |
| F | F | T | T |   F   |      T      |         T         |
| F | F | T | F |   F   |      T      |         T         |
| F | F | F | T |   F   |      F      |         T         |
| F | F | F | F |   F   |      F      |         F         |
```

As you can tell with that last one, parentheses are automatically added because each logical expression is parsed as a `{left} {operator} {right}` value.

## Feedback, Sugesstions, Bugs
Any feedback, suggestions, or bugs can be mentioned in my [Discord Developer Server](https://discord.gg/KK2fQe5).
