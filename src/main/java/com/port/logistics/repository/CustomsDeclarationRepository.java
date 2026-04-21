package com.port.logistics.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.port.logistics.entity.CustomsDeclaration;
import com.port.logistics.entity.enums.CustomsStatus;

@Repository
public interface CustomsDeclarationRepository extends JpaRepository<CustomsDeclaration, Long> {
    Optional<CustomsDeclaration> findByContainerId(Long containerId);
    
    // Filter customs declarations by status
    List<CustomsDeclaration> findByStatus(CustomsStatus status);
    
    // Aggregate query: count declarations by status
    @Query("SELECT cd.status, COUNT(cd) FROM CustomsDeclaration cd GROUP BY cd.status")
    List<Object[]> countByStatus();
}
