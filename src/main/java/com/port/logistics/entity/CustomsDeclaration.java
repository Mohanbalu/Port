package com.port.logistics.entity;

import com.port.logistics.entity.enums.CustomsStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Min;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customs_declarations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomsDeclaration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "container_id", nullable = false)
    private Container container;

    // HS Code (Harmonized System Code) for goods type mapping
    @NotBlank
    @Pattern(regexp = "^\\d{6}$", message = "HS code must be exactly 6 digits")
    @Column(name = "hs_code", nullable = false)
    private String hsCode;

    @Min(value = 1, message = "Declared value must be greater than 0")
    @Column(name = "declared_value", nullable = false)
    private Double declaredValue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CustomsStatus status;

    @Column(name = "declaration_date")
    private LocalDateTime declarationDate;

    // Officer who reviewed it
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    private String remarks;

    @PrePersist
    protected void onCreate() {
        if (declarationDate == null) {
            declarationDate = LocalDateTime.now();
        }
    }
}
