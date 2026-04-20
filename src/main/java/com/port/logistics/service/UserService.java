package com.port.logistics.service;

import com.port.logistics.entity.User;
import com.port.logistics.entity.enums.Role;
import com.port.logistics.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    public User createUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Error: Username is already taken!");
        }
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public List<User> fetchUsers() {
        return userRepository.findAll();
    }

    public List<User> fetchUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }
}
