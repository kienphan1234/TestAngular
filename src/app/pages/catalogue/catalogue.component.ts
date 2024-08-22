import { Component } from '@angular/core';
import { BaseSku, catalogue, ProductData } from '../../core/models/catalogue';
import { CatalogueService } from '../../core/services/catalogue.service';
import { CommonModule } from '@angular/common';
import { UniqueLocationPipe } from "../../core/pipe/unique-location.pipe";

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, UniqueLocationPipe],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.css'
})
export class CatalogueComponent {
  productData: ProductData | undefined;
;

  constructor(private productService: CatalogueService) { }

  ngOnInit(): void {
    this.loadProductData();
  }

  loadProductData(): void {
    this.productService.getProductData().subscribe({
      next: (response: catalogue) => {
        this.productData = response.data;
        
      }
    });
  }

}
