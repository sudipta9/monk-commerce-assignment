import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import Image from "next/image";
import { GripVertical, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

// ============== start type definitions ==============
export type Product = {
  id: number;
  title: string;
  variants?: Variant[];
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

export type ProductListProps = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

// ============== end type definitions ==============

// *============================ Displaying single Variant ============================*
const VariantItem: React.FC<{ variant: Variant }> = ({ variant }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: variant.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [showVariantDiscountOption, setShowVariantDiscountOption] =
    useState<boolean>(false);
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex flex-col py-2 bg-background"
    >
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6 flex items-center gap-4 cursor-grab active:cursor-grabbing focus:outline-none ms-12">
          <GripVertical />
          <p>{variant.title}</p>
        </div>

        <div className="col-span-5 flex items-center gap-4 w-full">
          {!showVariantDiscountOption && (
            <Button
              variant="secondary"
              onClick={() => {
                setShowVariantDiscountOption(true);
              }}
            >
              Add Discount
            </Button>
          )}
          {showVariantDiscountOption && (
            <div className="w-full grid grid-cols-5 gap-4">
              <Input
                type="number"
                placeholder="Discount"
                className="col-span-3"
              />
              <Select>
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder="Discount Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">% off</SelectItem>
                  <SelectItem value="fixed">Flat off</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        {/* <div className="col-span-1"> */}
        <Button variant="secondary">
          <X />
        </Button>
        {/* </div> */}
      </div>
    </div>
  );
};

// *============================ Displaying single Product ============================*
const ProductItem: React.FC<{
  product: Product;
  productsState: Product[];
  setProductsState: React.Dispatch<React.SetStateAction<Product[]>>;
}> = ({ product, productsState, setProductsState }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: product.id });
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [variants, setVariants] = useState<Variant[] | undefined>(
    product.variants
  );
  const [showProductDiscountOption, setShowProductDiscountOption] =
    useState<boolean>(false);

  const handleVariantsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setVariants((currentVariants) => {
      if (active.id === over?.id) {
        return currentVariants;
      }

      if (currentVariants) {
        const oldIndex = currentVariants.findIndex(
          (variant) => variant.id === active.id
        );
        const newIndex = currentVariants.findIndex(
          (variant) => variant.id === over?.id
        );

        return arrayMove(currentVariants, oldIndex, newIndex);
      }

      return currentVariants;
    });
  };

  //   update variants in the products state
  useEffect(() => {
    setProductsState((allProducts) => {
      const productIndex = allProducts.findIndex(
        (singleProduct) => singleProduct.id === product.id
      );

      const newProducts = [...allProducts];
      newProducts[productIndex].variants = variants;

      return newProducts;
    });
  }, [product.id, setProductsState, variants]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex flex-col p-2 bg-background"
    >
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6 flex items-center gap-4 cursor-grab active:cursor-grabbing focus:outline-none">
          <GripVertical className="" />
          {/* image */}
          <Image
            src={product.image.src}
            alt={product.title}
            width={48}
            height={48}
          />
          <p>{product.title}</p>
        </div>

        <div className="col-span-5 flex items-center gap-4 w-full">
          {!showProductDiscountOption && (
            <Button
              variant="secondary"
              onClick={() => {
                setShowProductDiscountOption(true);
              }}
            >
              Add Discount
            </Button>
          )}
          {showProductDiscountOption && (
            <div className="w-full grid grid-cols-5 gap-4">
              <Input
                type="number"
                placeholder="Discount"
                className="col-span-3"
              />
              <Select>
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder="Discount Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">% off</SelectItem>
                  <SelectItem value="fixed">Flat off</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        {/* <div className="col-span-1"> */}
        <Button variant="secondary">
          <X />
        </Button>
        {/* </div> */}
      </div>

      {variants?.length && (
        <Collapsible className="flex flex-col">
          <CollapsibleTrigger className="text-right pt-2 hover:underline">
            View Variants
          </CollapsibleTrigger>
          <CollapsibleContent>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleVariantsDragEnd}
              id={`product-${product.id}`}
            >
              <SortableContext
                items={variants.map((variant) => variant.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="my-2">
                  {variants.map((variant) => (
                    <VariantItem key={variant.id} variant={variant} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

// *============================ Displaying the Products List ============================*
const ProductList: React.FC<ProductListProps> = ({ products, setProducts }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragProductEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = products.findIndex(
        (product) => product.id === active.id
      );
      const newIndex = products.findIndex((product) => product.id === over?.id);

      setProducts((products) => arrayMove(products, oldIndex, newIndex));
    }
  };

  return (
    <div className="my-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragProductEnd}
        id="product-list"
      >
        <div className="flex flex-col gap-4">
          <div className="p-4 ps-12 border-b grid grid-cols-12">
            <p className="col-span-6">Product</p>
            <p className="col-span-5">Discount</p>
          </div>
          <SortableContext
            items={products.map((product) => product.id)}
            strategy={verticalListSortingStrategy}
          >
            {products.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                productsState={products}
                setProductsState={setProducts}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
};

export default ProductList;
