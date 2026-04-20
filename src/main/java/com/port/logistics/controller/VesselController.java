package com.port.logistics.controller;

import com.port.logistics.entity.Vessel;
import com.port.logistics.entity.VesselSchedule;
import com.port.logistics.service.VesselService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vessels")
public class VesselController {

    @Autowired
    private VesselService vesselService;

    @PostMapping
    public Vessel registerVessel(@RequestBody Vessel vessel) {
        return vesselService.registerVessel(vessel);
    }

    @PostMapping("/schedules")
    public VesselSchedule createSchedule(@RequestBody VesselSchedule schedule) {
        return vesselService.createSchedule(schedule);
    }

    @GetMapping("/schedules")
    public List<VesselSchedule> getSchedules() {
        return vesselService.getAllSchedules();
    }
}
