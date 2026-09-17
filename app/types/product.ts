export type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
};

export type ProductListResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type Category = {
  slug: string;
  name: string;
  url: string;
};

export type ProductDetail = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  returnPolicy: string;
  minimumOrderQuantity: number;
  images: string[];
  thumbnail: string;
};
