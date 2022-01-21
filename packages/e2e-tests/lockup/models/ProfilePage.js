class ProfilePage {
    constructor(page) {
        this.page = page;
    }
    async navigate(accountId) {
        await this.page.goto(accountId ? `/profile/${accountId}` : "/profile");
    }
    getOwnerAccountId() {
        return this.page.textContent("data-test-id=ownerAccount.accountId");
    }
    getLockupAccountId() {
        return this.page.textContent("data-test-id=lockupAccount.accountId");
    }
    async getOwnerAccountTotalBalance() {
        const balanceStr = await this.page.textContent("data-test-id=ownerAccount.total");
        return balanceStr.split(' ')[0];
    }
    async getLockupAccountTotalBalance() {
        const balanceStr = await this.page.textContent("data-test-id=lockupAccount.total");
        return balanceStr.split(' ')[0];
    }
    async getOwnerAccountReservedForStorage() {
        const balanceStr = await this.page.textContent("data-test-id=ownerAccount.reservedForStorage");
        return balanceStr.split(' ')[0];
    }
    async getLockupAccountReservedForStorage() {
        const balanceStr = await this.page.textContent("data-test-id=lockupAccount.reservedForStorage");
        return balanceStr.split(' ')[0];
    }
    async getOwnerAccountReservedForTransactions() {
        const balanceStr = await this.page.textContent("data-test-id=ownerAccount.reservedForTransactions");
        return balanceStr.split(' ')[0];
    }
    async getOwnerAccountAvailableBalance() {
        const balanceStr = await this.page.textContent("data-test-id=ownerAccount.available");
        return balanceStr.split(' ')[0];
    }
    async getOwnerAccountStakingTotal() {
        const balanceStr = await this.page.textContent("data-test-id=ownerAccount.staking.total");
        return balanceStr.split(' ')[0];
    }
    async getLockupAccountStakingTotal() {
        const balanceStr = await this.page.textContent("data-test-id=lockupAccount.staking.total");
        return balanceStr.split(' ')[0];
    }
    async getOwnerAccountStaked() {
        const balanceStr = await this.page.textContent("data-test-id=ownerAccount.staking.staked");
        return balanceStr.split(' ')[0];
    }
    async getLockupAccountStaked() {
        const balanceStr = await this.page.textContent("data-test-id=lockupAccount.staking.staked");
        return balanceStr.split(' ')[0];
    }
    async getOwnerAccountPendingRelease() {
        const balanceStr = await this.page.textContent("data-test-id=ownerAccount.staking.pendingRelease");
        return balanceStr.split(' ')[0];
    }
    async getLockupAccountPendingRelease() {
        const balanceStr = await this.page.textContent("data-test-id=lockupAccount.staking.pendingRelease");
        return balanceStr.split(' ')[0];
    }
    async getOwnerAccountAvailableToWithdraw() {
        const balanceStr = await this.page.textContent("data-test-id=ownerAccount.staking.availableToWithdraw");
        return balanceStr.split(' ')[0];
    }
    async getLockupAccountAvailableToWithdraw() {
        const balanceStr = await this.page.textContent("data-test-id=lockupAccount.staking.availableToWithdraw");
        return balanceStr.split(' ')[0];
    }
    async getLockupAccountLocked() {
        const balanceStr = await this.page.textContent("data-test-id=lockupAccount.locked");
        return balanceStr.split(' ')[0];
    }
    async getLockupAccountUnlocked() {
        const balanceStr = await this.page.textContent("data-test-id=lockupAccount.unlocked");
        return balanceStr.split(' ')[0];
    }
    async getLockupAccountAvailableToTransfer() {
        const balanceStr = await this.page.textContent("data-test-id=lockupAccount.availableToTransfer");
        return balanceStr.split(' ')[0];
    }
    transferToWallet() {
        return this.page.click("data-test-id=lockupTransferToWalletButton");
    }
}

module.exports = { ProfilePage };
