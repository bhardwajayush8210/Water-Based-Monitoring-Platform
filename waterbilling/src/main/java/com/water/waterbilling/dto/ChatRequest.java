package com.water.waterbilling.dto;

import java.util.List;
import java.util.Map;

public class ChatRequest {
    private String message;
    private String currentPage;
    private List<Map<String, String>> history;

    public ChatRequest() {}

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getCurrentPage() { return currentPage; }
    public void setCurrentPage(String currentPage) { this.currentPage = currentPage; }

    public List<Map<String, String>> getHistory() { return history; }
    public void setHistory(List<Map<String, String>> history) { this.history = history; }
}