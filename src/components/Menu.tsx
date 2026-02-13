import Link from "next/link";

export default function Menu() {
  return (
    <div className="menu flex flex-row items-center w-full justify-between sm:gap-10">
      <div className="menu__item">
        <Link href="/">Accueil</Link>
      </div>
      <div className="menu__item">
        <Link href="/manounou">Ma nounou</Link>
      </div>
      <div className="menu__item">
        <Link href="/contact">Contact</Link>
      </div>
    </div>
  );
}
