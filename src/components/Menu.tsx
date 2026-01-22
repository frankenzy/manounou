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
        <Link href="/defis">Defis</Link>
      </div>
      <div className="menu__item">
        <Link href="/blogStatiqueGeneration">SSG</Link>
      </div>
      <div className="menu__item">
        <Link href="/blogIncrementPage">ISR</Link>
      </div>

      <div className="menu__item">
        <Link href="/parteners">PARTNERS</Link>
      </div>
    </div>
  );
}

export default function Menu() {
  return (
    <div className="menu flex flex-row items-center w-full justify-center sm:gap-10">
      <div className="menu__item">
        <Link href="/about">Accueil</Link>
      </div>
      <div className="menu__item">
        <Link href="/">Explorer</Link>
      </div>
      <div className="menu__item">
        <Link href="/about">Dm</Link>
      </div>
      <div className="menu__item">
        <Link href="/contact">Contact</Link>
      </div>

      <div className="menu__item">
        <Link href="/defis">Defis</Link>
      </div>
      <div className="menu__item">
        <Link href="/blogStatiqueGeneration">SSG</Link>
      </div>
      <div className="menu__item">
        <Link href="/blogIncrementPage">ISR</Link>
      </div>

      <div className="menu__item">
        <Link href="/parteners">PARTNERS</Link>
      </div>
    </div>
  );
}
