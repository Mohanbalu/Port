package com.port.logistics.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.port.logistics.entity.Container;
import com.port.logistics.entity.PortStorageFee;
import com.port.logistics.repository.PortStorageFeeRepository;

@Service
public class FeeService {

    private static final double DAILY_STORAGE_RATE = 50.0;
    private static final double DAILY_DEMURRAGE_RATE = 100.0;
    private static final double FLAT_DETENTION_FEE = 200.0;

    @Autowired
    private PortStorageFeeRepository feeRepository;

    @Autowired
    private ContainerService containerService;

    public PortStorageFee calculateFees(Long containerId) {
        Container container = containerService.getContainer(containerId);
        
        LocalDateTime start = container.getArrivalDate();
        if (start == null) start = LocalDateTime.now();
        
        long daysStored = ChronoUnit.DAYS.between(start, LocalDateTime.now());
        if (daysStored < 0) daysStored = 0;
        
        // Storage Fee = max(0, days - 7) * rate
        double storageFee = Math.max(0, daysStored - 7) * DAILY_STORAGE_RATE;
        
        double demurrageFee = daysStored * DAILY_DEMURRAGE_RATE;
        
        double totalAmount = storageFee + demurrageFee + FLAT_DETENTION_FEE;
        
        PortStorageFee feeRecord = feeRepository.findByContainerId(containerId)
                .orElse(new PortStorageFee());
        
        feeRecord.setContainer(container);
        feeRecord.setDaysStored((int) daysStored);
        feeRecord.setStorageFee(storageFee);
        feeRecord.setDemurrageFee(demurrageFee);
        feeRecord.setDetentionFee(FLAT_DETENTION_FEE);
        feeRecord.setTotalAmount(totalAmount);
        feeRecord.setCalculatedAt(LocalDateTime.now());
        
        return feeRepository.save(feeRecord);
    }
    
    public PortStorageFee getInvoice(Long containerId) {
        return feeRepository.findByContainerId(containerId)
                .orElseThrow(() -> new RuntimeException("Invoice not found. Calculate fees first."));
    }

    /**
     * ADMIN: Get all calculated fees
     */
    public List<PortStorageFee> getAllFees() {
        return feeRepository.findAll();
    }
}
