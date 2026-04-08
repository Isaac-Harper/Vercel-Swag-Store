import Link from "next/link";

export function Header() {
  return (
    <header>
      <nav>
        <Link href="/">Swag Store</Link>
        <Link href="/products">Products</Link>
      </nav>
    </header>
  );
}
