package com.port.logistics.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.port.logistics.entity.enums.ContainerStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "containers")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Container {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Standard ISO 6346 format: 4 letters, 6 digits, 1 check digit
    @NotBlank
    @Pattern(regexp = "^[A-Z]{4}\\d{7}$", message = "Invalid container format")
    @Column(name = "container_number", unique = true, nullable = false)
    private String containerNumber;

    // E.g., 20ft, 40ft
    @Column(nullable = false)
    private String size;

    @Column(nullable = false)
    @Min(value = 1000, message = "Weight must be at least 1000 kg")
    @Max(value = 35000, message = "Weight exceeds maximum allowed limit")
    private Double weight;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContainerStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vessel_schedule_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private VesselSchedule vesselSchedule;

    @Column(name = "arrival_date")
    private LocalDateTime arrivalDate;
}
