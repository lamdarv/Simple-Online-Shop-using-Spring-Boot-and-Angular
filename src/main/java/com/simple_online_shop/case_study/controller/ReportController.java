package com.simple_online_shop.case_study.controller;

import com.simple_online_shop.case_study.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/report")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<byte[]> downloadOrderReportByCustomerId(@PathVariable Integer customerId) {
        try {
            // Mencoba generate laporan
            ResponseEntity<byte[]> response = reportService.generateOrderReportByCustomerId(customerId);

            // Jika berhasil, kembalikan respons
            return response;

        } catch (Exception e) {
            // Jika ada kesalahan, log error dan kembalikan status INTERNAL_SERVER_ERROR
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<byte[]> downloadOrderReportByOrderId(@PathVariable Integer orderId) {
        try {
            ResponseEntity<byte[]> response = reportService.generateOrderReportByOrderId(orderId);
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/all-reports")
    public ResponseEntity<byte[]> downloadAllOrdersReport() {
        try {
            ResponseEntity<byte[]> response = reportService.generateAllOrdersReport();
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/test")
    public String testEndpoint() {
        return "Service is running!";
    }
}
