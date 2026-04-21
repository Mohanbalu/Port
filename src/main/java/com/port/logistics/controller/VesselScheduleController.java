package com.port.logistics.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.port.logistics.entity.VesselSchedule;
import com.port.logistics.entity.enums.VesselStatus;
import com.port.logistics.service.VesselService;

@RestController
@RequestMapping("/api/vessel-schedules")
public class VesselScheduleController {

    @Autowired
    private VesselService vesselService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SHIPPING_LINE')")
    public VesselSchedule createSchedule(@RequestBody VesselSchedule schedule) {
        return vesselService.createSchedule(schedule);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','SHIPPING_LINE')")
    public VesselSchedule updateScheduleStatus(@PathVariable Long id, @RequestParam VesselStatus status) {
        return vesselService.updateStatus(id, status);
    }
}
