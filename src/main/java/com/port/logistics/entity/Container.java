package com.port.logistics.entity;

import com.port.logistics.entity.enums.ContainerStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "containers")
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
    private VesselSchedule vesselSchedule;

    @Column(name = "arrival_date")
    private LocalDateTime arrivalDate;
}
