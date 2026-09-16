import type { Route } from "./+types/cart";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Cart | Online Store" }];
}

export default function Cart() {
  return <div />;
}
