package com.port.logistics.repository;

import com.port.logistics.entity.VesselSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VesselScheduleRepository extends JpaRepository<VesselSchedule, Long> {
}
