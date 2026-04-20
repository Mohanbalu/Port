package com.port.logistics.repository;

import com.port.logistics.entity.Container;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContainerRepository extends JpaRepository<Container, Long> {
    Optional<Container> findByContainerNumber(String containerNumber);

    // JOIN query: container + booking + customs + movement logs
    @Query("SELECT DISTINCT c FROM Container c " +
           "LEFT JOIN FETCH Booking b ON b.container = c " +
           "LEFT JOIN FETCH CustomsDeclaration cd ON cd.container = c " +
           "LEFT JOIN FETCH MovementLog ml ON ml.container = c " +
           "WHERE c.id = :id")
    Optional<Container> findContainerWithFullHistory(@Param("id") Long id);

    // Aggregate query: total containers per vessel
    @Query("SELECT v.name, COUNT(c) FROM Container c " +
           "JOIN c.vesselSchedule vs " +
           "JOIN vs.vessel v " +
           "GROUP BY v.name")
    List<Object[]> countContainersPerVessel();
}
