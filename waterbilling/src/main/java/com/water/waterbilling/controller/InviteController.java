package com.water.waterbilling.controller;

import com.water.waterbilling.entity.Apartment;
import com.water.waterbilling.entity.User;
import com.water.waterbilling.service.CommunityAdminService;
import com.water.waterbilling.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Public endpoints for the resident-facing invite link flow. A Community
 * Admin shares a link containing their apartment's invite token; a
 * resident visiting that link registers directly under that community,
 * with no apartment selection required.
 */
@RestController
@RequestMapping("/api/invite")
@CrossOrigin(origins = "http://localhost:5173")
public class InviteController {

    private final CommunityAdminService communityAdminService;
    private final UserService userService;

    public InviteController(CommunityAdminService communityAdminService, UserService userService) {
        this.communityAdminService = communityAdminService;
        this.userService = userService;
    }

    /**
     * Confirms the invite token is valid and returns the apartment the
     * resident is about to join, so the registration page can display
     * "You're joining [Apartment Name]" before they fill anything in.
     */
    @GetMapping("/{token}")
    public ResponseEntity<?> getApartmentForInvite(@PathVariable String token) {
        Apartment apartment = communityAdminService.getApartmentByInviteToken(token);
        return ResponseEntity.ok(
                Map.of(
                        "apartmentName", apartment.getApartmentName(),
                        "city", apartment.getCity() != null ? apartment.getCity() : ""
                )
        );
    }

    /**
     * Registers a resident via the invite link. The apartment is derived
     * server-side from the token - anything the client sends in the
     * request body's apartment field is ignored, preventing tampering.
     */
    @PostMapping("/{token}/register")
    public ResponseEntity<?> registerViaInvite(@PathVariable String token, @RequestBody User user) {
        User savedUser = userService.registerResidentViaInvite(token, user);
        return ResponseEntity.ok(savedUser);
    }

}