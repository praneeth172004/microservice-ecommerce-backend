package com.ecommerce.notification_service.service;

import com.ecommerce.notification_service.event.NotificationEvent;
import com.ecommerce.notification_service.feing.ProductClient;
import com.ecommerce.notification_service.feing.ProductResponse;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender mailSender;
    private final ProductClient productClient;
    private final TemplateEngine templateEngine;
    static  String Email="sunnypraneeth3119@gmail.com";

    // ================= SEND EMAIL =================
    public void sendEmail(String email,
                          String subject,
                          NotificationEvent event,
                          List<ProductResponse> products) {

        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject(subject);

            String htmlBody = buildEmailBody(event, products);
            helper.setText(htmlBody, true);

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Email sending failed", e);
        }
    }

    // ================= SUCCESS =================
    public void handleSuccess(NotificationEvent event) {

        List<ProductResponse> products = new ArrayList<>();

        for (NotificationEvent.Item item : event.getItems()) {
            products.add(productClient.getProductId(item.getProductId()));
        }

        sendEmail(Email,
                "Payment Successful 🎉",
                event,
                products);
    }

    // ================= FAILURE =================
    public void handleFailure(NotificationEvent event) {

        sendEmail(Email,
                "Payment Failed ❌",
                event,
                Collections.emptyList());
    }

    // ================= THYMELEAF BODY =================
    private String buildEmailBody(NotificationEvent event,
                                  List<ProductResponse> products) {

        Context context = new Context();

        context.setVariable("orderId", event.getOrderId());
        context.setVariable("email", Email);
        context.setVariable("date", LocalDate.now());
        BigDecimal price=event.getPrice();

        if (price == null) {
            price = BigDecimal.ZERO;
        }

        String formattedPrice = NumberFormat
                .getCurrencyInstance(new Locale("en", "IN"))
                .format(price);

        context.setVariable("price", formattedPrice);

        List<Map<String, Object>> items = new ArrayList<>();

        if (products != null) {
            for (int i = 0; i < products.size(); i++) {

                Map<String, Object> map = new HashMap<>();
                map.put("name", products.get(i).getProductName());
                map.put("quantity", event.getItems().get(i).getQuantity());

                items.add(map);
            }
        }

        context.setVariable("items", items);

        return templateEngine.process("payment-success", context);
    }
}