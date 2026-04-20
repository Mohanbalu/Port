package com.port.logistics.service;

import com.port.logistics.entity.Container;
import com.port.logistics.entity.CustomsDeclaration;
import com.port.logistics.entity.User;
import com.port.logistics.entity.enums.ContainerStatus;
import com.port.logistics.entity.enums.CustomsStatus;
import com.port.logistics.entity.enums.MovementType;
import com.port.logistics.repository.ContainerRepository;
import com.port.logistics.repository.CustomsDeclarationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ContainerService {

    @Autowired
    private ContainerRepository containerRepository;

    @Autowired
    private CustomsDeclarationRepository customsRepository;

    @Autowired
    private MovementService movementService;

    public Container registerContainer(Container container, User registeredBy) {
        container.setStatus(ContainerStatus.ARRIVED);
        container.setArrivalDate(LocalDateTime.now());
        Container saved = containerRepository.save(container);
        movementService.logMovement(saved, MovementType.UNLOADED_FROM_VESSEL, registeredBy, "Port Terminal");
        return saved;
    }

    public Container updateStatus(Long id, ContainerStatus newStatus, User performedBy) {
        Container container = containerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Container not found"));

        validateLifecycle(container, newStatus);
        
        container.setStatus(newStatus);
        Container saved = containerRepository.save(container);
        
        MovementType type = mapStatusToMovement(newStatus);
        movementService.logMovement(saved, type, performedBy, "Port Facility");
        
        return saved;
    }

    private void validateLifecycle(Container container, ContainerStatus newStatus) {
        Optional<CustomsDeclaration> customsOpt = customsRepository.findByContainerId(container.getId());
        CustomsStatus customsStatus = customsOpt.map(CustomsDeclaration::getStatus).orElse(null);

        if (customsStatus == CustomsStatus.HELD) {
            throw new RuntimeException("Business Rule Violation: Cannot move container because Customs status is HELD");
        }

        if (newStatus == ContainerStatus.GATE_OUT && customsStatus != CustomsStatus.CLEARED) {
            throw new RuntimeException("Business Rule Violation: Cannot GATE_OUT without CLEARED Customs Status");
        }
        
        // Ensure lifecycle order: e.g. Cannot go from ARRIVED directly to DELIVERED without GATE_OUT
        // Simple sequential validation
        if (container.getStatus() == ContainerStatus.ARRIVED && newStatus == ContainerStatus.DELIVERED) {
             throw new RuntimeException("Business Rule Violation: Invalid transition from ARRIVED directly to DELIVERED");
        }
    }

    private MovementType mapStatusToMovement(ContainerStatus status) {
        switch (status) {
            case UNDER_REVIEW: return MovementType.CUSTOMS_INSPECTION;
            case CLEARED: return MovementType.MOVED_TO_STORAGE;
            case HELD: return MovementType.MOVED_TO_STORAGE;
            case GATE_OUT: return MovementType.GATE_OUT;
            case LOADED: return MovementType.LOADED_TO_VESSEL;
            case DEPARTED: return MovementType.IN_TRANSIT;
            case DELIVERED: return MovementType.DELIVERED;
            default: return MovementType.MOVED_TO_STORAGE;
        }
    }
    
    public Container getContainer(Long id) {
        return containerRepository.findContainerWithFullHistory(id)
                .orElseThrow(() -> new RuntimeException("Container not found"));
    }
    
    public List<Container> getAllContainers() {
        return containerRepository.findAll();
    }
}
