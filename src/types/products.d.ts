export type Product = {
  id: number;
  title: string;
  variants: Variant[];
  image: {
    id: number;
    product_id: number;
    src: string;
  };
};

export type Variant = {
  id: number;
  product_id: number;
  title: string;
  price: string;
};
