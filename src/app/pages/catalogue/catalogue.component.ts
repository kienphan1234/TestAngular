import { Component, HostListener } from '@angular/core';
import {
  BaseSku,
  catalogue,
  Option,
  OptionValue,
  ProductData,
} from '../../core/models/catalogue';
import { CatalogueService } from '../../core/services/catalogue.service';
import { CommonModule } from '@angular/common';
import { UniqueLocationPipe } from '../../core/pipe/unique-location.pipe';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, UniqueLocationPipe, FormsModule, TableModule],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.css',
})
export class CatalogueComponent {
  productData: ProductData | undefined;
  sizeOptions: any[] = [];
  sizeOptions1: any[] = [];
  filteredList: any[] = [];
  selectedColor: string[] = [];
  selectedSize: string[] = [];
  selectedOptionkk: string[] = [];
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
  dropdownOpen3: boolean = false;
  searchTerm: string = '';
  constructor(private productService: CatalogueService) {}

  ngOnInit(): void {
    this.loadProductData();
  }

  loadProductData(): void {
    this.productService.getProductData().subscribe({
      next: (response: catalogue) => {
        this.productData = response.data;
        this.sizeOptions = this.productData?.options.filter(
          (option) => option.name === 'size'
        );
        this.sizeOptions1 = this.productData?.options.filter(
          (option) => option.name === 'color'
        );
        this.filteredList = this.productData?.base_sku ?? [];
      },
    });
  }

  filterByColor(): void {
    if (this.selectedColor && this.selectedColor.length != 0) {
      this.filteredList = this.filteredList.filter((item) =>
        this.selectedColor.includes(item.color_id.toString())
      );
    } else {
      this.filteredList = this.productData?.base_sku ?? [];
    }
  }

  filterBySize(): void {
    if (this.selectedSize && this.selectedSize.length != 0) {
      this.filteredList = this.filteredList.filter((item) =>
        this.selectedSize.includes(item.size_id.toString())
      );
    }
  }

  filterByfacility(): void {
    if (this.selectedOptionkk && this.selectedOptionkk.length != 0) {
      this.filteredList = this.filteredList.filter((item) =>
        this.selectedOptionkk.includes(item.location_name.toString())
      );
    }
  }

  filterByfacilityOnly(): void {
    this.selectedOptionkk = [];
    this.filteredList = this.productData?.base_sku ?? [];
    this.filterByfacility();
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
    this.filterByfacility();
  }

  onCategoryChange(): void {
    this.filterList();
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
  toggleDropdown3() {
    this.dropdownOpen3 = !this.dropdownOpen3;
  }

  onCheckboxChange(event: Event, size: string) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedSize.push(size);
    } else {
      this.selectedSize = this.selectedSize.filter((item) => item !== size);
    }
    this.onCategoryChange();
  }
  onCheckboxChange2(event: Event, color: string) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedColor.push(color);
    } else {
      this.selectedColor = this.selectedColor.filter((item) => item !== color);
    }
    this.onCategoryChange();
  }
  onCheckboxChange3(event: Event, name: string) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedOptionkk.push(name);
    } else {
      this.selectedOptionkk = this.selectedOptionkk.filter(
        (item) => item !== name
      );
    }
    this.onCategoryChange();
  }

  filterItems() {
    if (!this.searchTerm.trim()) {
      this.filteredList = this.productData?.base_sku ?? [];
      this.onCategoryChange();
    } else {
      const searchKeywords = this.searchTerm
        .toLowerCase()
        .split(' ')
        .filter(Boolean);

      this.filteredList = this.filteredList.filter((item) => {
        const skuLowerCase = item.sku.toLowerCase();
        return searchKeywords.some((keyword) => skuLowerCase.includes(keyword));
      });

      if (this.filteredList.length === 0) {
        console.log('404: Không tìm thấy sản phẩm');
        this.filteredList = [{ sku: 'No products found' }];
      }
    }
  }
}
