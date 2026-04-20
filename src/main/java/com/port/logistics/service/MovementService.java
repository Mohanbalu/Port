package com.port.logistics.service;

import com.port.logistics.entity.Container;
import com.port.logistics.entity.MovementLog;
import com.port.logistics.entity.User;
import com.port.logistics.entity.enums.MovementType;
import com.port.logistics.repository.MovementLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MovementService {

    @Autowired
    private MovementLogRepository movementLogRepository;

    public void logMovement(Container container, MovementType type, User performedBy, String location) {
        MovementLog log = MovementLog.builder()
                .container(container)
                .movementType(type)
                .movementTime(LocalDateTime.now())
                .performedBy(performedBy)
                .location(location)
                .build();
        movementLogRepository.save(log);
    }

    public List<MovementLog> getContainerHistory(Long containerId) {
        return movementLogRepository.findByContainerIdOrderByMovementTimeDesc(containerId);
    }
}
