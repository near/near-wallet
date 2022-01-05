class LinkDropPage {
    constructor(page) {
        this.page = page;
    }
    async navigate(contractAccountId, secretKey, redirectUrl) {
        if (redirectUrl) {
            await this.page.goto(`/linkdrop/${contractAccountId}/${secretKey}?redirectUrl=${redirectUrl}`);
        } else {
            await this.page.goto(`/linkdrop/${contractAccountId}/${secretKey}`);
        }
    }
    async claimToExistingAccount() {
        await this.page.click(`data-test-id=linkdropClaimToExistingAccount`);
    }
    async loginAndClaim() {
        await this.page.click(`data-test-id=linkdropLoginAndClaim`);
    }
    async createAccountToClaim() {
        await this.page.click(`data-test-id=linkdropCreateAccountToClaim`);
    }
}

module.exports = { LinkDropPage };
