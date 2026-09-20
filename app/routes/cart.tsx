import { Link } from "react-router";

import type { Route } from "./+types/cart";
import { CartItem } from "~/components/cart/cart-item";
import { CartSummary } from "~/components/cart/cart-summary";
import { Button } from "~/components/ui/button";
import { getProduct } from "~/lib/api.server";
import { changeQuantity, getCart, removeFromCart } from "~/lib/cart.server";

const SHIPPING = 20;

export function meta({}: Route.MetaArgs) {
  return [{ title: "Cart | Online Store" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const cart = await getCart(request);

  const items = await Promise.all(
    cart.map(async (cartItem) => {
      const product = await getProduct(String(cartItem.id));
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: cartItem.quantity,
      };
    }),
  );

  return { items };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const id = Number(formData.get("id"));

  if (intent === "remove") {
    const cookie = await removeFromCart(request, id);
    return new Response(null, {
      status: 204,
      headers: { "Set-Cookie": cookie },
    });
  }

  if (intent === "increment" || intent === "decrement") {
    const cookie = await changeQuantity(
      request,
      id,
      intent === "increment" ? 1 : -1,
    );
    return new Response(null, {
      status: 204,
      headers: { "Set-Cookie": cookie },
    });
  }

  return new Response(null, { status: 400 });
}

export default function Cart({ loaderData }: Route.ComponentProps) {
  const { items } = loaderData;

  if (items.length === 0) {
    return (
      <div className="page py-16 text-center">
        <h1 className="text-xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button nativeButton={false} render={<Link to="/" />} className="mt-6">
          Back to store
        </Button>
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="page py-8 sm:py-12">
      <h1 className="sr-only">Your Cart</h1>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <CartSummary
          subtotal={subtotal}
          shipping={SHIPPING}
          total={subtotal + SHIPPING}
        />
      </div>
    </div>
  );
}
