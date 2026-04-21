package com.port.logistics.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.port.logistics.entity.Container;
import com.port.logistics.entity.CustomsDeclaration;
import com.port.logistics.entity.MovementLog;
import com.port.logistics.entity.PortStorageFee;
import com.port.logistics.entity.User;
import com.port.logistics.entity.Vessel;
import com.port.logistics.entity.VesselSchedule;
import com.port.logistics.entity.enums.CustomsStatus;
import com.port.logistics.service.ContainerService;
import com.port.logistics.service.CustomsService;
import com.port.logistics.service.FeeService;
import com.port.logistics.service.MovementService;
import com.port.logistics.service.ReportingService;
import com.port.logistics.service.UserService;
import com.port.logistics.service.VesselService;

/**
 * ADMIN-Only Controller
 * 
 * Provides administrative endpoints for:
 * - User Management
 * - System Monitoring (Containers, Vessels, Customs)
 * - Reports and Aggregates
 * - Fee Monitoring
 * 
 * All endpoints are protected with @PreAuthorize("hasRole('ADMIN')")
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private ContainerService containerService;

    @Autowired
    private VesselService vesselService;

    @Autowired
    private CustomsService customsService;

    @Autowired
    private FeeService feeService;

    @Autowired
    private MovementService movementService;

    @Autowired
    private ReportingService reportingService;

    // ==================== USER MANAGEMENT ====================

    /**
     * ADMIN: View all users in the system
     * Optional filter by role
     */
    @GetMapping("/users")
    public List<User> getAllUsers(@RequestParam(required = false) String role) {
        if (role != null && !role.isEmpty()) {
            try {
                com.port.logistics.entity.enums.Role enumRole = 
                    com.port.logistics.entity.enums.Role.valueOf(role.toUpperCase());
                return userService.fetchUsersByRole(enumRole);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid role: " + role);
            }
        }
        return userService.fetchUsers();
    }

    /**
     * ADMIN: Create a new user (with validation)
     */
    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    // ==================== CONTAINER MONITORING ====================

    /**
     * ADMIN: View all containers in the system
     */
    @GetMapping("/containers")
    public List<Container> viewAllContainers() {
        return containerService.getAllContainers();
    }

    /**
     * ADMIN: View specific container with full history
     */
    @GetMapping("/containers/{id}")
    public Container viewContainerDetails(@PathVariable Long id) {
        return containerService.getContainer(id);
    }

    /**
     * ADMIN: View container movement/journey logs
     */
    @GetMapping("/containers/{id}/journey")
    public List<MovementLog> viewContainerJourney(@PathVariable Long id) {
        return movementService.getContainerHistory(id);
    }

    // ==================== VESSEL MONITORING ====================

    /**
     * ADMIN: View all registered vessels
     */
    @GetMapping("/vessels")
    public List<Vessel> viewAllVessels() {
        return vesselService.getAllVessels();
    }

    /**
     * ADMIN: View all vessel schedules
     */
    @GetMapping("/vessels/schedules")
    public List<VesselSchedule> viewAllVesselSchedules() {
        return vesselService.getAllSchedules();
    }

    // ==================== CUSTOMS OVERSIGHT ====================

    /**
     * ADMIN: View all customs declarations
     */
    @GetMapping("/customs/declarations")
    public List<CustomsDeclaration> viewAllCustomsDeclarations() {
        return customsService.getAllDeclarations();
    }

    /**
     * ADMIN: Filter customs declarations by status
     * Query parameters: status (PENDING, CLEARED, HELD)
     */
    @GetMapping("/customs/declarations/filter")
    public List<CustomsDeclaration> filterCustomsDeclarationsByStatus(
            @RequestParam(required = false) String status) {
        
        if (status != null && !status.isEmpty()) {
            try {
                CustomsStatus customsStatus = CustomsStatus.valueOf(status.toUpperCase());
                return customsService.getDeclarationsByStatus(customsStatus);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid customs status: " + status);
            }
        }
        
        return customsService.getAllDeclarations();
    }

    /**
     * ADMIN: View customs declaration summary report
     */
    @GetMapping("/customs/summary")
    public Map<String, Object> getCustomsSummary() {
        return reportingService.getCustomsDeclarationSummary();
    }

    // ==================== FEE MONITORING ====================

    /**
     * ADMIN: View all calculated fees/invoices
     */
    @GetMapping("/fees")
    public List<PortStorageFee> viewAllFees() {
        return feeService.getAllFees();
    }

    /**
     * ADMIN: View fees for a specific container
     */
    @GetMapping("/fees/container/{id}")
    public PortStorageFee viewContainerFees(@PathVariable Long id) {
        return feeService.getInvoice(id);
    }

    // ==================== REPORTS & AGGREGATES ====================

    /**
     * ADMIN: Get aggregate report - Containers per vessel (shipping line)
     */
    @GetMapping("/reports/containers-per-vessel")
    public Map<String, Object> getContainersPerVesselReport() {
        return reportingService.getContainersPerVesselReport();
    }

    /**
     * ADMIN: Get aggregate report - Total fees collected
     * Shows paid vs pending fees
     */
    @GetMapping("/reports/fees-collected")
    public Map<String, Object> getFeesCollectedReport() {
        return reportingService.getTotalFeesCollectedReport();
    }

    /**
     * ADMIN: Get aggregate report - Average clearance time
     * Time from container arrival to delivery in hours
     */
    @GetMapping("/reports/average-clearance-time")
    public Map<String, Object> getAverageClearanceTimeReport() {
        return reportingService.getAverageClearanceTimeReport();
    }

    /**
     * ADMIN: Get system health report
     * Overall metrics dashboard
     */
    @GetMapping("/reports/system-health")
    public Map<String, Object> getSystemHealthReport() {
        return reportingService.getSystemHealthReport();
    }
}
