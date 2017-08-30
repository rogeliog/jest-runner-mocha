// eslint-disable-next-line
const diff = require('diff');
const utils = require('mocha/lib/utils');

const colors = {
  pass: 90,
  fail: 31,
  'bright pass': 92,
  'bright fail': 91,
  'bright yellow': 93,
  pending: 36,
  suite: 0,
  'error title': 0,
  'error message': 31,
  'error stack': 90,
  checkmark: 32,
  fast: 90,
  medium: 33,
  slow: 31,
  green: 32,
  light: 90,
  'diff gutter': 90,
  'diff added': 32,
  'diff removed': 31,
};

/**
 * Pad the given `str` to `len`.
 *
 * @api private
 * @param {string} str
 * @param {string} len
 * @return {string}
 */
function pad(str, len) {
  str = String(str);
  return Array(len - str.length + 1).join(' ') + str;
}

/**
 * Object#toString reference.
 */
const objToString = Object.prototype.toString;

/**
 * Check that a / b have the same type.
 *
 * @api private
 * @param {Object} a
 * @param {Object} b
 * @return {boolean}
 */
const sameType = (a, b) => objToString.call(a) === objToString.call(b);

const color = (type, str) => `\u001b[${colors[type]}m${str}\u001b[0m`;
/**
 * Color lines for `str`, using the color `name`.
 *
 * @api private
 * @param {string} name
 * @param {string} str
 * @return {string}
 */
function colorLines(name, str) {
  return str
    .split('\n')
    .map(_str => {
      return color(name, _str);
    })
    .join('\n');
}

/**
 * Returns a string with all invisible characters in plain text
 *
 * @api private
 * @param {string} line
 * @return {string}
 */
function escapeInvisibles(line) {
  return line
    .replace(/\t/g, '<tab>')
    .replace(/\r/g, '<CR>')
    .replace(/\n/g, '<LF>\n');
}

/**
 * Return a character diff for `err`.
 *
 * @api private
 * @param {Error} err
 * @param {string} type
 * @param {boolean} escape
 * @return {string}
 */
function errorDiff(err, type, escape) {
  const actual = escape ? escapeInvisibles(err.actual) : err.actual;
  const expected = escape ? escapeInvisibles(err.expected) : err.expected;
  return diff
    [`diff${type}`](actual, expected)
    .map(str => {
      if (str.added) {
        return colorLines('diff added', str.value);
      }
      if (str.removed) {
        return colorLines('diff removed', str.value);
      }
      return str.value;
    })
    .join('');
}

/**
 * Returns an inline diff between 2 strings with coloured ANSI output
 *
 * @api private
 * @param {Error} err with actual/expected
 * @param {boolean} escape
 * @return {string} Diff
 */
function inlineDiff(err, escape) {
  let msg = errorDiff(err, 'WordsWithSpace', escape);

  // linenos
  const lines = msg.split('\n');
  if (lines.length > 4) {
    const width = String(lines.length).length;
    msg = lines
      .map((str, i) => {
        return `${pad(++i, width)} |` + ` ${str}`;
      })
      .join('\n');
  }

  // legend
  msg = `\n${color('diff removed', 'actual')} ${color(
    'diff added',
    'expected',
  )}\n\n${msg}\n`;

  // indent
  msg = msg.replace(/^/gm, '      ');
  return msg;
}

/**
 * Returns a unified diff between two strings.
 *
 * @api private
 * @param {Error} err with actual/expected
 * @param {boolean} escape
 * @return {string} The diff.
 */
function unifiedDiff(err, escape) {
  const indent = '      ';
  function cleanUp(line) {
    if (escape) {
      line = escapeInvisibles(line);
    }
    if (line[0] === '+') {
      return indent + colorLines('diff added', line);
    }
    if (line[0] === '-') {
      return indent + colorLines('diff removed', line);
    }
    if (line.match(/@@/)) {
      return null;
    }
    if (line.match(/\\ No newline/)) {
      return null;
    }
    return indent + line;
  }
  function notBlank(line) {
    return typeof line !== 'undefined' && line !== null;
  }
  const msg = diff.createPatch('string', err.actual, err.expected);
  const lines = msg.split('\n').splice(4);
  return `\n      ${colorLines('diff added', '+ expected')} ${colorLines(
    'diff removed',
    '- actual',
  )}\n\n${lines.map(cleanUp).filter(notBlank).join('\n')}`;
}

const formatMochaError = test => {
  // format
  let fmt =
    color('error title', '  %s) %s:\n') +
    color('error message', '     %s') +
    color('error stack', '\n%s\n');

  // msg
  let msg;
  const err = test.err;
  let message;
  if (err.message && typeof err.message.toString === 'function') {
    message = `${err.message}`;
  } else if (typeof err.inspect === 'function') {
    message = `${err.inspect()}`;
  } else {
    message = '';
  }
  let stack = err.stack || message;
  let index = message ? stack.indexOf(message) : -1;
  let actual = err.actual;
  let expected = err.expected;
  let escape = true;

  if (index === -1) {
    msg = message;
  } else {
    index += message.length;
    msg = stack.slice(0, index);
    // remove msg from stack
    stack = stack.slice(index + 1);
  }

  // uncaught
  if (err.uncaught) {
    msg = `Uncaught ${msg}`;
  }
  // explicitly show diff
  if (
    err.showDiff !== false &&
    sameType(actual, expected) &&
    expected !== undefined
  ) {
    escape = false;
    if (!(utils.isString(actual) && utils.isString(expected))) {
      err.actual = actual = utils.stringify(actual);
      err.expected = expected = utils.stringify(expected);
    }

    fmt =
      color('error title', '  %s) %s:\n%s') + color('error stack', '\n%s\n');
    const match = message.match(/^([^:]+): expected/);
    msg = `\n      ${color('error message', match ? match[1] : msg)}`;

    // if (exports.inlineDiffs) {
    // msg += inlineDiff(err, escape);
    // } else {
    msg += unifiedDiff(err, escape);
    // }
  }

  // indent stack trace
  // stack = stack.replace(/^/gm, '  ');

  // console.log(test.fullTitle());
  return [test.fullTitle.replace(/^/gm, '    '), msg, stack].join('\n');
};

module.exports = formatMochaError;
