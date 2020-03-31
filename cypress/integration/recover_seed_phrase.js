describe('Recover w/ seed phrase', function() {
    it('Enters username and phrase', function() {
        cy.visit('https://wallet.nearprotocol.com')
        cy.get('a[href="/recover-account"]').click()
        cy.get('a[href="/recover-seed-phrase"]').click()
        cy.get('input').first().type('testing-account-cy')
        cy.get('input').last().type('neutral cover observe enjoy figure vote pride ride verb absurd order mixed')
        cy.get('button').should('contain', 'FIND MY ACCOUNT').click().should(() => {
            expect(localStorage.getItem(`nearlib:keystore:testing-account-cy:default`)).to.not.be.null
        })
    })
})