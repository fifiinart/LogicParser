valueIn = function(item, array) {
  for (let i of array) {
    slice = array.slice(i, i + item.length);
    if (i === item) {
      return true;
    }
  }
  return false;
}

function range(start, end, by = 1) {
  let y = [];
  for (let x = start; x < end; x += by) {
    y.push(x);
  }
  return y;
}

function center(value, length, fill = " ") {
  let padding = length - value.length;
  let start = Math.ceil(padding / 2);
  let end = padding - start;
  return value.padStart(value.length + start, fill)
    .padEnd(value.length + start + end, fill);
}

module.exports = {
  valueIn,
  range,
  center
};