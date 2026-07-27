package com.tourtravel.sales.quotation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * No WhatsApp Business API involved — waLink is a wa.me deep link the admin's
 * browser opens, pre-filled with a message + shareUrl; the admin still has to
 * hit send themselves. See QuotationShareController for what shareUrl serves.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WhatsAppLinkResponse {

    private String waLink;
    private String shareUrl;
}
