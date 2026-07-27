package com.tourtravel.sales.quotation;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

/**
 * Public, unauthenticated PDF access via an unguessable share token — backs the
 * "Share via WhatsApp" wa.me link (see QuotationService.generateWhatsAppLink),
 * since a customer clicking that link has no admin login. Registered in
 * AppConstants.AUTH_WHITELIST. Deliberately separate from the admin-protected
 * QuotationController — this one path is intentionally public, everything else
 * in the Quotation module is not.
 */
@RestController
@RequestMapping("/api/v1/quotations/shared")
@RequiredArgsConstructor
@Tag(name = "Public - Quotation Share", description = "Unauthenticated, token-gated quotation PDF access")
public class QuotationShareController {

    private final QuotationService quotationService;

    @GetMapping("/{token}/pdf")
    @Operation(summary = "View/download a quotation PDF via its public share token (no login required)")
    public ResponseEntity<byte[]> getSharedPdf(@PathVariable String token) {
        byte[] pdf = quotationService.generatePdfForShareToken(token);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.inline().filename("quotation.pdf").build().toString())
                .body(pdf);
    }
}
