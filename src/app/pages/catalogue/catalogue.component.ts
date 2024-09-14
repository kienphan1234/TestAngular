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
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MessageComponent } from '../message/message.component';
import { RouterModule } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [
    CommonModule,
    UniqueLocationPipe,
    FormsModule,
    TableModule,
    ScrollingModule,
    MessageComponent,
    RouterModule
  ],
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
  selectedOption: string[] = [];
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
  sortColumn: string = '';
  isAscending: boolean = true;
  error: string | null = null;
  success: string | null = null;
  specialCharWarning: boolean = false;
  items = 2000;  // Số phần tử
  startitems = 0;     // Vị trí bắt đầu
  enditems = this.items; // Vị trí kết thúc
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
        this.filterList();
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
    if (this.selectedOption && this.selectedOption.length != 0) {
      this.filteredList = this.filteredList.filter((item) =>
        this.selectedOption.includes(item.location_name.toString())
      );
    }
  }

  filterByfacilityOnly(): void {
    this.selectedOption = [];
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
    this.dropdownOpen = false;
  }
  onCheckboxChange1() {
    this.dropdownOpen2 = false;
  }
  onCheckboxChange2(event: Event, color: string) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedColor.push(color);
    } else {
      this.selectedColor = this.selectedColor.filter((item) => item !== color);
    }
    this.onCategoryChange();
    this.dropdownOpen1 = false;
  }
  onCheckboxChange3(event: Event, name: string) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedOption.push(name);
    } else {
      this.selectedOption = this.selectedOption.filter((item) => item !== name);
    }
    this.onCategoryChange();
    this.dropdownOpen3 = false;
  }


  filterItems() {
    const specialCharRegex = /[^a-zA-Z0-9\s-]/;
    this.specialCharWarning = specialCharRegex.test(this.searchTerm);
    this.filterList();
    this.error = null;
    this.success = 'Success-Data';
    if (!this.searchTerm.trim()) {
      this.filterList();
    }else{
      const searchKeywords = this.searchTerm
        .toLowerCase()
        .split(' ')
        .filter((x) => x.trim());

      this.filteredList = this.filteredList.filter((item) => {
        const skuLowerCase = item.sku.toLowerCase();
        return searchKeywords.some((keyword) => skuLowerCase.includes(keyword));
      });

      if (this.filteredList.length === 0 ) {
        this.error = 'Error-Data';
        this.success = null;
      } else {
        this.error = null;
        this.success = 'Success-Data';
      }
    }
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      // Nếu người dùng nhấn lại vào cùng một cột, đổi thứ tự sắp xếp (tăng dần/giảm dần)
      this.isAscending = !this.isAscending;
    } else {
      // Nếu chuyển sang cột mới, chỉ thay đổi cột sắp xếp mà không sắp xếp dữ liệu
      this.sortColumn = column;
      this.isAscending = true; // Đặt lại thứ tự sắp xếp mặc định
    }

    // Sắp xếp `filteredList` theo cột đã chọn
    this.filteredList.sort((a, b) => {
      let valA = a[column];
      let valB = b[column];

      // Xử lý nếu giá trị là chuỗi
      if (typeof valA === 'string' && typeof valB === 'string') {
        // Chuyển đổi thành chữ thường để so sánh không phân biệt chữ hoa chữ thường
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();

        // Kiểm tra nếu chuỗi có chứa ký hiệu tiền tệ
        if (valA.startsWith('$')) valA = valA.substring(1);
        if (valB.startsWith('$')) valB = valB.substring(1);

        // Kiểm tra nếu chuỗi sau khi loại bỏ ký hiệu tiền tệ có thể chuyển thành số
        const numA = parseFloat(valA);
        const numB = parseFloat(valB);

        if (!isNaN(numA) && !isNaN(numB)) {
          // Nếu cả hai giá trị đều có thể chuyển thành số, so sánh chúng như số
          return this.isAscending ? numA - numB : numB - numA;
        } else {
          // Nếu không thể chuyển thành số, so sánh như chuỗi
          if (valA < valB) {
            return this.isAscending ? -1 : 1;
          } else if (valA > valB) {
            return this.isAscending ? 1 : -1;
          } else {
            return 0;
          }
        }
      }

      return 0;
    });
  }

  clickAll() {
    this.selectedSize = [];
    this.selectedColor = [];
    this.selectedOption = [];
    this.onCategoryChange();
  }

  onCheckboxLabelClick(valueId: string) {
    if (this.selectedSize.includes(valueId)) {
      this.selectedSize = this.selectedSize.filter(id => id !== valueId);
    } else {
      this.selectedSize.push(valueId);
    }
    this.onCategoryChange();
    this.dropdownOpen = false;
  }

  onCheckboxLabelClick1(valueId: string) {
    if (this.selectedColor.includes(valueId)) {
      this.selectedColor = this.selectedColor.filter(id => id !== valueId);
    } else {
      this.selectedColor.push(valueId);
    }
    this.onCategoryChange();
    this.dropdownOpen1 = false;
  }

  onCheckboxLabelClick2(valueId: string) {
    if (this.selectedOption.includes(valueId)) {
      this.selectedOption = this.selectedOption.filter(id => id !== valueId);
    } else {
      this.selectedOption.push(valueId);
    }
    this.onCategoryChange();
    this.dropdownOpen3 = false;
  }
  

  onScroll(event: any) {
    /*scrollTop: Vị trí hiện tại của cuộn.
      scrollHeight: Tổng chiều cao của nội dung.
      clientHeight: Chiều cao của vùng nhìn thấy được.
    */
    const scrollTop = event.target.scrollTop;
    const scrollHeight = event.target.scrollHeight;
    const clientHeight = event.target.clientHeight;

    // Kiểm tra khi gần đến cuối chiều cao hiện tại của bảng
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      this.loadMoreItems();
    }
  }

  loadMoreItems() {
   // Chỉ tải thêm nếu chưa đến phần tử cuối cùng
   if (this.enditems < this.filteredList.length) {
    // Cập nhật startIndex và endIndex nhưng đảm bảo không vượt quá chiều dài của danh sách
    this.startitems = this.enditems; 
    this.enditems = Math.min(this.enditems + this.items, this.filteredList.length);
    this.filteredList = this.filteredList.slice(this.startitems, this.enditems);
   }
  }
}
