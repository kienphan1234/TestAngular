// Định nghĩa mô hình cho các giá trị thuộc tính
export interface OptionValue {
  id: string;
  name: string;
  value?: string;
  position: number;
}


export interface Option {
  name: string;
  values: OptionValue[];
}


export interface BaseSku {
  id: string;
  sku: string;
  location: string;
  short_code: string;
  size_id: string;
  size_name: string;
  color_id: string;
  color_name: string;
  base_cost: number;
  second_side_price: string;
  default_profit: string;
  size_position: number;
  location_position: number;
  location_icon: string;
  location_name: string;
  color_position: number;
  shipping_cost_us: string;
  shipping_adding_us: string;
  shipping_cost_ww: string;
  shipping_adding_ww: string;
}


export interface ProductData {
  options: Option[];
  short_code: string;
  display_name: string;
  base_sku: BaseSku[];
}


export interface catalogue {
  code: number;
  message: string;
  data: ProductData;
}
