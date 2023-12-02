import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProductDetailsPage implements OnInit {
  
  public id!: string;
  
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    console.log(this.id);
  }

}
