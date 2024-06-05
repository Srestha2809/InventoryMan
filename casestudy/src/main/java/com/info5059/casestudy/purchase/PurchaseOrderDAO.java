package com.info5059.casestudy.purchase;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import com.info5059.casestudy.product.Product;
import com.info5059.casestudy.product.ProductRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class PurchaseOrderDAO {
    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private ProductRepository prodRepo;

    @Transactional
    public PurchaseOrder create(PurchaseOrder clientrep) {
        PurchaseOrder realPurchase = new PurchaseOrder();
        realPurchase.setVendorid(clientrep.getVendorid());
        realPurchase.setPodate(LocalDateTime.now());
        entityManager.persist(realPurchase);

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (PurchaseOrderLineitem item : clientrep.getItems()) {
            PurchaseOrderLineitem realItem = new PurchaseOrderLineitem();
            realItem.setProductid(item.getProductid());
            realItem.setPoid(realPurchase.getId());
            realItem.setPrice(item.getPrice());
            realItem.setQty(item.getQty());

            Product prod = prodRepo.findById(item.getProductid()).orElse(null);
            if (prod != null) {

                prod.setQoo(prod.getQoo() + item.getQty());
                prodRepo.saveAndFlush(prod);
                entityManager.persist(realItem);
            }
            entityManager.persist(realItem);

            BigDecimal lineItemAmount = item.getPrice().multiply(BigDecimal.valueOf(item.getQty()));
            totalAmount = totalAmount.add(lineItemAmount);

        }
        realPurchase.setAmount(totalAmount);
        entityManager.flush();
        entityManager.refresh(realPurchase);
        return realPurchase;
    }
}
