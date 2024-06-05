describe('product delete test', () => {
    it('visits the product page and deletes an product', () => {
        cy.visit('/');
        cy.get('button').click();
        cy.contains('a', 'products').click();
        cy.contains('007G').click();
        cy.get('button').contains('Delete').click();
        cy.contains('deleted!');
    });
});