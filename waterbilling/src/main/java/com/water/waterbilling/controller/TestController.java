
package com.water.waterbilling.controller;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/encode")
    public String encode() {
        return new BCryptPasswordEncoder().encode("admin1234");
    }

}