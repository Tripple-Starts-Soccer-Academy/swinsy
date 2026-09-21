package com.swinsy.repository;

import com.swinsy.model.PaymentInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentInfoRepository extends JpaRepository<PaymentInfo, Long> {
    List<PaymentInfo> findByGigId(Long gigId);
}
