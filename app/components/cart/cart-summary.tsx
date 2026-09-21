import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";

export function CartSummary({
  subtotal,
  shipping,
  total,
}: {
  subtotal: number;
  shipping: number;
  total: number;
}) {
  return (
    <div className="rounded-xl border-2 border-primary p-5">
      <h2 className="mb-5 text-base font-bold tracking-tight">Cart Summary</h2>

      <div className="flex items-center justify-between text-sm">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span>Shipping</span>
        <span>${shipping.toFixed(2)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-sm font-bold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <Button className="mt-5 w-full rounded-lg" size="lg">
        Check out
      </Button>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Or pay with PayPal
      </p>

      <Separator className="mt-4" />

      <div className="mt-4">
        <p className="b text-xs text-muted-foreground">Promo code</p>
        <div className="mt-2 flex gap-2">
          <Input placeholder="Enter code" className="rounded-lg" />
          <Button className="shrink-0 rounded-lg">Apply</Button>
        </div>
      </div>
    </div>
  );
}
