import { Component, HostListener } from '@angular/core';
import { BaseSku, catalogue, Option, OptionValue, ProductData } from '../../core/models/catalogue';
import { CatalogueService } from '../../core/services/catalogue.service';
import { CommonModule } from '@angular/common';
import { UniqueLocationPipe } from "../../core/pipe/unique-location.pipe";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, UniqueLocationPipe,FormsModule],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.css'
})
export class CatalogueComponent {
  productData: ProductData | undefined;
  sizeOptions: any[] = [];
  sizeOptions1: any[] = [];
  filteredList: any[] = [];
  selectedColor: string[] = ['ALL'];
  selectedSize: string[] = ['ALL'];
  selectedOption: string | null = null;
  isSelectOpen = false;
  constructor(private productService: CatalogueService) { }

  ngOnInit(): void {
    this.loadProductData();
  }

  loadProductData(): void {
    this.productService.getProductData().subscribe({
      next: (response: catalogue) => {
        this.productData = response.data; 
        this.sizeOptions = this.productData?.options.filter(option => option.name === 'size');
        this.sizeOptions1 = this.productData?.options.filter(option => option.name === 'color');
        this.filteredList = this.productData?.base_sku ?? [];
        this.filterList();
      }
    });
  }
  
  filterByColor(): void {
    if (this.selectedColor && !this.selectedColor.includes('ALL')) {
      this.filteredList = this.filteredList.filter(item => this.selectedColor.includes(item.color_id.toString()));
    } else {
      this.filteredList = this.productData?.base_sku ?? [];
    }
  }
  
  filterBySize(): void {
    if (this.selectedSize && !this.selectedSize.includes('ALL')) {
      this.filteredList = this.filteredList.filter(item => this.selectedSize.includes(item.size_id.toString()));
    }
  }

  filterByfacility(): void {
    if (this.selectedOption) {
      this.filteredList = this.filteredList.filter(item => item.location_name === this.selectedOption);
    }
  }

  filterByfacilityOnly(): void {
    this.selectedOption = null;
    this.filterByfacility()
  }
  filterByColorOnly(): void {
    this.selectedSize = ['ALL']; 
    this.filteredList = this.productData?.base_sku ?? [];
    this.filterByColor();
  }
  
  filterBySizeOnly(): void {
    this.selectedColor = ['ALL']; 
    this.filteredList = this.productData?.base_sku ?? [];
    this.filterBySize();
  }

  filterList(): void {
    this.filteredList = this.productData?.base_sku ?? [];
    this.filterByColor();
    this.filterBySize();  
    this.filterByfacility() 
  }

  onCategoryChange(): void {
    this.filterList();
  }


  toggleSelect() {
    this.isSelectOpen = !this.isSelectOpen;
  }

  selectOption(sku: any) {
    this.selectedOption = sku ? sku.location_name : null;
    const selectItems = document.querySelector('.select-items');
    if (selectItems) {
      selectItems.classList.add('select-hide');
    }else{
      this.isSelectOpen = false; 
    }
    this.filterList();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const selectElement = document.querySelector('.custom-select');
    if (selectElement && !selectElement.contains(event.target as Node)) {
      this.isSelectOpen = false;
    }
  }
}
