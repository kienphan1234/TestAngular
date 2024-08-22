import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uniqueLocation',
  standalone: true
})
export class UniqueLocationPipe implements PipeTransform {

  transform(skus: any[]): any[] {
    if (!skus) return [];
    const locationNames = new Set();
    return skus.filter(sku => {
      if (!locationNames.has(sku.location_name)) {
        locationNames.add(sku.location_name);
        return true;
      }
      return false;
    });
  }
}
