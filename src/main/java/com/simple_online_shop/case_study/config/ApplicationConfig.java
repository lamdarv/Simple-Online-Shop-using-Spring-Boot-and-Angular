package com.simple_online_shop.case_study.config;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.simple_online_shop.case_study.dto.OrderDTO;
import com.simple_online_shop.case_study.model.Order;
import org.apache.commons.codec.digest.DigestUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalTimeSerializer;
import com.toedter.spring.hateoas.jsonapi.JsonApiConfiguration;

import lib.i18n.utility.MessageUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@EnableWebSecurity
public class ApplicationConfig {

    private final MessageUtil msg;

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        // Custom mapping for Order to OrderDTO
        modelMapper.typeMap(Order.class, OrderDTO.class).addMappings(mapper -> {
            mapper.map(src -> src.getItem().getItemsId(), OrderDTO::setItemsId);
            mapper.map(src -> src.getCustomer().getCustomerId(), OrderDTO::setCustomerId);
        });

        return modelMapper;
    }

    @Bean
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(config -> config
                        .anyRequest().permitAll())
                .csrf(AbstractHttpConfigurer::disable);
        return http.build();
    }

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jsonCustomizer() {
        return builder -> {
            // Install the JavaTimeModule to handle Java 8 date-time types
            builder.modulesToInstall(new JavaTimeModule());

            // Disable the feature that writes dates as timestamps
            builder.featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

            builder.deserializers(new LocalDateDeserializer(DateTimeFormatter.ISO_LOCAL_DATE));
            builder.serializers(new LocalDateSerializer(DateTimeFormatter.ISO_DATE));

            builder.deserializers(new LocalTimeDeserializer(DateTimeFormatter.ISO_TIME));
            builder.serializers(new LocalTimeSerializer(DateTimeFormatter.ISO_TIME));

            builder.deserializers(new LocalDateTimeDeserializer(DateTimeFormatter.ISO_DATE_TIME));
            builder.serializers(new LocalDateTimeSerializer(DateTimeFormatter.ISO_DATE_TIME));
        };
    }

    @Bean
    public JsonApiConfiguration jsonApiConfiguration() {
        return new JsonApiConfiguration()
                .withObjectMapperCustomizer(
                        objectMapper -> {
                            objectMapper.findAndRegisterModules();

                            SimpleModule localDateTimeModule = new SimpleModule();

                            localDateTimeModule.addDeserializer(LocalDate.class,
                                    new LocalDateDeserializer(DateTimeFormatter.ISO_LOCAL_DATE));
                            localDateTimeModule.addSerializer(LocalDate.class,
                                    new LocalDateSerializer(DateTimeFormatter.ISO_DATE));

                            localDateTimeModule.addDeserializer(LocalTime.class,
                                    new LocalTimeDeserializer(DateTimeFormatter.ISO_TIME));
                            localDateTimeModule.addSerializer(LocalTime.class,
                                    new LocalTimeSerializer(DateTimeFormatter.ISO_TIME));

                            localDateTimeModule.addDeserializer(LocalDateTime.class,
                                    new LocalDateTimeDeserializer(DateTimeFormatter.ISO_DATE_TIME));
                            localDateTimeModule.addSerializer(LocalDateTime.class,
                                    new LocalDateTimeSerializer(DateTimeFormatter.ISO_DATE_TIME));

                            objectMapper.registerModule(localDateTimeModule);
                        });
    }



}
