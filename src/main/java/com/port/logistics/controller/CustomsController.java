package com.port.logistics.controller;

import com.port.logistics.entity.CustomsDeclaration;
import com.port.logistics.entity.User;
import com.port.logistics.entity.enums.CustomsStatus;
import com.port.logistics.security.services.UserDetailsImpl;
import com.port.logistics.service.CustomsService;
import com.port.logistics.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customs/declaration")
public class CustomsController {

    @Autowired
    private CustomsService customsService;
    
    @Autowired
    private UserService userService;

    @PostMapping
    public CustomsDeclaration fileDeclaration(@RequestBody CustomsDeclaration declaration) {
        return customsService.fileDeclaration(declaration);
    }

    @PutMapping("/{id}/clear")
    public CustomsDeclaration clearDeclaration(@PathVariable Long id, @RequestParam(required = false) String remarks, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userService.fetchUsers().stream().filter(u -> u.getId().equals(userDetails.getId())).findFirst().orElseThrow();
        return customsService.updateDeclarationStatus(id, CustomsStatus.CLEARED, user, remarks);
    }

    @PutMapping("/{id}/hold")
    public CustomsDeclaration holdDeclaration(@PathVariable Long id, @RequestParam(required = false) String remarks, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userService.fetchUsers().stream().filter(u -> u.getId().equals(userDetails.getId())).findFirst().orElseThrow();
        return customsService.updateDeclarationStatus(id, CustomsStatus.HELD, user, remarks);
    }
}
