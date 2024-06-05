describe('Add Product', () => {
    it('should add a new product', () => {
        // Visit the page
        cy.visit('/');
        cy.get('button').click();
        cy.contains('a', 'products').click();
        cy.contains('control_point').click();
        // Fill in the product details in the form
        cy.get('input[formControlName=id]').type('007G'); // Replace with a unique product ID
        cy.get('mat-select[formControlName=vendorid]').click(); // Open the vendor dropdown
        cy.get('mat-option').first().click(); // Select the first vendor (change as needed)
        cy.get('input[formControlName=name]').type('NewName7');
        cy.get('input[formControlName=costprice]').type('102.3');
        cy.get('input[formControlName=msrp]').type('150.23');
        cy.contains('mat-expansion-panel-header', 'Inventory Information').click();
        cy.get('input[formControlName=rop]').click({ force: true }).type('15');
        cy.get('input[formControlName=eoq]').type('2');
        cy.get('input[formControlName=qoh]').type('10');
        cy.get('input[formControlName=qoo]').type('0');

        cy.get('button').contains('Save').click();

    });
});
