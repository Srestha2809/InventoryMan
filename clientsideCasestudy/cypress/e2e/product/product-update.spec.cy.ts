describe('Product update test', () => {
    it('visits the Product page and updates an Product', () => {
        cy.visit('/');
        cy.get('button').click();
        cy.contains('a', 'products').click();
        cy.contains('007G').click(); // replace Slick with your own name
        cy.get("input[formcontrolname=costprice]").click({ force: true }).clear();
        cy.get("input[formcontrolname=costprice]").type('189.12');
        cy.get('button').contains('Save').click();
        cy.contains('updated!');
    });
});