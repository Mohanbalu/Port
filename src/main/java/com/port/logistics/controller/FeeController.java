package com.port.logistics.controller;

import com.port.logistics.entity.PortStorageFee;
import com.port.logistics.service.FeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fees")
public class FeeController {

    @Autowired
    private FeeService feeService;

    @PostMapping("/calculate")
    public PortStorageFee calculateFees(@RequestParam Long containerId) {
        return feeService.calculateFees(containerId);
    }

    @GetMapping("/container/{id}")
    public PortStorageFee getFeesByContainer(@PathVariable Long id) {
        return feeService.getInvoice(id); 
    }

    @GetMapping("/invoice/{id}")
    public PortStorageFee getInvoice(@PathVariable Long id) {
        return feeService.getInvoice(id);
    }
}
