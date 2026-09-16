import { Link } from "react-router";
import { Menu, Search, ShoppingBag, User } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

const navLinks = ["Home", "Shop", "About", "Contact", "Blog"];

function NavLink({ label }: { label: string }) {
  const className =
    "text-sm text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-sm";

  if (label === "Home") {
    return (
      <Link to="/" className={className}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" className={className}>
      {label}
    </button>
  );
}

function Logo() {
  return (
    <Link
      to="/"
      className="rounded-sm font-display text-2xl leading-none tracking-[0.06em] text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none sm:text-[32px]"
    >
      THE ONLINE STORE
    </Link>
  );
}

export function Header() {
  return (
    <header className="border-b border-border bg-white">
      <div className="flex h-16 page items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
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
            render={<Link to="/cart" />}
          >
            <ShoppingBag />
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cart"
            render={<Link to="/cart" />}
          >
            <ShoppingBag />
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
              <nav className="flex flex-col gap-4 p-4">
                {navLinks.map((label) => (
                  <NavLink key={label} label={label} />
                ))}
              </nav>
              <div className="flex items-center gap-2 border-t border-border p-4">
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
