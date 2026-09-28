package com.water.waterbilling.controller;

import com.water.waterbilling.entity.User;
import com.water.waterbilling.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.water.waterbilling.dto.LoginRequest;
import com.water.waterbilling.dto.LoginResponse;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        User savedUser = userService.registerResident(user);

        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

//        System.out.println("Login API Hit");
        return ResponseEntity.ok(userService.login(request));

    }

    @GetMapping("/residents")
    public ResponseEntity<?> getResidents() {
        return ResponseEntity.ok(userService.getAllResidents());
    }

    @DeleteMapping("/residents/{id}")
    public ResponseEntity<?> deleteResident(@PathVariable Long id) {

        userService.deleteResident(id);

        return ResponseEntity.ok("Resident Deleted Successfully");
    }
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(userService.getProfile(authentication.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(
            @RequestBody com.water.waterbilling.dto.UpdateProfileRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(userService.updateProfile(authentication.getName(), request));
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody com.water.waterbilling.dto.ChangePasswordRequest request,
            Authentication authentication) {
        try {
            userService.changePassword(authentication.getName(), request);
            return ResponseEntity.ok("Password changed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}