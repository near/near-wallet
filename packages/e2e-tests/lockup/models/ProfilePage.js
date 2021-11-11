class ProfilePage {
    constructor(page) {
        this.page = page;
    }
    async navigate(accountId) {
        await this.page.goto(accountId ? `/profile/${accountId}` : "/profile");
    }
    async getOwnerAccountId() {
        return this.page.textContent("data-test-id=ownerAccount.accountId");
    }
    async getLockupAccountId() {
        return this.page.textContent("data-test-id=lockupAccount.accountId");
    }
    async getOwnerAccountTotalBalance() {
        return this.page.textContent("data-test-id=ownerAccount.total");
    }
    async getLockupAccountTotalBalance() {
        return this.page.textContent("data-test-id=lockupAccount.total");
    }
    async getOwnerAccountReservedForStorage() {
        return this.page.textContent("data-test-id=ownerAccount.reservedForStorage");
    }
    async getLockupAccountReservedForStorage() {
        return this.page.textContent("data-test-id=lockupAccount.reservedForStorage");
    }
    async getOwnerAccountReservedForTransactions() {
        return this.page.textContent("data-test-id=ownerAccount.reservedForTransactions");
    }
    async getOwnerAccountAvailableBalance() {
        return this.page.textContent("data-test-id=ownerAccount.available");
    }
    async getOwnerAccountStakingTotal() {
        return this.page.textContent("data-test-id=ownerAccount.staking.total");
    }
    async getLockupAccountStakingTotal() {
        return this.page.textContent("data-test-id=lockupAccount.staking.total");
    }
    async getOwnerAccountStaked() {
        return this.page.textContent("data-test-id=ownerAccount.staking.staked");
    }
    async getLockupAccountStaked() {
        return this.page.textContent("data-test-id=lockupAccount.staking.staked");
    }
    async getOwnerAccountPendingRelease() {
        return this.page.textContent("data-test-id=ownerAccount.staking.pendingRelease");
    }
    async getLockupAccountPendingRelease() {
        return this.page.textContent("data-test-id=lockupAccount.staking.pendingRelease");
    }
    async getOwnerAccountAvailableToWithdraw() {
        return this.page.textContent("data-test-id=ownerAccount.staking.availableToWithdraw");
    }
    async getLockupAccountAvailableToWithdraw() {
        return this.page.textContent("data-test-id=lockupAccount.staking.availableToWithdraw");
    }
    async getLockupAccountLocked() {
        return this.page.textContent("data-test-id=lockupAccount.locked");
    }
    async getLockupAccountUnlocked() {
        return this.page.textContent("data-test-id=lockupAccount.unlocked");
    }
    async getLockupAccountAvailableToTransfer() {
        return this.page.textContent("data-test-id=lockupAccount.availableToTransfer");
    }
}

module.exports = { ProfilePage };
