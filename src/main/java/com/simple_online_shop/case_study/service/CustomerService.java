package com.simple_online_shop.case_study.service;

import com.simple_online_shop.case_study.dto.CustomerDTO;
import com.simple_online_shop.case_study.exception.CustomerDeletionException;
import com.simple_online_shop.case_study.exception.ResourceNotFoundException;
import com.simple_online_shop.case_study.model.Customer;
import com.simple_online_shop.case_study.repository.CustomerRepository;
import com.simple_online_shop.case_study.repository.OrderRepository;
import io.minio.ObjectWriteResponse;
import lib.minio.MinioSrvc;
import lib.minio.configuration.property.MinioProp;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final ModelMapper modelMapper;
    private final MinioSrvc minioSrvc;

    @Transactional
    public CustomerDTO createCustomer(MultipartFile file, String customerName, String customerAddress, String customerCode,
                                      String customerPhone, Boolean isActive, String lastOrderDate) {
        CustomerDTO customerDTO = buildCustomerDTO(customerName, customerAddress, customerCode, customerPhone, isActive, lastOrderDate);
        return saveCustomer(null, customerDTO, file);
    }

    @Transactional
    public CustomerDTO updateCustomer(Integer customerId, MultipartFile file, String customerName, String customerAddress, String customerCode,
                                      String customerPhone, Boolean isActive, String lastOrderDate) {
        CustomerDTO customerDTO = buildCustomerDTO(customerName, customerAddress, customerCode, customerPhone, isActive, lastOrderDate);
        return saveCustomer(customerId, customerDTO, file);
    }

    @Transactional
    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(customer -> modelMapper.map(customer, CustomerDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public CustomerDTO getCustomerById(Integer customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + customerId));
        return modelMapper.map(customer, CustomerDTO.class);
    }

    @Transactional
    public void deleteCustomer(Integer customerId) throws CustomerDeletionException {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + customerId));

        try {
            // Delete orders related to the customer
            orderRepository.deleteByCustomer(customer);

            // Delete the customer
            customerRepository.deleteById(customerId);
        } catch (Exception e) {
            throw new CustomerDeletionException("Failed to delete customer with id " + customerId, e);
        }
    }

    @Transactional
    private CustomerDTO saveCustomer(Integer customerId, CustomerDTO customerDTO, MultipartFile file) {
        Customer customer = (customerId != null) ? findCustomerById(customerId) : new Customer();
        updateCustomerEntity(customer, customerDTO);

        if (file != null && !file.isEmpty()) {
            validateFileExtension(file);
            String imageFilename = constructFileName(customer.getCustomerName(), file.getOriginalFilename());
            minioSrvc.upload(file, "simple-online-shop", o -> MinioSrvc.UploadOption.builder().filename(imageFilename).build());
            customer.setPic(imageFilename);
        }

        Customer updatedCustomer = customerRepository.save(customer);
        return modelMapper.map(updatedCustomer, CustomerDTO.class);
    }

    private Customer findCustomerById(Integer customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + customerId));
    }

    private void updateCustomerEntity(Customer customer, CustomerDTO customerDTO) {
        if (customerDTO.getCustomerName() != null) customer.setCustomerName(customerDTO.getCustomerName());
        if (customerDTO.getCustomerAddress() != null) customer.setCustomerAddress(customerDTO.getCustomerAddress());
        if (customerDTO.getCustomerCode() != null) customer.setCustomerCode(customerDTO.getCustomerCode());
        if (customerDTO.getCustomerPhone() != null) customer.setCustomerPhone(customerDTO.getCustomerPhone());
        if (customerDTO.getIsActive() != null) customer.setIsActive(customerDTO.getIsActive());
        if (customerDTO.getLastOrderDate() != null) customer.setLastOrderDate(customerDTO.getLastOrderDate());
    }

    private CustomerDTO buildCustomerDTO(String customerName, String customerAddress, String customerCode, String customerPhone, Boolean isActive, String lastOrderDate) {
        CustomerDTO customerDTO = new CustomerDTO();
        customerDTO.setCustomerName(customerName);
        customerDTO.setCustomerAddress(customerAddress);
        customerDTO.setCustomerCode(customerCode);
        customerDTO.setCustomerPhone(customerPhone);
        customerDTO.setIsActive(isActive);
        if (lastOrderDate != null) {
            customerDTO.setLastOrderDate(LocalDateTime.parse(lastOrderDate));
        }
        return customerDTO;
    }

    private String constructFileName(String customerName, String originalFilename) {
        String timeStamp = DateTimeFormatter.ofPattern("yyyyMMddHHmmss").format(LocalDateTime.now());
        String baseName = customerName.replaceAll("\\s+", "_") + "_" + timeStamp;
        return baseName + "." + getExtension(originalFilename);
    }

    private void validateFileExtension(MultipartFile file) {
        String filename = file.getOriginalFilename();
        if (filename == null || !isValidPhotoExtension(filename)) {
            throw new IllegalArgumentException("Invalid photo file extension");
        }
    }

    private boolean isValidPhotoExtension(String filename) {
        String extension = getExtension(filename).toLowerCase();
        return extension.equals("jpg") || extension.equals("jpeg") || extension.equals("png");
    }

    private String getExtension(String originalFilename) {
        int lastIndex = originalFilename.lastIndexOf('.');
        if (lastIndex == -1) {
            return "";
        }
        return originalFilename.substring(lastIndex + 1);
    }
}
