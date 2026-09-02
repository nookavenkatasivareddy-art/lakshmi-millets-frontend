import { Injectable } from '@angular/core';
import { Product, CartItem } from '../models/models';

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  private readonly phoneNumber = '918897626612';

  sendSingleProductOrder(product: Product, quantity: number): void {
    let message = `New Order:\n\n`;
    message += `${product.name} x${quantity} - ₹${product.price * quantity}\n\n`;
    message += `Total: ₹${product.price * quantity}`;
    this.openWhatsApp(message);
  }

  sendCartOrder(items: CartItem[]): void {
    let message = `New Order:\n\n`;
    let total = 0;
    items.forEach((item, index) => {
      const lineTotal = item.price * item.quantity;
      total += lineTotal;
      message += `${index + 1}. ${item.name} x${item.quantity} - ₹${lineTotal}\n`;
    });
    message += `\nTotal: ₹${total}`;
    this.openWhatsApp(message);
  }

  private openWhatsApp(message: string): void {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  }
}