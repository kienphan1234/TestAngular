import { Component, HostListener } from '@angular/core';
import { BaseSku, catalogue, Option, OptionValue, ProductData } from '../../core/models/catalogue';
import { CatalogueService } from '../../core/services/catalogue.service';
import { CommonModule } from '@angular/common';
import { UniqueLocationPipe } from "../../core/pipe/unique-location.pipe";
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, UniqueLocationPipe,FormsModule,TableModule],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.css'
})
export class CatalogueComponent {
  productData: ProductData | undefined;
  sizeOptions: any[] = [];
  sizeOptions1: any[] = [];
  filteredList: any[] = [];
  selectedColor: string[] = [];
  selectedSize: string[] = [];
  selectedOption: string | null = null;
  isSelectOpen = false;
  showBaseCost: boolean = true;
  showSecondPrice: boolean = true;
  showname: boolean = true;
  showsize: boolean = true;
  showcolor: boolean = true;
  showsku: boolean = true;
  showship: boolean = true;
  dropdownOpen: boolean = false;
  dropdownOpen1: boolean = false; 
  dropdownOpen2: boolean = false;
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
    if (this.selectedColor && this.selectedColor.length  != 0) {
      this.filteredList = this.filteredList.filter(item => this.selectedColor.includes(item.color_id.toString()));
    } else {
      this.filteredList = this.productData?.base_sku ?? [];
    }
  }
  
  filterBySize(): void {
    if (this.selectedSize && this.selectedSize.length != 0) {
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
    this.selectedSize = []; 
    this.filteredList = this.productData?.base_sku ?? [];
    this.filterByColor();
  }
  
  filterBySizeOnly(): void {
    this.selectedColor = []; 
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
 
 toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    }
    toggleDropdown1() {
      this.dropdownOpen1 = !this.dropdownOpen1;
    }
    toggleDropdown2() {
      this.dropdownOpen2 = !this.dropdownOpen2;
    }
onCheckboxChange(event: Event, size: string) {
  const checkbox = event.target as HTMLInputElement;
  if (checkbox.checked) {
    this.selectedSize.push(size); 
  } else {
    this.selectedSize = this.selectedSize.filter(item => item !== size); 
  }
  this.onCategoryChange();
}
onCheckboxChange2(event: Event, color: string) {
  const checkbox = event.target as HTMLInputElement;
  if (checkbox.checked) { 
    this.selectedColor.push(color);
  } else {; 
    this.selectedColor = this.selectedColor.filter(item => item !== color); 
  }
  this.onCategoryChange();
}


  }

