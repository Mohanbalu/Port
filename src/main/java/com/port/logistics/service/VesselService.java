package com.port.logistics.service;

import com.port.logistics.entity.Vessel;
import com.port.logistics.entity.VesselSchedule;
import com.port.logistics.entity.enums.VesselStatus;
import com.port.logistics.repository.VesselRepository;
import com.port.logistics.repository.VesselScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VesselService {

    @Autowired
    private VesselRepository vesselRepository;

    @Autowired
    private VesselScheduleRepository vesselScheduleRepository;

    public Vessel registerVessel(Vessel vessel) {
        return vesselRepository.save(vessel);
    }

    public VesselSchedule createSchedule(VesselSchedule schedule) {
        if (schedule.getStatus() == null) {
            schedule.setStatus(VesselStatus.SCHEDULED);
        }
        return vesselScheduleRepository.save(schedule);
    }

    public VesselSchedule updateStatus(Long scheduleId, VesselStatus newStatus) {
        VesselSchedule schedule = vesselScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Vessel Schedule not found"));
        schedule.setStatus(newStatus);
        return vesselScheduleRepository.save(schedule);
    }

    public List<VesselSchedule> getAllSchedules() {
        return vesselScheduleRepository.findAll();
    }
    
    public List<Vessel> getAllVessels() {
        return vesselRepository.findAll();
    }
}
