package com.serviceconnect.backend.payloads.request;

import lombok.Data;

@Data
public class PaymentRequest {
  private String paymentMethod;
  private Boolean usePoints;

  public String getPaymentMethod() { return paymentMethod; }
  public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
  public Boolean getUsePoints() { return usePoints; }
  public void setUsePoints(Boolean usePoints) { this.usePoints = usePoints; }
}
