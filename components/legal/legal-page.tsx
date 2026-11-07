import Link from "next/link";
import "./legal.css";
import { LEGAL } from "@/lib/legal";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

const DOCS = [
  { href: "/kvkk-aydinlatma-metni", label: "KVKK aydınlatma metni" },
  { href: "/gizlilik-politikasi", label: "Gizlilik politikası" },
  { href: "/cerez-politikasi", label: "Çerez politikası" },
  { href: "/kullanim-kosullari", label: "Kullanım koşulları" },
];

export function LegalPage({
  title,
  intro,
  current,
  sections,
}: {
  title: string;
  intro: React.ReactNode;
  current: string;
  sections: LegalSection[];
}) {
  return (
    <div className="legal">
      <header className="legal-head">
        <div className="brand-shell">
          <nav className="legal-crumb" aria-label="Konum">
            <Link href="/">Ana sayfa</Link>
            <span aria-hidden="true">/</span>
            <span>Yasal metinler</span>
          </nav>
          <h1>{title}</h1>
          <div className="legal-intro">{intro}</div>
          <p className="legal-updated">Son güncelleme: {LEGAL.updatedAt}</p>
        </div>
      </header>
      <div className="brand-shell legal-grid">
        <aside className="legal-aside">
          <nav aria-label="Bu sayfada">
            <h2>Bu sayfada</h2>
            <ol>
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    <span>{i + 1}.</span> {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <nav aria-label="Diğer yasal metinler" className="legal-docs">
            <h2>Yasal metinler</h2>
            <ul>
              {DOCS.map((d) => (
                <li key={d.href}>
                  <Link href={d.href} aria-current={d.href === current ? "page" : undefined}>
                    {d.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <article className="legal-body">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id}>
              <h2>
                <span>{i + 1}.</span> {s.title}
              </h2>
              {s.body}
            </section>
          ))}
          <div className="legal-contact">
            <h2>Sorunuz mu var?</h2>
            <p>
              Kişisel verilerinizle ilgili her türlü soru ve başvuru için{" "}
              <strong>{LEGAL.kvkkEmail}</strong> adresine yazabilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

export function Controller() {
  return (
    <dl className="legal-dl">
      <div><dt>Veri sorumlusu</dt><dd>{LEGAL.company}</dd></div>
      <div><dt>Adres</dt><dd>{LEGAL.address}</dd></div>
      <div><dt>MERSİS no</dt><dd>{LEGAL.mersis}</dd></div>
      <div><dt>E-posta</dt><dd>{LEGAL.kvkkEmail}</dd></div>
      <div><dt>KEP</dt><dd>{LEGAL.kep}</dd></div>
    </dl>
  );
}
