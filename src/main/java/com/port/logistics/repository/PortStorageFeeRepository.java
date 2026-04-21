package com.port.logistics.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.port.logistics.entity.PortStorageFee;

@Repository
public interface PortStorageFeeRepository extends JpaRepository<PortStorageFee, Long> {
    Optional<PortStorageFee> findByContainerId(Long containerId);

    // Aggregate query: total demurrage per month
    @Query(value = "SELECT SUM(demurrage_fee) FROM port_storage_fees " +
                   "WHERE YEAR(calculated_at) = :year AND MONTH(calculated_at) = :month", 
           nativeQuery = true)
    Double calculateTotalDemurragePerMonth(@Param("year") int year, @Param("month") int month);
    
    // Aggregate query: total fees collected (storage + demurrage + detention)
    @Query("SELECT SUM(f.totalAmount) FROM PortStorageFee f WHERE f.paid = true")
    Double calculateTotalFeesCollected();
    
    // Aggregate query: total fees pending (unpaid)
    @Query("SELECT SUM(f.totalAmount) FROM PortStorageFee f WHERE f.paid = false OR f.paid IS NULL")
    Double calculateTotalFeesPending();
    
    // Get all fees for a specific month
    @Query(value = "SELECT f FROM PortStorageFee f " +
                   "WHERE YEAR(f.calculatedAt) = :year AND MONTH(f.calculatedAt) = :month")
    List<PortStorageFee> findByMonthYear(@Param("year") int year, @Param("month") int month);
}
