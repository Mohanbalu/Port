package com.port.logistics.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.port.logistics.entity.enums.CustomsStatus;
import com.port.logistics.repository.ContainerRepository;
import com.port.logistics.repository.CustomsDeclarationRepository;
import com.port.logistics.repository.MovementLogRepository;
import com.port.logistics.repository.PortStorageFeeRepository;
import com.port.logistics.repository.VesselRepository;

@Service
public class ReportingService {

    @Autowired
    private ContainerRepository containerRepository;

    @Autowired
    private PortStorageFeeRepository feeRepository;

    @Autowired
    private MovementLogRepository movementLogRepository;

    @Autowired
    private CustomsDeclarationRepository customsRepository;

    @Autowired
    private VesselRepository vesselRepository;

    /**
     * Get aggregate report: Total containers handled per shipping line (vessel)
     * 
     * @return Map with vessel name and container count
     */
    public Map<String, Object> getContainersPerVesselReport() {
        Map<String, Object> report = new HashMap<>();
        
        try {
            // Fetch aggregate data from repository
            var containersByVessel = containerRepository.countContainersPerVessel();
            
            report.put("reportType", "CONTAINERS_PER_VESSEL");
            report.put("title", "Total Containers Handled Per Shipping Line");
            report.put("data", containersByVessel);
            report.put("status", "SUCCESS");
        } catch (Exception e) {
            report.put("status", "ERROR");
            report.put("message", e.getMessage());
        }
        
        return report;
    }

    /**
     * Get aggregate report: Total fees collected (paid invoices)
     * 
     * @return Map with total fees collected
     */
    public Map<String, Object> getTotalFeesCollectedReport() {
        Map<String, Object> report = new HashMap<>();
        
        try {
            Double totalFeesCollected = feeRepository.calculateTotalFeesCollected();
            Double totalFeesPending = feeRepository.calculateTotalFeesPending();
            Double grandTotal = (totalFeesCollected != null ? totalFeesCollected : 0.0) +
                                (totalFeesPending != null ? totalFeesPending : 0.0);
            
            report.put("reportType", "FEES_COLLECTION");
            report.put("title", "Fee Collection Report");
            report.put("totalCollected", totalFeesCollected != null ? totalFeesCollected : 0.0);
            report.put("totalPending", totalFeesPending != null ? totalFeesPending : 0.0);
            report.put("grandTotal", grandTotal);
            report.put("status", "SUCCESS");
        } catch (Exception e) {
            report.put("status", "ERROR");
            report.put("message", e.getMessage());
        }
        
        return report;
    }

    /**
     * Get aggregate report: Average clearance time for containers
     * Clearance time = time from arrival (UNLOADED_FROM_VESSEL) to delivery (DELIVERED)
     * 
     * @return Map with average clearance time in hours
     */
    public Map<String, Object> getAverageClearanceTimeReport() {
        Map<String, Object> report = new HashMap<>();
        
        try {
            Double avgClearanceHours = movementLogRepository.calculateAverageClearanceTimeHours();
            
            // Convert hours to days for better readability
            Double avgClearanceDays = avgClearanceHours != null ? avgClearanceHours / 24.0 : 0.0;
            
            report.put("reportType", "AVERAGE_CLEARANCE_TIME");
            report.put("title", "Average Container Clearance Time");
            report.put("averageClearanceTimeHours", avgClearanceHours != null ? avgClearanceHours : 0.0);
            report.put("averageClearanceTimeDays", avgClearanceDays);
            report.put("status", "SUCCESS");
        } catch (Exception e) {
            report.put("status", "ERROR");
            report.put("message", e.getMessage());
        }
        
        return report;
    }

    /**
     * Get customs declaration summary report
     * Shows count of declarations by status
     * 
     * @return Map with customs summary
     */
    public Map<String, Object> getCustomsDeclarationSummary() {
        Map<String, Object> report = new HashMap<>();
        
        try {
            long pending = customsRepository.findByStatus(CustomsStatus.PENDING).size();
            long cleared = customsRepository.findByStatus(CustomsStatus.CLEARED).size();
            long held = customsRepository.findByStatus(CustomsStatus.HELD).size();
            
            report.put("reportType", "CUSTOMS_SUMMARY");
            report.put("title", "Customs Declaration Status Summary");
            report.put("pending", pending);
            report.put("cleared", cleared);
            report.put("held", held);
            report.put("total", pending + cleared + held);
            report.put("status", "SUCCESS");
        } catch (Exception e) {
            report.put("status", "ERROR");
            report.put("message", e.getMessage());
        }
        
        return report;
    }

    /**
     * Get overall system health report
     * Combines multiple metrics
     * 
     * @return Map with system metrics
     */
    public Map<String, Object> getSystemHealthReport() {
        Map<String, Object> report = new HashMap<>();
        
        try {
            long totalContainers = containerRepository.count();
            long totalVessels = vesselRepository.count();
            long totalDeclarations = customsRepository.count();
            Double totalFeesCollected = feeRepository.calculateTotalFeesCollected();
            
            report.put("reportType", "SYSTEM_HEALTH");
            report.put("title", "Port Logistics System Health Report");
            report.put("totalContainers", totalContainers);
            report.put("totalVessels", totalVessels);
            report.put("totalCustomsDeclarations", totalDeclarations);
            report.put("totalFeesCollected", totalFeesCollected != null ? totalFeesCollected : 0.0);
            report.put("status", "SUCCESS");
        } catch (Exception e) {
            report.put("status", "ERROR");
            report.put("message", e.getMessage());
        }
        
        return report;
    }
}
