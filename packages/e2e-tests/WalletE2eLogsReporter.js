const { formatTestTitle, formatFailure } = require("@playwright/test/lib/test/reporters/base");
const { BN } = require("bn.js");
const milliseconds = require("ms");
const { formatNearAmount } = require("near-api-js/lib/utils/format");

const { bnComparator } = require("./utils/helpers");

/** @implements {import('@playwright/test/reporter').Reporter} */
class WalletE2eLogsReporter {
    constructor({ logger }) {
        this.workerExpenseLogs = [];
        this.logger = logger;
    }
    onBegin(config, suite) {
        const [seconds, nanoseconds] = process.hrtime();
        this.monotonicStartTime = seconds * 1000 + ((nanoseconds / 1000000) | 0);
        this.config = config;
        this.suite = suite;
    }
    onStdOut(chunk) {
        this.collectWorkerExpenseLogs(chunk);
    }
    formatTestResult(test, result) {
        const duration = ` (${milliseconds(result.duration)})`;
        const title = formatTestTitle(this.config, test);
        let text = "";
        if (result.status === "skipped") {
            text = "  -  " + title;
        } else {
            const statusMark = ("  " + (result.status === "passed" ? "✓" : "✘")).padEnd(5);
            text = statusMark + title + duration;
        }
        return text;
    }
    onTestEnd(test, result) {
        const text = this.formatTestResult(test, result);
        result.status === "passed" ? this.logger.info(text) : this.logger.error(text);
    }
    collectWorkerExpenseLogs(chunk) {
        if (/WorkerExpenseLog/.test(chunk)) {
            this.workerExpenseLogs.push(JSON.parse(chunk)[1]);
        }
    }
    getFailedTests() {
        return this.suite.allTests().filter((test) => {
            const outcome = test.outcome();
            const skippedWithFailure = outcome === "skipped" && test.results.some((result) => !!result.error);
            return outcome === "unexpected" || outcome === "flaky" || skippedWithFailure;
        });
    }
    getPassedTests() {
        return this.suite.allTests().filter((test) => test.outcome() === "expected");
    }
    getSkippedTests() {
        return this.suite.allTests().filter((test) => test.outcome() === "skipped");
    }
    getTestsForWorkerIndex(idx) {
        return this.suite.allTests().filter(({ results }) => results.some(({ workerIndex }) => workerIndex === idx));
    }
    printWorkerExpenses() {
        this.workerExpenseLogs
            .sort(
                ({ amountSpent: amountSpentA }, { amountSpent: amountSpentB }) =>
                    -bnComparator(new BN(amountSpentA), new BN(amountSpentB))
            )
            .forEach(({ workerBankAccount, amountSpent, workerIndex }) => {
                this.logger.info(`amount spent by worker acc ${workerBankAccount}: ${formatNearAmount(amountSpent)} Ⓝ`);
                this.logger.info(
                    `tests:\n${this.getTestsForWorkerIndex(workerIndex)
                        .map((test, testIdx) =>
                            test.results
                                .map(
                                    (result, resultIdx) =>
                                        `\t${`${testIdx + 1}.`.replace(/./, (c) =>
                                            resultIdx === 0 ? c : " "
                                        )} ${this.formatTestResult(test, result)}`
                                )
                                .join("\n")
                        )
                        .join("\n")}`
                );
            });
        this.logger.info(
            `Total amount spent: ${formatNearAmount(
                this.workerExpenseLogs.reduce((acc, { amountSpent }) => new BN(amountSpent).add(acc), new BN(0)).toString()
            )} Ⓝ`
        );
    }
    onEnd() {
        const failed = this.getFailedTests();
        const passed = this.getPassedTests();
        const skipped = this.getSkippedTests();
        this.logger.error(`${failed.length} failed`);
        this.logger.info(`${passed.length} passed`);
        this.logger.info(`${skipped.length} skipped`);
        this.printWorkerExpenses();
        failed.forEach((test, index) => {
            const formattedFailure = formatFailure(this.config, test, index + 1);
            this.logger.error(formattedFailure);
        });
        // TODO: replace with below when playwright is updated
        // failed.forEach((test, index) => {
        //     const formattedFailure = formatFailure(this.config, test, {
        //         index: index + 1,
        //         includeStdio: true,
        //     });
        //     this.logger.error(formattedFailure.message);
        // });
    }
}

module.exports = WalletE2eLogsReporter;
