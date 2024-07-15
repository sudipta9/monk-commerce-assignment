"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Product, Variant } from "@/types/products";
import { demoData } from "@/data/demoProductsData";
import { Checkbox } from "pretty-checkbox-react";
import { Square, SquareMinus, SquareCheck } from "lucide-react";
import Image from "next/image";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

const CheckBoxTree: React.FC<{
  fetchedProducts: Product[];
  selectedProducts: Product[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}> = ({ fetchedProducts, setSelectedProducts, selectedProducts }) => {
  const handleSelectProduct = (product: Product, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => {
        const productExists = prev.find((p) => p.id === product.id);
        if (productExists) {
          return prev.map((p) => {
            if (p.id === product.id) {
              return {
                ...p,
                variants: product.variants,
              };
            }
            return p;
          });
        } else {
          return [...prev, { ...product, variants: product.variants }];
        }
      });
    } else {
      setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id));
    }
  };

  const handleSelectVariant = (
    product: Product,
    variant: Variant,
    checked: boolean
  ) => {
    if (checked) {
      setSelectedProducts((prev) => {
        const productExists = prev.find((p) => p.id === product.id);
        if (productExists) {
          return prev.map((p) => {
            if (p.id === product.id) {
              return {
                ...p,
                variants: [...p.variants, variant],
              };
            }
            return p;
          });
        } else {
          return [...prev, { ...product, variants: [variant] }];
        }
      });
    } else {
      setSelectedProducts((prev) => {
        const productExists = prev.find((p) => p.id === product.id);
        if (productExists) {
          // if no variants are selected deselect product
          if (productExists.variants.length === 1) {
            return prev.filter((p) => p.id !== product.id);
          }
          return prev.map((p) => {
            if (p.id === product.id) {
              return {
                ...p,
                variants: p.variants.filter((v) => v.id !== variant.id),
              };
            }
            return p;
          });
        }
        return prev;
      });
    }
  };

  return (
    <div>
      {fetchedProducts.map((singleProduct) => {
        const currentProductState = selectedProducts.find(
          (p) => p.id === singleProduct.id
        );
        const allSelected = singleProduct.variants.every((variant) => {
          return currentProductState?.variants.find((v) => v.id === variant.id);
        });
        const someSelected = singleProduct.variants.some((variant) => {
          return currentProductState?.variants.find((v) => v.id === variant.id);
        });

        return (
          <div key={singleProduct.id} className="ml-4 mt-4">
            <label
              htmlFor={singleProduct.id.toString()}
              onClick={() =>
                handleSelectProduct(singleProduct, Boolean(currentProductState))
              }
              className="flex flex-row items-center gap-4 cursor-pointer"
            >
              <Checkbox
                checked={allSelected}
                onChange={(e) =>
                  handleSelectProduct(singleProduct, e.currentTarget.checked)
                }
                indeterminate={someSelected && !allSelected}
                icon={
                  someSelected && !allSelected ? (
                    <SquareMinus size={24} />
                  ) : allSelected ? (
                    <SquareCheck size={24} />
                  ) : (
                    <Square size={24} />
                  )
                }
                id={singleProduct.id.toString()}
                name={singleProduct.id.toString()}
              />
              <Image
                src={singleProduct.image.src}
                alt={singleProduct.title}
                width={36}
                height={36}
              />
              <span className="ml-2">{singleProduct.title}</span>
            </label>

            <div className="ml-6 my-2">
              {singleProduct.variants.map((variant) => {
                return (
                  <label
                    key={variant.id}
                    className="flex flex-row items-center py-4 cursor-pointer"
                  >
                    <Checkbox
                      checked={Boolean(
                        currentProductState?.variants.find(
                          (v) => v.id === variant.id
                        )
                      )}
                      icon={
                        Boolean(
                          currentProductState?.variants.find(
                            (v) => v.id === variant.id
                          )
                        ) ? (
                          <SquareCheck size={24} />
                        ) : (
                          <Square size={24} />
                        )
                      }
                      onChange={(e) =>
                        handleSelectVariant(
                          singleProduct,
                          variant,
                          e.currentTarget.checked
                        )
                      }
                    />
                    <span className="ml-2">{variant.title}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const AddProduct: React.FC<{
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}> = ({ products, setProducts }) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(products);
  const [addProductOpen, setAddProductOpen] = React.useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);

  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);

  // debounced search handler
  useEffect(() => {
    const fetchSearchData = async () => {
      const res = await fetch(
        `/api/fetch-data?search=${searchTerm}&page=${page}&limit=${limit}`
      );
      return (await res.json()) as Product[];
    };

    const delayDebounceFn = setTimeout(async () => {
      const data = (await fetchSearchData()) ?? [];
      setFetchedProducts(data);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [limit, page, searchTerm, setFetchedProducts]);

  return (
    <Drawer open={addProductOpen} onOpenChange={setAddProductOpen}>
      <DrawerTrigger asChild>
        <Button variant="secondary">Add Product</Button>
      </DrawerTrigger>
      <DrawerContent className="container">
        <DrawerHeader>
          <DrawerTitle>Add Product</DrawerTitle>
          {/* search area  */}
          <Input
            placeholder="Search Products"
            className="w-full my-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <DrawerDescription>
            <ScrollArea className="w-full h-[50vh]">
              <CheckBoxTree
                fetchedProducts={fetchedProducts}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
              />
            </ScrollArea>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">Close</Button>
          </DrawerClose>
          <Button
            variant="default"
            onClick={() => {
              setProducts(selectedProducts);
              setAddProductOpen(false);
            }}
          >
            Add Product
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddProduct;
