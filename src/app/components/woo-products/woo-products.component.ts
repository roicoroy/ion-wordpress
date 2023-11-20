import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-woo-products',
  templateUrl: './woo-products.component.html',
  styleUrls: ['./woo-products.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ]
})
export class WooProductsComponent implements OnInit, AfterViewInit {

  @Input() title!: string;

  @Input() subtitle!: string;

  @Input() products: any;

  @Output() onClick = new EventEmitter<Event>();

  @Output() onPinTask = new EventEmitter<Event>();

  constructor(
    private store: Store,
  ) { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    console.log(this.products);
  }

  onPin(product: any) {
    this.onPinTask.emit(product);
  }
}
