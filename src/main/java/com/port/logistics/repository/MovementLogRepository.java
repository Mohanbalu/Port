package com.port.logistics.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.port.logistics.entity.MovementLog;

@Repository
public interface MovementLogRepository extends JpaRepository<MovementLog, Long> {
    List<MovementLog> findByContainerIdOrderByMovementTimeDesc(Long containerId);
    
    // Calculate average clearance time: difference between DELIVERED and ARRIVED movements
        @Query(value = "SELECT AVG(TIMESTAMPDIFF(HOUR, arrived.movement_time, delivered.movement_time)) " +
               "FROM movement_logs arrived " +
               "JOIN movement_logs delivered ON arrived.container_id = delivered.container_id " +
               "WHERE arrived.movement_type = 'UNLOADED_FROM_VESSEL' " +
               "AND delivered.movement_type = 'DELIVERED' " +
               "AND delivered.movement_time > arrived.movement_time", 
           nativeQuery = true)
        Double calculateAverageClearanceTimeHours();
}
