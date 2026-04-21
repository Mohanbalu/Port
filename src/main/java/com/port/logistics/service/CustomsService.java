package com.port.logistics.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.port.logistics.entity.Container;
import com.port.logistics.entity.CustomsDeclaration;
import com.port.logistics.entity.User;
import com.port.logistics.entity.enums.ContainerStatus;
import com.port.logistics.entity.enums.CustomsStatus;
import com.port.logistics.repository.CustomsDeclarationRepository;

@Service
public class CustomsService {

    @Autowired
    private CustomsDeclarationRepository customsRepository;

    @Autowired
    private ContainerService containerService;

    public CustomsDeclaration fileDeclaration(CustomsDeclaration declaration) {
        Container container = containerService.getContainer(declaration.getContainer().getId());
        if (container.getStatus() != ContainerStatus.ARRIVED && container.getStatus() != ContainerStatus.UNDER_REVIEW) {
            throw new RuntimeException("Business Rule Violation: Container must be ARRIVED to file customs declaration");
        }
        declaration.setStatus(CustomsStatus.PENDING);
        return customsRepository.save(declaration);
    }

    public CustomsDeclaration updateDeclarationStatus(Long declarationId, CustomsStatus newStatus, User officer, String remarks) {
        if (declarationId == null) {
            throw new RuntimeException("Declaration ID cannot be null");
        }
        CustomsDeclaration declaration = customsRepository.findById(declarationId)
                .orElseThrow(() -> new RuntimeException("Declaration not found"));
        
        declaration.setStatus(newStatus);
        declaration.setReviewedBy(officer);
        declaration.setRemarks(remarks);
        
        CustomsDeclaration saved = customsRepository.save(declaration);
        
        // Sync container status conditionally based on customs actions
        if (newStatus == CustomsStatus.CLEARED) {
            containerService.updateStatus(declaration.getContainer().getId(), ContainerStatus.CLEARED, officer);
        } else if (newStatus == CustomsStatus.HELD) {
            containerService.updateStatus(declaration.getContainer().getId(), ContainerStatus.HELD, officer);
        } else if (newStatus == CustomsStatus.UNDER_REVIEW) {
            containerService.updateStatus(declaration.getContainer().getId(), ContainerStatus.UNDER_REVIEW, officer);
        }
        
        return saved;
    }

    /**
     * ADMIN: Get all customs declarations
     */
    public List<CustomsDeclaration> getAllDeclarations() {
        return customsRepository.findAll();
    }

    /**
     * ADMIN: Filter customs declarations by status
     */
    public List<CustomsDeclaration> getDeclarationsByStatus(CustomsStatus status) {
        return customsRepository.findByStatus(status);
    }
}
