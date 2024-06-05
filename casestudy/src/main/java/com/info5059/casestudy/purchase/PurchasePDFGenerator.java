package com.info5059.casestudy.purchase;

import com.info5059.casestudy.product.Product;
import com.info5059.casestudy.product.ProductRepository;
import com.info5059.casestudy.product.QRCodeGenerator;
import com.info5059.casestudy.vendor.Vendor;
import com.info5059.casestudy.vendor.VendorRepository;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.io.image.ImageDataFactory;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.servlet.view.document.AbstractPdfView;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.net.URL;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.swing.text.html.Option;


public abstract class PurchasePDFGenerator extends AbstractPdfView {

        private static Image addSummaryQRCode(Vendor vendor, PurchaseOrder po, QRCodeGenerator qrCodeGenerator) {
                DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd h:mm a");
                Locale locale = Locale.of("en", "US");
                NumberFormat formatter = NumberFormat.getCurrencyInstance(locale);
                BigDecimal subTotal = po.getAmount();
                BigDecimal taxtotal = new BigDecimal(0.0);
                BigDecimal totaltotal = new BigDecimal(0.0);
                taxtotal = taxtotal.add(subTotal.multiply((BigDecimal.valueOf(0.13))));
                totaltotal = subTotal.add(taxtotal);

                String qrCodeText = "Summary for Purchase Order: " + po.getId() + "\nDate: "
                                + dateFormatter.format(po.getPodate()) + "\nVendor: " + vendor.getName()
                                + "\nTotal: " + formatter.format(totaltotal);

                byte[] qrcodebin = qrCodeGenerator.generateQRCode(qrCodeText);
                Image qrcode = new Image(ImageDataFactory.create(qrcodebin)).scaleAbsolute(100, 100)
                                .setFixedPosition(460, 60);
                return qrcode;
        }
        

        public static ByteArrayInputStream generatePurchaseOrder(String repid, VendorRepository vendorRepository,
                        ProductRepository productRepository, PurchaseOrderRepository purchaseRepository,
                        QRCodeGenerator qrCodeGenerator)
                        throws IOException {
                PurchaseOrder po = new PurchaseOrder();
                URL imageUrl = PurchasePDFGenerator.class.getResource("/static/Image/test.png");
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                PdfWriter writer = new PdfWriter(baos);

                // Initialize PDF document to be written to a stream
                PdfDocument pdf = new PdfDocument(writer);

                // Document is the main object
                Document document = new Document(pdf);
                PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);

                // Add the image to the document
                PageSize pg = PageSize.A4;
                Image img = new Image(ImageDataFactory.create(imageUrl)).scaleAbsolute(120, 40)
                                .setFixedPosition(pg.getWidth() / 2 - 60, 750);
                document.add(img);

                document.add(new Paragraph("\n\n"));
                Locale locale = Locale.of("en", "US");
                NumberFormat formatter = NumberFormat.getCurrencyInstance(locale);

                try {
                        document.add(new Paragraph("\n"));
                        Optional<PurchaseOrder> poOption = purchaseRepository.findById(repid);

                        if (poOption.isPresent()) {
                                po = poOption.get();

                                document.add(new Paragraph("PurchaseOrder# " + repid).setFont(font).setFontSize(18)
                                                .setBold()
                                                .setMarginRight(pg.getWidth() / 2 - 75).setMarginTop(-10)
                                                .setTextAlignment(TextAlignment.RIGHT));
                                document.add(new Paragraph("\n\n"));

                                // Add the vendor info for the order here
                                Table vendorDesc = new Table(1).setWidth(new UnitValue(UnitValue.PERCENT, 30))
                                                .setHorizontalAlignment(HorizontalAlignment.LEFT);
                                Table vendorTable = new Table(1).setWidth(new UnitValue(UnitValue.PERCENT, 30))
                                                .setHorizontalAlignment(HorizontalAlignment.LEFT);

                                // Add vendor information to the table
                                Optional<Vendor> vendor = vendorRepository.findById(poOption.get().getVendorid());

                                // Create cells and add vendor details
                                Cell cell11 = new Cell().add(new Paragraph("Vendor"));
                                Cell cell12 = new Cell().add(new Paragraph(vendor.get().getName()));
                                Cell cell13 = new Cell().add(new Paragraph(vendor.get().getAddress1()));
                                Cell cell14 = new Cell().add(new Paragraph(vendor.get().getCity()));
                                Cell cell15 = new Cell().add(new Paragraph(vendor.get().getProvince()));
                                Cell cell16 = new Cell().add(new Paragraph(vendor.get().getEmail()));

                                // Set background color
                                cell12.setBackgroundColor(ColorConstants.LIGHT_GRAY);
                                cell13.setBackgroundColor(ColorConstants.LIGHT_GRAY);
                                cell14.setBackgroundColor(ColorConstants.LIGHT_GRAY);
                                cell15.setBackgroundColor(ColorConstants.LIGHT_GRAY);
                                cell16.setBackgroundColor(ColorConstants.LIGHT_GRAY);

                                vendorDesc.addCell(cell11);
                                vendorTable.addCell(cell12);
                                vendorTable.addCell(cell13);
                                vendorTable.addCell(cell14);
                                vendorTable.addCell(cell15);
                                vendorTable.addCell(cell16);

                                document.add(new Paragraph("Vendor: ").setFont(font).setFontSize(18).setBold()
                                                .setMarginRight(pg.getWidth() / 2 - 75).setMarginTop(-10)
                                                .setTextAlignment(TextAlignment.LEFT));
                                document.add(vendorTable);

                                BigDecimal subTotal = new BigDecimal(0.0);
                                BigDecimal taxtotal = new BigDecimal(0.0);
                                BigDecimal totaltotal = new BigDecimal(0.0);

                                // Dump out the line items in another table
                                Table lineItemTable = new Table(5).useAllAvailableWidth();

                                // Add table headings
                                Cell heading1 = new Cell().add(new Paragraph("Product Code"));
                                Cell heading2 = new Cell().add(new Paragraph("Description"));
                                Cell heading3 = new Cell().add(new Paragraph("Price"));
                                Cell heading4 = new Cell().add(new Paragraph("Quantity"));
                                Cell heading5 = new Cell().add(new Paragraph("Extended Price"));

                                heading1.setBackgroundColor(ColorConstants.LIGHT_GRAY);
                                heading2.setBackgroundColor(ColorConstants.LIGHT_GRAY);
                                heading3.setBackgroundColor(ColorConstants.LIGHT_GRAY);
                                heading4.setBackgroundColor(ColorConstants.LIGHT_GRAY);
                                heading5.setBackgroundColor(ColorConstants.LIGHT_GRAY);

                                lineItemTable.addCell(heading1);
                                lineItemTable.addCell(heading2);
                                lineItemTable.addCell(heading3);
                                lineItemTable.addCell(heading4);
                                lineItemTable.addCell(heading5);

                                for (PurchaseOrderLineitem lineItem : po.getItems()) {
                                        Optional<Product> productOptional = productRepository
                                                        .findById(lineItem.getProductid());
                                        if (productOptional.isPresent()) {
                                                Product product = productOptional.get();

                                                // Create cells and add line item details
                                                Cell cell1 = new Cell().add(new Paragraph(product.getId()));
                                                Cell cell2 = new Cell().add(new Paragraph(product.getName()));
                                                Cell cell3 = new Cell().add(new Paragraph(
                                                                formatter.format(product.getCostprice())));
                                                Cell cell4 = new Cell()
                                                                .add(new Paragraph(String.valueOf(lineItem.getQty())));

                                                BigDecimal extendedPrice = product.getCostprice()
                                                                .multiply(BigDecimal.valueOf(lineItem.getQty()));
                                                Cell cell5 = new Cell()
                                                                .add(new Paragraph(formatter.format(extendedPrice)));

                                                lineItemTable.addCell(cell1);
                                                lineItemTable.addCell(cell2);
                                                lineItemTable.addCell(cell3);
                                                lineItemTable.addCell(cell4);
                                                lineItemTable.addCell(cell5);

                                                subTotal = subTotal.add(extendedPrice);
                                        }
                                }
                                taxtotal = taxtotal.add(subTotal.multiply((BigDecimal.valueOf(0.13))));
                                totaltotal = subTotal.add(taxtotal);

                                // PurchaseOrder total
                                Cell totalLabel = new Cell(1, 4).add(new Paragraph("Sub Total:"))
                                                .setBorder(Border.NO_BORDER)
                                                .setTextAlignment(TextAlignment.RIGHT);
                                lineItemTable.addCell(totalLabel);

                                Cell subTotalCell = new Cell().add(new Paragraph(formatter.format(subTotal)))
                                                .setTextAlignment(TextAlignment.RIGHT)
                                                .setBackgroundColor(ColorConstants.GRAY);
                                lineItemTable.addCell(subTotalCell);

                                Cell Tax = new Cell(1, 4).add(new Paragraph("Tax:"))
                                                .setBorder(Border.NO_BORDER)
                                                .setTextAlignment(TextAlignment.RIGHT);
                                lineItemTable.addCell(Tax);

                                Cell taxtCell = new Cell().add(new Paragraph(formatter.format(taxtotal)))
                                                .setTextAlignment(TextAlignment.RIGHT)
                                                .setBackgroundColor(ColorConstants.GRAY);
                                lineItemTable.addCell(taxtCell);

                                Cell Total = new Cell(1, 4).add(new Paragraph("PO Total:"))
                                                .setBorder(Border.NO_BORDER)
                                                .setTextAlignment(TextAlignment.RIGHT);
                                lineItemTable.addCell(Total);

                                Cell totalCell = new Cell().add(new Paragraph(formatter.format(totaltotal)))
                                                .setTextAlignment(TextAlignment.RIGHT)
                                                .setBackgroundColor(ColorConstants.YELLOW);
                                lineItemTable.addCell(totalCell);

                                document.add(lineItemTable);

                                // Add the QR Code to the document
                                if (vendor.isPresent() && poOption.isPresent()) {
                                        Image qrcode = addSummaryQRCode(vendor.get(), poOption.get(), qrCodeGenerator);
                                        document.add(qrcode);
                                }
                        }
                        document.add(new Paragraph("\n\n"));
                        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd h:mm a");
                        document.add(new Paragraph(dateFormatter.format(LocalDateTime.now()))
                                        .setTextAlignment(TextAlignment.CENTER));

                        document.close();
                } catch (Exception ex) {
                        Logger.getLogger(PurchasePDFGenerator.class.getName()).log(Level.SEVERE, null, ex);
                }

                return new ByteArrayInputStream(baos.toByteArray());
        }
}