import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Online Store" }];
}

export default function Home() {
  return <div />;
}
