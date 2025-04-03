package org.petrinet.service.model;

public class Place {
    private String id;
    private int tokens;
    private boolean bounded = false;
    private Integer capacity = null;

    public Place(String id, int tokens) {
        this.id = id;
        this.tokens = tokens;
    }

    public Place() {}

    public Place(String id, int tokens, boolean bounded, Integer capacity) {
        this.id = id;
        this.tokens = tokens;
        this.bounded = bounded;
        this.capacity = bounded ? capacity : null;
        if (this.bounded && this.capacity == null) {
            this.capacity = 0;
        }
        if (this.bounded && this.capacity != null && this.capacity < 0) {
            this.capacity = 0;
        }
        if (this.bounded && this.capacity != null && this.tokens > this.capacity) {
            this.tokens = this.capacity;
        }
    }

    //Getters and Setters

    public String getId() {
        return id;
    }

    public int getTokens() {
        return tokens;
    }

    public void setTokens(int tokens) {
        this.tokens = Math.max(0, tokens); // Ensure tokens can't be negative
    }

    public boolean isBounded() {
        System.out.println("DEBUG Place " + this.id + ": isBounded() called, returning " + this.bounded);
        return bounded;
    }

    public void setBounded(boolean bounded) {
        this.bounded = bounded;
        if (!bounded) {
            this.capacity = null;
        }
    }

    public Integer getCapacity() {
        System.out.println("DEBUG Place " + this.id + ": getCapacity() called, returning " + this.capacity);
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        if (this.bounded) {
            this.capacity = (capacity != null && capacity >= 0) ? capacity : 0;
            if (this.tokens > this.capacity) {
                this.tokens = this.capacity;
            }
        } else {
            this.capacity = null;
        }
    }

    public void addToken() {
        if (!this.bounded || this.capacity == null || this.tokens < this.capacity) {
            this.tokens++;
        }
    }

    public void removeTokens() {
        System.out.println("DEBUG Place " + this.id + ": removeTokens() called. Current tokens: " + this.tokens);
        if (this.tokens > 0) {
            this.tokens--;
            System.out.println("    -> Decremented tokens. New tokens: " + this.tokens);
        } else {
            System.out.println("    -> Tokens already 0. No change.");
        }
    }
}
