package com.port.logistics.controller;

import com.port.logistics.entity.Container;
import com.port.logistics.entity.User;
import com.port.logistics.entity.enums.ContainerStatus;
import com.port.logistics.security.services.UserDetailsImpl;
import com.port.logistics.service.ContainerService;
import com.port.logistics.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/containers")
public class ContainerController {

    @Autowired
    private ContainerService containerService;
    
    @Autowired
    private UserService userService;

    @PostMapping
    public Container registerContainer(@RequestBody Container container, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userService.fetchUsers().stream()
                 .filter(u -> u.getId().equals(userDetails.getId()))
                 .findFirst().orElseThrow();
        return containerService.registerContainer(container, user);
    }

    @GetMapping
    public List<Container> getAllContainers() {
        return containerService.getAllContainers();
    }

    @GetMapping("/{id}")
    public Container getContainer(@PathVariable Long id) {
        return containerService.getContainer(id);
    }

    @PutMapping("/{id}/status")
    public Container updateStatus(@PathVariable Long id, @RequestParam ContainerStatus status, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userService.fetchUsers().stream()
                 .filter(u -> u.getId().equals(userDetails.getId()))
                 .findFirst().orElseThrow();
        return containerService.updateStatus(id, status, user);
    }
}
