package com.port.logistics.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "port_storage_fees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PortStorageFee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "container_id", nullable = false)
    private Container container;

    @Column(name = "days_stored", nullable = false)
    private Integer daysStored;

    @Column(name = "storage_fee", nullable = false)
    private Double storageFee;

    @Column(name = "demurrage_fee", nullable = false)
    private Double demurrageFee;

    @Column(name = "detention_fee", nullable = false)
    private Double detentionFee;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "calculated_at", nullable = false)
    private LocalDateTime calculatedAt;

    private Boolean paid;

    @PrePersist
    protected void onCreate() {
        if (calculatedAt == null) {
            calculatedAt = LocalDateTime.now();
        }
        if (paid == null) {
            paid = false;
        }
    }
}
