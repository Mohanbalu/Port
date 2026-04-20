package com.port.logistics.repository;

import com.port.logistics.entity.CustomsDeclaration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomsDeclarationRepository extends JpaRepository<CustomsDeclaration, Long> {
    Optional<CustomsDeclaration> findByContainerId(Long containerId);
}
