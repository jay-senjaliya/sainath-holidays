package com.tourtravel.sales.quotation;

import com.tourtravel.crm.customer.Customer;
import com.tourtravel.settings.CompanySettings;
import com.tourtravel.settings.CompanySettingsService;
import org.junit.jupiter.api.Test;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Plain-object test (no Spring context, no DB) — exercises the actual
 * Thymeleaf render -> jsoup -> openhtmltopdf pipeline end to end, which
 * "it compiles" doesn't verify (classpath/XHTML-strictness/font issues only
 * show up at render time).
 */
class QuotationPdfServiceTest {

    private TemplateEngine buildTemplateEngine() {
        ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
        resolver.setPrefix("templates/");
        resolver.setSuffix(".html");
        resolver.setTemplateMode(TemplateMode.HTML);
        resolver.setCharacterEncoding("UTF-8");
        TemplateEngine engine = new TemplateEngine();
        engine.setTemplateResolver(resolver);
        return engine;
    }

    private Quotation buildSampleQuotation(boolean withItems) {
        Customer customer = Customer.builder()
                .id(1L)
                .name("Test Customer")
                .phone("9876543210")
                .email("test@example.com")
                .build();

        Quotation quotation = Quotation.builder()
                .id(1L)
                .quotationNumber("QUO-000001")
                .customer(customer)
                .travelDate(LocalDate.now().plusDays(30))
                .numberOfAdults(2)
                .numberOfChildren(1)
                .totalAmount(new BigDecimal("50000.00"))
                .discount(new BigDecimal("2000.00"))
                .finalAmount(new BigDecimal("48000.00"))
                .notes("Sample notes for verification")
                .validUntil(LocalDate.now().plusDays(7))
                .status(Quotation.QuotationStatus.DRAFT)
                .createdAt(LocalDateTime.now())
                .build();

        if (withItems) {
            QuotationItem item = QuotationItem.builder()
                    .id(1L)
                    .quotation(quotation)
                    .itemType(QuotationItem.ItemType.ACTIVITY)
                    .itemName("Scuba Diving")
                    .quantity(2)
                    .unitPrice(new BigDecimal("2500.00"))
                    .subtotal(new BigDecimal("5000.00"))
                    .build();
            quotation.setItems(List.of(item));
        }

        return quotation;
    }

    @Test
    void generatesValidPdfForLegacyManualQuotation() {
        CompanySettingsService companySettingsService = mock(CompanySettingsService.class);
        when(companySettingsService.getOrCreateSettings()).thenReturn(
                CompanySettings.builder()
                        .companyName("Sainath Holidays")
                        .defaultTermsAndConditions("Standard terms apply.")
                        .build());

        QuotationPdfService pdfService = new QuotationPdfService(buildTemplateEngine(), companySettingsService);
        byte[] pdf = pdfService.generatePdf(buildSampleQuotation(false));

        assertNotNull(pdf);
        assertTrue(pdf.length > 500, "PDF should have real rendered content, not an empty/error stub");
        assertEquals("%PDF", new String(pdf, 0, 4));
    }

    @Test
    void generatesValidPdfWithLineItems() {
        CompanySettingsService companySettingsService = mock(CompanySettingsService.class);
        when(companySettingsService.getOrCreateSettings()).thenReturn(
                CompanySettings.builder().companyName("Sainath Holidays").build());

        QuotationPdfService pdfService = new QuotationPdfService(buildTemplateEngine(), companySettingsService);
        byte[] pdf = pdfService.generatePdf(buildSampleQuotation(true));

        assertNotNull(pdf);
        assertTrue(pdf.length > 500);
        assertEquals("%PDF", new String(pdf, 0, 4));
    }
}
