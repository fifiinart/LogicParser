module.exports = {
  version: require('./package.json')
    .version,
  eval(msg, debug = false) {
    let result, table;
    try {
      table = new LogicTree(data)
        .makeTable()
        .join("\n");
      result = {
        success: true,
        request: msg,
        result: table
      };
    } catch (e) {
      result = {
        success: false,
        request: msg,
        error: debug ? e : "Invalid expression"
      };
    },
    return result;
  }
}