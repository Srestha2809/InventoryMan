package com.info5059.casestudy.purchase;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.info5059.casestudy.product.Product;

import jakarta.transaction.Transactional;

import org.springframework.data.repository.CrudRepository;


@RepositoryRestResource(collectionResourceRel = "purchases", path = "purchases")
@Repository
public interface PurchaseOrderRepository extends CrudRepository<PurchaseOrder, String> {
    // extend so we can return the number of rows deleted
    @Modifying
    @Transactional
    @Query("delete from PurchaseOrder where id = ?1")
    int deleteOne(String productid);

    List<PurchaseOrder> findByVendorid(Long vendorid);

    Optional<PurchaseOrder> findByid(Long vendorid);
}