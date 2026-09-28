package com.water.waterbilling.dto;

import java.util.List;
import java.util.Map;

public class ChatResponse {
    private String response;
    private List<String> suggestions;
    private String navigation;
    private Map<String, Object> liveData;

    public ChatResponse() {}

    public ChatResponse(String response, List<String> suggestions, String navigation, Map<String, Object> liveData) {
        this.response = response;
        this.suggestions = suggestions;
        this.navigation = navigation;
        this.liveData = liveData;
    }

    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }

    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }

    public String getNavigation() { return navigation; }
    public void setNavigation(String navigation) { this.navigation = navigation; }

    public Map<String, Object> getLiveData() { return liveData; }
    public void setLiveData(Map<String, Object> liveData) { this.liveData = liveData; }
}