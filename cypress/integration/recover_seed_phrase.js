describe('Recover w/ seed phrase', function() {
    it('Enters username and phrase', function() {

        this.skip() // Skip this test for now

        //cy.visit('https://wallet.nearprotocol.com')
        cy.visit('http://localhost:1234')

        //temp array
        let phraseArr = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

        const testUserName = `cypress-test-${Math.floor(Math.random() * 100000).toString()}`

        cy.get('input')
        .first()
        .type(testUserName)

        cy.get('button')
        .should('contain', 'CREATE ACCOUNT')
        .click()

        cy.wait(5000) // TODO: should not be arbitrary number
        .then(() => {
            expect(localStorage.getItem(`nearlib:keystore:${testUserName}:default`))
            .to.not.be.null
        })
        cy.get('.phrase')
        .click()

        cy.get('button')
        .should('contain', 'SETUP RECOVERY PHRASE')
        .click()
        
        cy.wait(1000) // TODO: should not be arbitrary number
        .then(() => {
            cy.get('#seed-phrase')
            .children()
            .should('have.length', 12);
        })

        //TODO: Iterate over seed phrase and push into phraseArray

        cy.get('button').last().should('contain', 'CONTINUE').click()

        cy.get('input').first().type(phraseArr[3]) //TODO: Enter word from array based on h4

        // cy.get('#seed-phrase').children().each(function(child, i) {
        //     phraseArr.push(child[i])
        // })

        // let phrase = document.getElementById('seed-phrase');
        // for (var i = 0; i < phrase.length; i++) {
        //     phraseArr.push(phrase[i]);
        // }

        //let phraseNum = document.getElementsByTagName('h4')[0].innerText.replace(/\D/g,'');
        // cy.get('h4').first().invoke('text').then((text => {
        //     cy.get('input').first().type(phraseArr[text - 1])
        // }))

        // TODO: Recover account post setup
        // cy.get('a[href="/recover-account"]').click()
        // cy.get('a[href="/recover-seed-phrase"]').click()
        // cy.get('input').first().type(testUserName)
        // cy.get('input').last().type(phraseArr.join(''))
        // cy.get('button').should('contain', 'FIND MY ACCOUNT').click().should(() => {
        //     expect(localStorage.getItem(`nearlib:keystore:testing-account-cy:default`)).to.not.be.null
        // })
    })
})