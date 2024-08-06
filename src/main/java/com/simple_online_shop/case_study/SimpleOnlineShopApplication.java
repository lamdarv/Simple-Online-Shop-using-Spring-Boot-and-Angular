package com.simple_online_shop.case_study;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.simple_online_shop", "lib.minio", "lib.i18n.utility"})
public class SimpleOnlineShopApplication {

	public static void main(String[] args) {
		SpringApplication.run(SimpleOnlineShopApplication.class, args);
	}
}
