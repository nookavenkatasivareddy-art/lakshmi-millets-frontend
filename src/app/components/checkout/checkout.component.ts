import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { DeliveryService } from '../../core/services/delivery.service';
import { OrderService } from '../../core/services/order.service';
import { PaymentService } from '../../core/services/payment.service';
import { DeliveryLocation } from '../../core/models/models';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  addressForm: FormGroup;
  locations: DeliveryLocation[] = [];
  selectedLocationId = '';
  paymentMethod: 'COD' | 'CARD' | 'UPI' | 'NETBANKING' = 'COD';
  placing = false;
  errorMsg = '';

  selectedUpiApp = '';
  showPaymentLinkModal = false;

  upiApps = [
    { id: 'paytm', name: 'Paytm', short: 'P', color: '#00baf2' },
    { id: 'amazonpay', name: 'Amazon Pay', short: 'a', color: '#232f3e' },
    { id: 'bhim', name: 'BHIM App', short: 'B', color: '#ee6723' },
    { id: 'cred', name: 'CRED UPI', short: 'C', color: '#0b0b0b' },
    { id: 'kiwi', name: 'Kiwi UPI', short: 'K', color: '#6fce44' },
    { id: 'other', name: 'Other UPI Apps', short: '➤', color: '#f0a500' },
    { id: 'supermoney', name: 'Super Money', short: 'S', color: '#4d3df7' },
    { id: 'airtel', name: 'Airtel Payments Bank UPI', short: 'A', color: '#e40000' },
    { id: 'pop', name: 'POP UPI', short: 'pop', color: '#111111' },
    { id: 'navi', name: 'Navi UPI', short: 'n', color: '#3c1f8b' },
    { id: 'fampay', name: 'FamPay UPI', short: 'F', color: '#ff8a00' }
  ];

  constructor(
    private fb: FormBuilder,
    private cart: CartService,
    private deliveryService: DeliveryService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private router: Router
  ) {
    this.addressForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      line1: ['', Validators.required],
      line2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
    });
  }

  ngOnInit(): void {
    if (this.cart.items.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }
    this.deliveryService.getLocations().subscribe({
      next: locs => {
        this.locations = locs;
        if (locs.length) this.selectedLocationId = locs[0].id;
      }
    });
  }

  get itemsTotal(): number {
    return this.cart.itemsTotal;
  }

  get selectedLocation(): DeliveryLocation | undefined {
    return this.locations.find(l => l.id === this.selectedLocationId);
  }

  get deliveryCharge(): number {
    const loc = this.selectedLocation;
    if (!loc) return 0;
    return this.itemsTotal >= loc.freeDeliveryAbove ? 0 : loc.deliveryCharge;
  }

  get grandTotal(): number {
    return this.itemsTotal + this.deliveryCharge;
  }

  selectUpiApp(id: string) {
    this.selectedUpiApp = id;
  }

  openPaymentLinkModal() {
    this.showPaymentLinkModal = true;
  }

  closePaymentLinkModal() {
    this.showPaymentLinkModal = false;
  }

  sharePaymentLink() {
    const upiId = '8897626612@sbi';
    const payeeName = 'Lakshmi Millets';
    const transactionNote = `Lakshmi Millets order payment`;
    const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${this.grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
    const message = `Lakshmi Millets payment link for ₹${this.grandTotal}: ${upiLink}`;
    const whatsappUrl = `https://wa.me/918897626612?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank', 'noopener');
    this.closePaymentLinkModal();
  }
}
