import { createCookieSessionStorage } from "react-router";

export type CartItem = {
  id: number;
  quantity: number;
};

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "cart",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secrets: [process.env.SESSION_SECRET || "dev-secret-do-not-use-in-prod"],
  },
});

async function getSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

function getItems(session: Awaited<ReturnType<typeof getSession>>) {
  const items = session.get("items");
  return Array.isArray(items) ? (items as CartItem[]) : [];
}

export async function getCart(request: Request): Promise<CartItem[]> {
  const session = await getSession(request);
  return getItems(session);
}

export async function addToCart(request: Request, id: number) {
  const session = await getSession(request);
  const items = getItems(session);
  const existing = items.find((item) => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({ id, quantity: 1 });
  }

  session.set("items", items);
  return sessionStorage.commitSession(session);
}

export async function changeQuantity(
  request: Request,
  id: number,
  delta: number,
) {
  const session = await getSession(request);
  const items = getItems(session)
    .map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + delta } : item,
    )
    .filter((item) => item.quantity > 0);

  session.set("items", items);
  return sessionStorage.commitSession(session);
}

export async function removeFromCart(request: Request, id: number) {
  const session = await getSession(request);
  const items = getItems(session).filter((item) => item.id !== id);
  session.set("items", items);
  return sessionStorage.commitSession(session);
}
