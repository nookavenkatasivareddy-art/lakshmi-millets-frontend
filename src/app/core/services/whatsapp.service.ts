import { Injectable } from '@angular/core';
import { Product, CartItem } from '../models/models';

export interface CheckoutOrderDetails {
  orderId: string;
  items: CartItem[];
  itemsTotal: number;
  deliveryCharge: number;
  grandTotal: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
}

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  // Store admin number: already given for this project (8897626612, India +91).
  private readonly phoneNumber = '918897626612';

  sendSingleProductOrder(product: Product, quantity: number): void {
    let message = `New Order:\n\n`;
    message += `${product.name} x${quantity} - \u20B9${product.price * quantity}\n\n`;
    message += `Total: \u20B9${product.price * quantity}`;
    this.openWhatsApp(message);
  }

  sendCartOrder(items: CartItem[]): void {
    let message = `New Order:\n\n`;
    let total = 0;
    items.forEach((item, index) => {
      const lineTotal = item.price * item.quantity;
      total += lineTotal;
      message += `${index + 1}. ${item.name} x${item.quantity} - \u20B9${lineTotal}\n`;
    });
    message += `\nTotal: \u20B9${total}`;
    this.openWhatsApp(message);
  }

  /** Full order notification sent to admin right after a successful checkout. */
  sendCheckoutOrder(details: CheckoutOrderDetails): void {
    const a = details.shippingAddress;
    let message = `*New Order - Lakshmi Millets*\n`;
    if (details.orderId) message += `Order ID: ${details.orderId}\n`;
    message += `Payment: ${details.paymentMethod}\n`;
    message += `--------------------------\n`;
    details.items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} x${item.quantity} - \u20B9${item.price * item.quantity}\n`;
    });
    message += `--------------------------\n`;
    message += `Items Total: \u20B9${details.itemsTotal}\n`;
    message += `Delivery: \u20B9${details.deliveryCharge}\n`;
    message += `Grand Total: \u20B9${details.grandTotal}\n`;
    message += `--------------------------\n`;
    message += `Ship to: ${a.fullName}, ${a.line1}${a.line2 ? ', ' + a.line2 : ''}, ${a.city}, ${a.state} - ${a.pincode}\n`;
    message += `Phone: ${a.phone}`;
    this.openWhatsApp(message);
  }

  private openWhatsApp(message: string): void {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  }
}
