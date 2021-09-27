const { api } = require("@pagerduty/pdjs");
const pd = api({ token: process.env.PAGERDUTY_API_KEY });

class PagerDutyReporter {
    onTestEnd(test, result) {
        if (result.status == "failed" && process.env.isCI) {
            // Creating incident on PagerDuty
            return pd.post("/incidents", {
                data: {
                    incident: {
                        type: "incident",
                        title: "wallet e2e-tests failure",
                        service: {
                            id: "PJ9TV6C", // wallet
                            type: "service_reference",
                        },
                        assignments: [
                            {
                                assignee: {
                                    id: "PB796BV", // osman@near.org
                                    type: "user_reference",
                                },
                            },
                        ],
                        body: {
                            type: "incident_body",
                            details: `
Wallet e2e-test "${test.title}" has failed. See https://dashboard.render.com/cron/crn-bvrt6tblc6ct62bdjmig/logs for details.
Tests were run against ${process.env.WALLET_URL}

${JSON.stringify(result.error, null, 2)}
                  `,
                        },
                    },
                },
            });
        }
    }
}

module.exports = PagerDutyReporter;
