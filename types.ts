
export interface ShoppingItem {
  id: string;
  name: string;
  bought: boolean;
  quantity: number;
  unitPrice: number;
}

export type SortType = 'date' | 'name' | 'bought';
