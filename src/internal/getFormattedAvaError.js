/* eslint-disable prefer-template */
const colors = require('ava/lib/colors');
const codeExcerpt = require('ava/lib/code-excerpt');
const extractStack = require('ava/lib/extract-stack');
// eslint-disable-next-line import/no-extraneous-dependencies
const indentString = require('indent-string');
// eslint-disable-next-line import/no-extraneous-dependencies
const figures = require('figures');
const improperUsageMessages = require('ava/lib/reporters/improper-usage-messages');
const formatSerializedError = require('ava/lib/reporters/format-serialized-error');

/**
 * Original function in avajs/ava https://github.com/avajs/ava/blob/14f7095d25abc5ffbff7efd7db962eaf5e86daab/lib/reporters/verbose.js#L111
 */
const getFormattedError = (test = {}) => {
  let status = '';

  if (!test.error) {
    return null;
  }

  status += `  ${colors.title(test.title)}\n`;

  if (test.logs) {
    test.logs.forEach(log => {
      const logLines = indentString(colors.log(log), 6);
      const logLinesWithLeadingFigure = logLines.replace(
        /^ {6}/,
        `    ${colors.information(figures.info)} `,
      );

      status += `${logLinesWithLeadingFigure}\n`;
    });

    status += '\n';
  }

  if (test.error.source) {
    status += `  ${colors.errorSource(
      `${test.error.source.file}:${test.error.source.line}`,
    )}\n`;

    const excerpt = codeExcerpt(test.error.source, {
      maxWidth: process.stdout.columns,
    });
    if (excerpt) {
      status += `\n${indentString(excerpt, 2)}\n`;
    }
  }

  if (test.error.avaAssertionError) {
    const result = formatSerializedError(test.error);
    if (result.printMessage) {
      status += `\n${indentString(test.error.message, 2)}\n`;
    }

    if (result.formatted) {
      status += `\n${indentString(result.formatted, 2)}\n`;
    }

    const message = improperUsageMessages.forError(test.error);
    if (message) {
      status += `\n${indentString(message, 2)}\n`;
    }
  } else if (test.error.message) {
    status += `\n${indentString(test.error.message, 2)}\n`;
  }

  if (test.error.stack) {
    const extracted = extractStack(test.error.stack);
    if (extracted.includes('\n')) {
      status += `\n${indentString(colors.errorStack(extracted), 2)}\n`;
    }
  }

  // status += '\n\n\n';
  return status;
};

module.exports = getFormattedError;
