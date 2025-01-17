package com.simple_online_shop.case_study.service;

import com.simple_online_shop.case_study.model.Order;
import com.simple_online_shop.case_study.repository.OrderRepository;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.*;

@Service
public class ReportService {

    @Autowired
    private OrderRepository orderRepository;

    // Metode untuk generate report berdasarkan customerId
    public ResponseEntity<byte[]> generateOrderReportByCustomerId(Integer customerId) {
        List<Order> orders = orderRepository.findByCustomerCustomerId(customerId);

        if (orders.isEmpty()) {
            HttpHeaders headers = new HttpHeaders();
            headers.add("Error-Message", "Customer has no orders.");
            return new ResponseEntity<>(null, headers, HttpStatus.NOT_FOUND);
        }

        return generateReport(orders, "CustomerOrderSummary_" + customerId + ".pdf", "reports/SimpleOnlineShop.jrxml");
    }


    // Metode untuk generate report berdasarkan orderId
    public ResponseEntity<byte[]> generateOrderReportByOrderId(Integer orderId) {
        Optional<Order> order = orderRepository.findById(orderId);

        if (!order.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return generateReport(Collections.singletonList(order.get()), "OrderSummary_" + orderId + ".pdf", "reports/SimpleOnlineShop.jrxml");
    }

    // Metode untuk generate report semua order
    public ResponseEntity<byte[]> generateAllOrdersReport() {
        List<Order> orders = orderRepository.findAll();

        if (orders.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return generateReport(orders, "AllOrdersSummary.pdf", "reports/SimpleOnlineShop.jrxml");
    }

    // Metode untuk generate report berdasarkan pagination
    public ResponseEntity<byte[]> generateAllOrdersReportByPagination(int pageIndex, int pageSize) {
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<Order> page = orderRepository.findAll(pageable);

        if (!page.hasContent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return generateReport(page.getContent(), "OrdersSummary.pdf", "reports/SimpleOnlineShopList.jrxml");
    }

    // Combined helper method for generating reports
    private ResponseEntity<byte[]> generateReport(List<Order> orders, String fileName, String reportTemplatePath) {
        try (InputStream reportStream = new ClassPathResource(reportTemplatePath).getInputStream()) {
            JasperReport jasperReport = JasperCompileManager.compileReport(reportStream);
            JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(orders);
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("ReportTitle", "Order Summary Report");

            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);
            byte[] pdfReport = JasperExportManager.exportReportToPdf(jasperPrint);

            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);
            headers.set(HttpHeaders.CONTENT_TYPE, "application/pdf");

            return new ResponseEntity<>(pdfReport, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}



