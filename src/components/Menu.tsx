import Link from "next/link";

export function MenuOld() {
  return (
    <div className="menu flex flex-row items-center w-full justify-center sm:gap-10">
      <div className="menu__item">
        <Link href="/">Accueil</Link>
      </div>
      <div className="menu__item">
        <Link href="/todo">TODO</Link>
      </div>
      <div className="menu__item">
        <Link href="/about">À propos</Link>
      </div>
      <div className="menu__item">
        <Link href="/contact">Contact</Link>
      </div>
      <div className="menu__item">
        <Link href="/blogStatiqueGeneration">SSG</Link>
      </div>
    </div>
  );
}

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
      <div className="menu__item">
        <Link href="/todo">SSG</Link>
      </div>
    </div>
  );
}
