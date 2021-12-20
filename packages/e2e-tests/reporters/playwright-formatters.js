// copied from @playwright/test/lib/reporters/base
const { relative, resolve } = require("path");
const { gray, red, cyan, enabled, dim } = require("colors/safe");
var _codeFrame = require("@babel/code-frame");
const fs = require("fs");
const StackUtils = require("stack-utils");

const stackUtils = new StackUtils();
const kOutputSymbol = Symbol('output');

function prepareErrorStack(stack, file) {
    const lines = stack.split("\n");
    let firstStackLine = lines.findIndex((line) => line.startsWith("    at "));
    if (firstStackLine === -1) firstStackLine = lines.length;
    const message = lines.slice(0, firstStackLine).join("\n");
    const stackLines = lines.slice(firstStackLine);
    const position = file ? positionInFile(stackLines, file) : undefined;
    return {
        message,
        stackLines,
        position,
    };
}

function formatError(error, highlightCode, file) {
    const stack = error.stack;
    const tokens = [""];
    let positionInFile;

    if (stack) {
        const { message, stackLines, position } = prepareErrorStack(stack, file);
        positionInFile = position;
        tokens.push(message);
        const codeFrame = generateCodeFrame(
            {
                highlightCode,
            },
            file,
            position
        );

        if (codeFrame) {
            tokens.push("");
            tokens.push(codeFrame);
        }

        tokens.push("");
        tokens.push(dim(stackLines.join("\n")));
    } else if (error.message) {
        tokens.push(error.message);
    } else if (error.value) {
        tokens.push(error.value);
    }

    return {
        position: positionInFile,
        message: tokens.join("\n"),
    };
}

function generateCodeFrame(options, file, position) {
    if (!position || !file) return;

    const source = fs.readFileSync(file, "utf8");

    const codeFrame = (0, _codeFrame.codeFrameColumns)(
        source,
        {
            start: position,
        },
        options
    );
    return codeFrame;
}

function prepareErrorStack(stack, file) {
    const lines = stack.split("\n");
    let firstStackLine = lines.findIndex((line) => line.startsWith("    at "));
    if (firstStackLine === -1) firstStackLine = lines.length;
    const message = lines.slice(0, firstStackLine).join("\n");
    const stackLines = lines.slice(firstStackLine);
    const position = file ? positionInFile(stackLines, file) : undefined;
    return {
        message,
        stackLines,
        position,
    };
}

function positionInFile(stackLines, file) {
    // Stack will have /private/var/folders instead of /var/folders on Mac.
    file = fs.realpathSync(file);

    for (const line of stackLines) {
        const parsed = stackUtils.parseLine(line);
        if (!parsed || !parsed.file) continue;
        if (resolve(process.cwd(), parsed.file) === file)
            return {
                column: parsed.column || 0,
                line: parsed.line || 0,
            };
    }
}

function indent(lines, tab) {
    return lines.replace(/^(?=.+$)/gm, tab);
}

function stripAnsiEscapes(str) {
    return str.replace(asciiRegex, "");
}

function pad(line, char) {
    if (line) line += " ";
    return line + gray(char.repeat(Math.max(0, 100 - line.length)));
}

function formatTestHeader(config, test, indent, index) {
    const title = formatTestTitle(config, test);
    const header = `${indent}${index ? index + ") " : ""}${title}`;
    return pad(header, "=");
}

function stepSuffix(step) {
    const stepTitles = step ? step.titlePath() : [];
    return stepTitles.map((t) => " › " + t).join("");
}

function relativeTestPath(config, test) {
    return relative(config.rootDir, test.location.file) || _path.default.basename(test.location.file);
}

function formatResultFailure(test, result, initialIndent, highlightCode) {
    var _error;

    const resultTokens = [];

    if (result.status === "timedOut") {
        resultTokens.push("");
        resultTokens.push(indent(red(`Timeout of ${test.timeout}ms exceeded.`), initialIndent));
    }

    if (result.status === "passed" && test.expectedStatus === "failed") {
        resultTokens.push("");
        resultTokens.push(indent(red(`Expected to fail, but passed.`), initialIndent));
    }

    let error = undefined;

    if (result.error !== undefined) {
        error = formatError(result.error, highlightCode, test.location.file);
        resultTokens.push(indent(error.message, initialIndent));
    }

    return {
        tokens: resultTokens,
        position: (_error = error) === null || _error === void 0 ? void 0 : _error.position,
    };
}

function formatTestTitle(config, test, step) {
    // root, project, file, ...describes, test
    const [, projectName, , ...titles] = test.titlePath();
    const location = `${relativeTestPath(config, test)}:${test.location.line}:${test.location.column}`;
    const projectTitle = projectName ? `[${projectName}] › ` : "";
    return `${projectTitle}${location} › ${titles.join(" › ")}${stepSuffix(step)}`;
}

function formatFailure(config, test, options = {}) {
    const { index, includeStdio, includeAttachments = true, filePath } = options;
    const lines = [];
    const title = formatTestTitle(config, test);
    const annotations = [];
    const header = formatTestHeader(config, test, "  ", index);
    lines.push(red(header));

    for (const result of test.results) {
        const resultLines = [];
        const { tokens: resultTokens, position } = formatResultFailure(test, result, "    ", enabled);
        if (!resultTokens.length) continue;

        if (result.retry) {
            resultLines.push("");
            resultLines.push(gray(pad(`    Retry #${result.retry}`, "-")));
        }

        resultLines.push(...resultTokens);

        if (includeAttachments) {
            for (let i = 0; i < result.attachments.length; ++i) {
                const attachment = result.attachments[i];
                resultLines.push("");
                resultLines.push(cyan(pad(`    attachment #${i + 1}: ${attachment.name} (${attachment.contentType})`, "-")));

                if (attachment.path) {
                    const relativePath = relative(process.cwd(), attachment.path);

                    resultLines.push(cyan(`    ${relativePath}`)); // Make this extensible

                    if (attachment.name === "trace") {
                        resultLines.push(cyan(`    Usage:`));
                        resultLines.push("");
                        resultLines.push(cyan(`        npx playwright show-trace ${relativePath}`));
                        resultLines.push("");
                    }
                } else {
                    if (attachment.contentType.startsWith("text/")) {
                        let text = attachment.body.toString();
                        if (text.length > 300) text = text.slice(0, 300) + "...";
                        resultLines.push(cyan(`    ${text}`));
                    }
                }

                resultLines.push(cyan(pad("   ", "-")));
            }
        }

        const output = result[kOutputSymbol] || [];

        if (includeStdio && output.length) {
            const outputText = output
                .map(({ chunk, type }) => {
                    const text = chunk.toString("utf8");
                    if (type === "stderr") return red(stripAnsiEscapes(text));
                    return text;
                })
                .join("");
            resultLines.push("");
            resultLines.push(gray(pad("--- Test output", "-")) + "\n\n" + outputText + "\n" + pad("", "-"));
        }

        if (filePath) {
            annotations.push({
                filePath,
                position,
                title,
                message: [header, ...resultLines].join("\n"),
            });
        }

        lines.push(...resultLines);
    }

    lines.push("");
    return {
        message: lines.join("\n"),
        annotations,
    };
}

module.exports = {
    formatFailure,
    formatTestTitle,
};
