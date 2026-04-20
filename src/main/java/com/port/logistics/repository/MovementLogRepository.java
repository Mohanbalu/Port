package com.port.logistics.repository;

import com.port.logistics.entity.MovementLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovementLogRepository extends JpaRepository<MovementLog, Long> {
    List<MovementLog> findByContainerIdOrderByMovementTimeDesc(Long containerId);
}
