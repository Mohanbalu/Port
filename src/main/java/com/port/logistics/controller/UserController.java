package com.port.logistics.controller;

import com.port.logistics.entity.User;
import com.port.logistics.entity.enums.Role;
import com.port.logistics.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Open endpoint to register initially. In production, this would be admin-only or a separate signup flow.
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getUsers(@RequestParam(required = false) Role role) {
        if (role != null) {
            return userService.fetchUsersByRole(role);
        }
        return userService.fetchUsers();
    }
}
