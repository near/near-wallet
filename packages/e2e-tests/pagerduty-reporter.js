const { api } = require("@pagerduty/pdjs");
const pd = api({ token: process.env.PAGERDUTY_API_KEY });

class PagerDutyReporter {
    onEnd(result) {
        if (result.status == "failed" && process.env.isCI) {
            // Creating incident on PagerDuty
            return pd.post("/incidents", {
                data: {
                    incident: {
                        type: "incident",
                        title: "wallet e2e-tests failure",
                        service: {
                            id: process.env.PAGERDUTY_WALLET_SERVICE_ID,
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
Wallet e2e-test suite has failed. See ${process.env.E2E_TESTS_LOGS_URL} for details.
                        },
                    },
                },
            });
        }
    }
}

module.exports = PagerDutyReporter;
