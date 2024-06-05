describe('vendor add test', () => {
    it('visits the vendor page and adds an vendor', () => {
        cy.visit('/');
        cy.get('button').click();
        cy.contains('a', 'vendors').click();
        cy.contains('control_point').click();
        cy.get('input[formcontrolname=name')
            .click({ force: true })
            .type('John');
        cy.get('input[formcontrolname=address1').click({ force: true }).type('34 Gander Drive');
        cy.get('input[formcontrolname=city').click({ force: true }).type('Scarborough');
        cy.get('mat-select[formcontrolname=province]').click(); // Select the dropdown
        cy.get('mat-option[value="On"]').click(); // Choose "Ontario" option

        cy.get('input[formcontrolname=postalcode').click({ force: true }).type('N5Y-1C4');
        cy.get('input[formcontrolname=phone')
            .click({ force: true })
            .type('(555)555-5555');
        cy.get('input[formcontrolname=type').click({ force: true }).type('trusted');
        cy.get('input[formcontrolname=email')
            .click({ force: true })
            .type('jd@here.com');
        cy.get('button').contains('Save').click();
        cy.contains('added!');
    });
});