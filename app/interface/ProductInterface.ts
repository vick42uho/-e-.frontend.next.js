export interface ProductInterface {
    id: string;
    name: string;
    price: number;
    description: string;
    isbn: string;
    image?: string;
    category: string;
    createdAt?: Date;
}