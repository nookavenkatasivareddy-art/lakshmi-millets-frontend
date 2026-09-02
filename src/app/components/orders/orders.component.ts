import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe({
      next: o => { this.orders = o; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
