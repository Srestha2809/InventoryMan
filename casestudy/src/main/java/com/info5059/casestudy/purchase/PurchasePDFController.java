package com.info5059.casestudy.purchase;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.info5059.casestudy.product.Product;
import com.info5059.casestudy.product.ProductController;
import com.info5059.casestudy.product.ProductRepository;
import com.info5059.casestudy.product.QRCodeGenerator;
import com.info5059.casestudy.vendor.VendorRepository;

import jakarta.servlet.http.HttpServletRequest;

import java.io.ByteArrayInputStream;
import java.io.IOException;


@RestController
public class PurchasePDFController {
        @Autowired
        private ProductRepository productRepository;
        @Autowired
        private PurchaseOrderRepository purchaseRepository;
        @Autowired
        private VendorRepository vendorRepository;
        @Autowired
        private QRCodeGenerator qrCodeGenerator;

        @GetMapping(value = "/ReportPDF", produces = MediaType.APPLICATION_PDF_VALUE)
        public ResponseEntity<InputStreamResource> streamPDF(HttpServletRequest request) throws IOException { // get
                                                                                                              // formatted
                                                                                                              // pdf as
                                                                                                              // a
                                                                                                              // stream
                String repid = request.getParameter("repid");
                ByteArrayInputStream bis = PurchasePDFGenerator.generatePurchaseOrder(repid,
                                vendorRepository,
                                productRepository,
                                purchaseRepository,
                                qrCodeGenerator);
                HttpHeaders headers = new HttpHeaders();
                headers.add("Content-Disposition", "inline; filename=examplereport.pdf");
                // dump stream to browser
                return ResponseEntity
                                .ok()
                                .headers(headers)
                                .contentType(MediaType.APPLICATION_PDF)
                                .body(new InputStreamResource(bis));
        }
}