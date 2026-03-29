package com.serviceconnect.backend.payloads.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

public class MessageResponse {
  private String message;

  public MessageResponse(String message) {
    this.message = message;
  }

  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }
}
