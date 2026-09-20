import { data, isRouteErrorResponse, Link, useFetcher } from "react-router";
import { useEffect } from "react";
import { toast } from "sonner";

import type { Route } from "./+types/product";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Spinner } from "~/components/ui/spinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { ProductGallery } from "~/components/product/product-gallery";
import { getProduct } from "~/lib/api.server";
import { addToCart } from "~/lib/cart.server";

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    {
      title: loaderData
        ? `${loaderData.product.title} - Online Store`
        : "Online Store",
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const product = await getProduct(params.id);
  return { product };
}

export async function action({ request, params }: Route.ActionArgs) {
  const cookie = await addToCart(request, Number(params.id));
  return data({ addedAt: Date.now() }, { headers: { "Set-Cookie": cookie } });
}

export default function Product({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData;
  const fetcher = useFetcher<typeof action>();
  const isAddingToCart = fetcher.state !== "idle";
  const {
    title,
    description,
    price,
    sku,
    weight,
    dimensions,
    warrantyInformation,
    shippingInformation,
    returnPolicy,
    minimumOrderQuantity,
    images,
    thumbnail,
  } = product;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      toast.success(`${title} added to cart`);
    }
  }, [fetcher.state, fetcher.data, title]);

  return (
    <div className="page py-8 sm:py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr]">
        <ProductGallery
          images={images.length > 0 ? images : [thumbnail]}
          title={title}
        />

        <div>
          <h1 className="mt-1 text-xl font-bold">{title}</h1>
          <p className="mt-1 text-xl font-bold">${price.toFixed(2)}</p>
          <fetcher.Form method="post">
            <Button
              type="submit"
              className="mt-4 w-full rounded-none"
              size="lg"
              disabled={isAddingToCart}
            >
              {isAddingToCart ? <Spinner /> : "Add to Cart"}
            </Button>
          </fetcher.Form>
          <Separator className="mt-6" />
          <p className="mt-6 text-[10px] tracking-wide text-muted-foreground uppercase">
            Product Details
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            {description}
          </p>

          <Accordion className="mt-6">
            <AccordionItem value="specs">
              <AccordionTrigger>Specifications</AccordionTrigger>
              <AccordionContent>
                <dl className="grid grid-cols-2 gap-y-1 text-sm text-muted-foreground">
                  <dt>SKU</dt>
                  <dd>{sku}</dd>
                  <dt>Weight</dt>
                  <dd>{weight}g</dd>
                  <dt>Dimensions</dt>
                  <dd>
                    {dimensions.width} x {dimensions.height} x{" "}
                    {dimensions.depth} cm
                  </dd>
                  <dt>Minimum order</dt>
                  <dd>{minimumOrderQuantity}</dd>
                </dl>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="warranty">
              <AccordionTrigger>Warranty</AccordionTrigger>
              <AccordionContent>{warrantyInformation}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping</AccordionTrigger>
              <AccordionContent>{shippingInformation}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="returns">
              <AccordionTrigger>Return Policy</AccordionTrigger>
              <AccordionContent>{returnPolicy}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="page py-16 text-center">
        <h1 className="text-xl font-bold">Product not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't find the product you're looking for.
        </p>
        <Button nativeButton={false} render={<Link to="/" />} className="mt-6">
          Back to store
        </Button>
      </div>
    );
  }

  return (
    <div className="page py-16 text-center">
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Please try again later.
      </p>
    </div>
  );
}
