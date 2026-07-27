package com.tourtravel.sales.quotation;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * A single line in a Quotation's Phase 2 item builder (Package/Hotel/Vehicle/Activity).
 * Deliberately generic across types rather than four separate tables — quantity
 * and unitPrice mean whatever the line represents (room-nights, vehicle-days,
 * per-person activity cost); the builder UI is where that's made concrete.
 *
 * itemName and subtotal are snapshots frozen at add-time, not live references —
 * a quotation must stay readable and stable even if the underlying catalog price
 * or name changes later. referenceId points at TourPackage/Hotel/Vehicle.id for
 * catalog-backed types; it's null for ACTIVITY, which has no catalog (see
 * docs — Activities are free-text until/unless a dedicated catalog is built).
 */
@Entity
@Table(name = "quotation_items", indexes = {
    @Index(name = "idx_quotation_item_quotation", columnList = "quotation_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class QuotationItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quotation_id", nullable = false)
    private Quotation quotation;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_type", nullable = false, length = 20)
    private ItemType itemType;

    /** TourPackage/Hotel/Vehicle id, depending on itemType. Null for ACTIVITY. */
    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "item_name", nullable = false, length = 200)
    private String itemName;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;

    @Column(length = 500)
    private String notes;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;

    public enum ItemType {
        PACKAGE, HOTEL, VEHICLE, ACTIVITY
    }
}
