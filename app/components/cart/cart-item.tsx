import { Form } from "react-router";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import type { CartLine } from "~/types/cart";

export function CartItem({ item }: { item: CartLine }) {
  return (
    <div className="flex gap-6 border-b border-border py-4 last:border-b-0">
      <img
        src={item.thumbnail}
        alt={item.title}
        className="size-30 shrink-0 bg-image-placeholder object-contain"
      />

      <div className="flex h-30 flex-1 flex-col">
        <p className="text-sm font-medium">{item.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          ${item.price.toFixed(2)}
        </p>

        <div className="mt-auto flex items-center gap-1">
          <div className="flex h-9 w-24 items-center justify-between gap-2 rounded-lg border border-border px-3">
            <QuantityButton
              intent="decrement"
              id={item.id}
              label={`Decrease quantity of ${item.title}`}
            >
              <Minus />
            </QuantityButton>
            <span className="flex items-center text-sm leading-none">
              {item.quantity}
            </span>
            <QuantityButton
              intent="increment"
              id={item.id}
              label={`Increase quantity of ${item.title}`}
            >
              <Plus />
            </QuantityButton>
          </div>

          <Form method="post">
            <input type="hidden" name="intent" value="remove" />
            <input type="hidden" name="id" value={item.id} />
            <Button
              type="submit"
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove ${item.title} from cart`}
            >
              <Trash2 />
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function QuantityButton({
  intent,
  id,
  label,
  children,
}: {
  intent: "increment" | "decrement";
  id: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Form method="post" className="flex items-center">
      <input type="hidden" name="intent" value={intent} />
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="ghost"
        size="icon-sm"
        className="flex size-4 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
        aria-label={label}
      >
        {children}
      </Button>
    </Form>
  );
}
