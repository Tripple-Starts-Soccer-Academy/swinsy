package com.swinsy.repository;

import com.swinsy.model.Gig;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GigRepository extends JpaRepository<Gig, Long> {
    List<Gig> findByFolder(String folder);
}
