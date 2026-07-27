package com.tourtravel.sales.quotation;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.tourtravel.settings.CompanySettings;
import com.tourtravel.settings.CompanySettingsService;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.helper.W3CDom;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Renders a Quotation to PDF via Thymeleaf (HTML/CSS templating — far more
 * maintainable for a branded, restyleable proposal document than hand-coded
 * PDF drawing primitives) and openhtmltopdf (HTML/CSS -> PDF). Thymeleaf's raw
 * HTML output isn't strict XHTML, so it's parsed leniently by jsoup and
 * converted to a well-formed W3C Document before being handed to the renderer.
 */
@Service
@RequiredArgsConstructor
public class QuotationPdfService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd MMM yyyy");

    private final TemplateEngine templateEngine;
    private final CompanySettingsService companySettingsService;

    public byte[] generatePdf(Quotation quotation) {
        CompanySettings company = companySettingsService.getOrCreateSettings();

        Context context = new Context();
        context.setVariable("companyName", company.getCompanyName());
        context.setVariable("companyLogoUrl", company.getLogoUrl());
        context.setVariable("companyAddress", company.getAddress());
        context.setVariable("companyPhone", company.getPhone());
        context.setVariable("companyEmail", company.getEmail());
        context.setVariable("companyGstNumber", company.getGstNumber());
        context.setVariable("companyWebsite", company.getWebsite());

        context.setVariable("quotationNumber", quotation.getQuotationNumber());
        context.setVariable("createdAt", formatDate(quotation.getCreatedAt() != null ? quotation.getCreatedAt().toLocalDate() : null));
        context.setVariable("validUntil", formatDate(quotation.getValidUntil()));
        context.setVariable("status", quotation.getStatus().name());

        context.setVariable("customerName", quotation.getCustomer().getName());
        context.setVariable("customerPhone", quotation.getCustomer().getPhone());
        context.setVariable("customerEmail", quotation.getCustomer().getEmail());

        context.setVariable("packageTitle", quotation.getTourPackage() != null ? quotation.getTourPackage().getTitle() : null);
        context.setVariable("travelDate", formatDate(quotation.getTravelDate()));
        context.setVariable("numberOfAdults", quotation.getNumberOfAdults());
        context.setVariable("numberOfChildren", quotation.getNumberOfChildren());

        context.setVariable("items", buildItemRows(quotation));
        context.setVariable("totalAmount", formatMoney(quotation.getTotalAmount()));
        context.setVariable("discount", formatMoney(quotation.getDiscount()));
        context.setVariable("finalAmount", formatMoney(quotation.getFinalAmount()));
        context.setVariable("notes", quotation.getNotes());
        context.setVariable("termsAndConditions", resolveTerms(quotation, company));

        String html = templateEngine.process("quotation-pdf", context);
        return renderPdf(html);
    }

    private List<Map<String, String>> buildItemRows(Quotation quotation) {
        List<Map<String, String>> rows = new ArrayList<>();
        for (QuotationItem item : quotation.getItems()) {
            Map<String, String> row = new HashMap<>();
            row.put("type", item.getItemType().name());
            row.put("name", item.getItemName());
            row.put("quantity", String.valueOf(item.getQuantity()));
            row.put("unitPrice", formatMoney(item.getUnitPrice()));
            row.put("subtotal", formatMoney(item.getSubtotal()));
            rows.add(row);
        }
        return rows;
    }

    private String resolveTerms(Quotation quotation, CompanySettings company) {
        if (quotation.getTermsAndConditions() != null && !quotation.getTermsAndConditions().isBlank()) {
            return quotation.getTermsAndConditions();
        }
        return company.getDefaultTermsAndConditions();
    }

    private byte[] renderPdf(String html) {
        Document jsoupDoc = Jsoup.parse(html);
        jsoupDoc.outputSettings().syntax(Document.OutputSettings.Syntax.xml);
        org.w3c.dom.Document w3cDoc = new W3CDom().fromJsoup(jsoupDoc);

        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withW3cDocument(w3cDoc, "/");
            builder.toStream(os);
            builder.run();
            return os.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to generate quotation PDF", e);
        }
    }

    private String formatDate(java.time.LocalDate date) {
        return date != null ? date.format(DATE_FORMAT) : "";
    }

    /** Indian digit grouping (last 3, then groups of 2) — this is an India-first product. */
    private String formatMoney(BigDecimal value) {
        BigDecimal rounded = (value != null ? value : BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
        String[] parts = rounded.toPlainString().split("\\.");
        String intPart = parts[0];
        boolean negative = intPart.startsWith("-");
        if (negative) {
            intPart = intPart.substring(1);
        }
        String lastThree = intPart.length() > 3 ? intPart.substring(intPart.length() - 3) : intPart;
        String remaining = intPart.length() > 3 ? intPart.substring(0, intPart.length() - 3) : "";

        StringBuilder grouped = new StringBuilder();
        for (int i = remaining.length(); i > 0; i -= 2) {
            int start = Math.max(i - 2, 0);
            grouped.insert(0, remaining.substring(start, i) + (grouped.length() > 0 ? "," : ""));
        }

        String result = (grouped.length() > 0 ? grouped + "," : "") + lastThree + "." + parts[1];
        return "₹" + (negative ? "-" : "") + result;
    }
}
