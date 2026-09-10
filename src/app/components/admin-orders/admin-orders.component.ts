import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  errorMsg = '';
  updatingId = '';

  statuses = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'CLOSED'];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: o => { this.orders = o || []; this.loading = false; },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Failed to load orders (admin only)';
      }
    });
  }

  orderLabel(order: any): string {
    const raw = String(order?.id || order?._id || '');
    return raw ? raw.slice(-8).toUpperCase() : raw;
  }

  customerName(order: any): string {
    return order?.userId?.name || order?.shippingAddress?.fullName || 'Customer';
  }

  setStatus(order: any, orderStatus: string) {
    const id = order?.id || order?._id;
    if (!id) return;
    this.updatingId = id;
    this.orderService.updateOrderStatus(id, orderStatus).subscribe({
      next: (updated) => {
        this.updatingId = '';
        const idx = this.orders.findIndex(o => (o.id || o._id) === id);
        if (idx >= 0) this.orders[idx] = updated;
      },
      error: (err) => {
        this.updatingId = '';
        this.errorMsg = err.error?.message || 'Failed to update status';
      }
    });
  }

  openCustomerWhatsApp(order: any) {
    const phone = String(order?.shippingAddress?.phone || '').replace(/\D/g, '');
    if (!phone) return;
    const msg = `Hi ${this.customerName(order)}, this is Lakshmi Millets. Your order ${this.orderLabel(order)} is now ${order.orderStatus}.`;
    window.open(`https://wa.me/91${phone.slice(-10)}?text=${encodeURIComponent(msg)}`, '_blank');
  }
}
