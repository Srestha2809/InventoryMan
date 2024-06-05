INSERT INTO Vendor (Address1,City,Province,PostalCode,Phone,Type,Name,Email)VALUES ('123 Maple
St','London','On', 'N1N-1N1','(555)555-5555','Trusted','ABC Supply Co.','abc@supply.com');
INSERT INTO Vendor (Address1,City,Province,PostalCode,Phone,Type,Name,Email) VALUES ('543
Sycamore Ave','Toronto','On', 'N1P-1N1','(999)555-5555','Trusted','Big Bills
Depot','bb@depot.com');
INSERT INTO Vendor (Address1,City,Province,PostalCode,Phone,Type,Name,Email) VALUES ('922 Oak
St','London','On', 'N1N-1N1','(555)555-5599','Untrusted','Shady Sams','ss@underthetable.com');
INSERT INTO Vendor (Address1,City,Province,PostalCode,Phone,Type,Name,Email) VALUES ('372 Flanders Row','London','Ontario','N5Y 1C4','(555)555-5599','Trusted','Srestha Bharadwaj','sb@gmail.com');


INSERT INTO Product (id, vendorid, name, costprice, msrp, rop, eoq, qoh, qoo, qrcode, qrcodetxt)
VALUES ('001X', 1, 'Widget', 129.98, 159.99, 5, 10, 10, 0, 'QRCodeValue1', 'QRCodeText1');

INSERT INTO Product (id, vendorid, name, costprice, msrp, rop, eoq, qoh, qoo, qrcode, qrcodetxt)
VALUES ('002X', 1, 'Chess', 199.08, 210.09, 2, 11, 13, 0, 'QRCodeValue2', 'QRCodeText2');

INSERT INTO Product (id, vendorid, name, costprice, msrp, rop, eoq, qoh, qoo, qrcode, qrcodetxt)
VALUES ('003X', 4, 'BasketBall', 119.28, 132.29, 5, 10, 10, 0, 'QRCodeValue3', 'QRCodeText3');

INSERT INTO Product (id, vendorid, name, costprice, msrp, rop, eoq, qoh, qoo, qrcode, qrcodetxt)
VALUES ('004X', 4, 'Bat', 119.18, 149.29, 7, 11, 12, 0, 'QRCodeValue4', 'QRCodeText4');

INSERT INTO Product (id, vendorid, name, costprice, msrp, rop, eoq, qoh, qoo, qrcode, qrcodetxt)
VALUES ('005X', 4, 'Pen', 159.88, 179.99, 6, 10, 10, 0, 'QRCodeValue5', 'QRCodeText5');

INSERT INTO Product (id, vendorid, name, costprice, msrp, rop, eoq, qoh, qoo, qrcode, qrcodetxt)
VALUES ('006X', 4, 'Perfume', 199.18, 210.89, 9, 12, 15, 0, 'QRCodeValue6', 'QRCodeText6');

INSERT INTO Product (id, vendorid, name, costprice, msrp, rop, eoq, qoh, qoo, qrcode, qrcodetxt)
VALUES ('007X', 2, 'Dior', 129.98, 159.99, 5, 10, 10, 0, 'QRCodeValue1', 'QRCodeText1');

INSERT INTO Product (id, vendorid, name, costprice, msrp, rop, eoq, qoh, qoo, qrcode, qrcodetxt)
VALUES ('008X', 2, 'Laptop', 199.08, 210.09, 2, 11, 13, 0, 'QRCodeValue2', 'QRCodeText2');

INSERT INTO Product (id, vendorid, name, costprice, msrp, rop, eoq, qoh, qoo, qrcode, qrcodetxt)
VALUES ('009X', 2, 'Football', 119.28, 132.29, 5, 10, 10, 0, 'QRCodeValue3', 'QRCodeText3');

INSERT INTO Product (id, vendorid, name, costprice, msrp, rop, eoq, qoh, qoo, qrcode, qrcodetxt)
VALUES ('010X', 3, 'Van', 119.18, 149.29, 7, 11, 12, 0, 'QRCodeValue4', 'QRCodeText4');

INSERT INTO Product (id, vendorid, name, costprice, msrp, rop, eoq, qoh, qoo, qrcode, qrcodetxt)
VALUES ('011X', 3, 'Bottle', 159.88, 179.99, 6, 10, 10, 0, 'QRCodeValue5', 'QRCodeText5');

INSERT INTO Product (id, vendorid, name, costprice, msrp, rop, eoq, qoh, qoo, qrcode, qrcodetxt)
VALUES ('012X', 4, 'Lays', 199.18, 210.89, 9, 12, 15, 0, 'QRCodeValue6', 'QRCodeText6');
