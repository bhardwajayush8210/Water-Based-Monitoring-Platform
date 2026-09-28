package com.water.waterbilling.service;

import com.water.waterbilling.entity.Apartment;
import com.water.waterbilling.entity.User;
import com.water.waterbilling.repository.ApartmentRepository;
import com.water.waterbilling.repository.UserRepository;
import com.water.waterbilling.dto.LoginRequest;
import com.water.waterbilling.dto.LoginResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    private final UserRepository repository;
    private final ApartmentRepository apartmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository repository,
                       ApartmentRepository apartmentRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {

        this.repository = repository;
        this.apartmentRepository = apartmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    private void assertUsernameAndEmailAvailable(User user) {
        if (repository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (repository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
    }

    public User registerResident(User user) {

        assertUsernameAndEmailAvailable(user);

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("RESIDENT");

        return repository.save(user);
    }

    /**
     * Registers a resident via a Community Admin's invite link. The
     * apartment is derived from the token server-side - whatever the
     * client sent in user.apartment (if anything) is overwritten, so a
     * tampered request can never register someone under a different
     * community than the link they actually used.
     */
    public User registerResidentViaInvite(String token, User user) {

        Apartment apartment = apartmentRepository.findByInviteToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired invite link"));

        assertUsernameAndEmailAvailable(user);

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("RESIDENT");
        user.setApartment(apartment.getApartmentName());

        return repository.save(user);
    }

    public LoginResponse login(LoginRequest request) {

        User user = repository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtService.generateToken(user.getUsername());

        return new LoginResponse(
                token,
                user.getRole(),
                user.getUsername(),
                "Login Successful",
                user.getApproved()
        );
    }


    public List<User> getAllResidents() {
        return repository.findAll()
                .stream()
                .filter(user -> "RESIDENT".equals(user.getRole()))
                .toList();
    }

    public void deleteResident(Long id) {
        repository.deleteById(id);
    }

    public com.water.waterbilling.dto.UserProfileResponse getProfile(String username) {

        User user = repository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new com.water.waterbilling.dto.UserProfileResponse(
                user.getFullName(),
                user.getUsername(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getApartment(),
                user.getFlatNumber(),
                user.getMeterNumber()
        );
    }

    public com.water.waterbilling.dto.UserProfileResponse updateProfile(
            String username, com.water.waterbilling.dto.UpdateProfileRequest request) {

        User user = repository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            user.setPhone(request.getPhone());
        }

        repository.save(user);
        return getProfile(username);
    }

    public void changePassword(String username, com.water.waterbilling.dto.ChangePasswordRequest request) {

        User user = repository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        repository.save(user);
    }

}