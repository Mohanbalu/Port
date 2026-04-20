package com.port.logistics.controller;

import com.port.logistics.entity.MovementLog;
import com.port.logistics.service.MovementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movement-logs")
public class MovementLogController {

    @Autowired
    private MovementService movementService;

    // Movement logs are created automatically by MovementService, no POST here needed directly.
    @GetMapping("/container/{id}")
    public List<MovementLog> getMovementLogsByContainer(@PathVariable Long id) {
        return movementService.getContainerHistory(id);
    }
}
