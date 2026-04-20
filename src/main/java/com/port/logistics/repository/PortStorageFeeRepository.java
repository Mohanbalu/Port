package com.port.logistics.repository;

import com.port.logistics.entity.PortStorageFee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PortStorageFeeRepository extends JpaRepository<PortStorageFee, Long> {
    Optional<PortStorageFee> findByContainerId(Long containerId);

    // Aggregate query: total demurrage per month
    @Query(value = "SELECT SUM(demurrage_fee) FROM port_storage_fees " +
                   "WHERE YEAR(calculated_at) = :year AND MONTH(calculated_at) = :month", 
           nativeQuery = true)
    Double calculateTotalDemurragePerMonth(@Param("year") int year, @Param("month") int month);
}
