import { PurchaseItem } from "./purchase-item";
export interface Purchase {
    id: number;
    vendorid: number;
    amount: number;
    items: PurchaseItem[];
    podate?: string;
}
