package com.water.waterbilling.controller;

import com.water.waterbilling.dto.ChatRequest;
import com.water.waterbilling.dto.ChatResponse;
import com.water.waterbilling.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    private final ChatService chatService;

    public AIController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(
            @RequestBody ChatRequest request,
            Authentication authentication
    ) {
        String username = authentication != null ? authentication.getName() : "ANONYMOUS";
        ChatResponse response = chatService.chat(request, username);
        return ResponseEntity.ok(response);
    }
}