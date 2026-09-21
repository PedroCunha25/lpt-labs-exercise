import { Link, NavLink as RouterNavLink } from "react-router";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { cn } from "cn";

import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

const navLinks = ["Home", "Shop", "About", "Contact", "Blog"];

const navItemClass =
  "rounded-md px-3 py-1.5 text-sm transition-colors duration-100 active:opacity-60 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none";

function NavLink({ label }: { label: string }) {
  if (label === "Home") {
    return (
      <RouterNavLink
        to="/"
        end
        className={({ isActive }) =>
          cn(
            navItemClass,
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-primary/10 hover:text-primary",
          )
        }
      >
        {label}
      </RouterNavLink>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        navItemClass,
        "text-foreground hover:bg-primary/10 hover:text-primary",
      )}
    >
      {label}
    </button>
  );
}

function CartBadge({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <span className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
      {count}
    </span>
  );
}

function Logo() {
  return (
    <Link
      to="/"
      className="rounded-sm font-display text-2xl leading-none tracking-[0.06em] text-foreground transition-opacity duration-100 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none active:opacity-60 sm:text-[32px]"
    >
      THE ONLINE STORE
    </Link>
  );
}

export function Header({ cartCount }: { cartCount: number }) {
  return (
    <header className="border-b border-border bg-white">
      <div className="flex h-16 page items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((label) => (
            <NavLink key={label} label={label} />
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Account">
            <User />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cart"
            nativeButton={false}
            render={<Link to="/cart" className="relative" />}
          >
            <ShoppingBag />
            <CartBadge count={cartCount} />
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cart"
            nativeButton={false}
            render={<Link to="/cart" className="relative" />}
          >
            <ShoppingBag />
            <CartBadge count={cartCount} />
          </Button>
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Open menu" />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col items-start gap-1 p-4">
                {navLinks.map((label) => (
                  <NavLink key={label} label={label} />
                ))}
              </nav>
              <div className="flex items-center gap-2 border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <Button variant="ghost" size="icon" aria-label="Search">
                  <Search />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Account">
                  <User />
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
