package com.example.userinterfaceservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.ConfigurableApplicationContext;

@EnableDiscoveryClient
@SpringBootApplication
public class UserInterfaceServiceApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(UserInterfaceServiceApplication.class, args);
        LoadApiData loadApiData = context.getBean(LoadApiData.class);
        loadApiData.loadData();
        //Demo Comment
    }

}
