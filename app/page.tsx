import Link from "next/link";
import "./home.css";
import {
  ArrowUpRight,
  Zap,
  Building2,
  CheckCircle2,
  Droplets,
  Factory,
  HardHat,
  Hammer,
  Landmark,
  MapPin,
  Paintbrush,
  ShieldCheck,
  Sofa,
  Sprout,
  Star,
  ThermometerSnowflake,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getCategoryLabel } from "@/lib/utils";
import { CraneScene } from "@/components/home/crane-scene";

export const dynamic = "force-dynamic";

/** Yatırımcı görüşme talepleri bu adrese gider. Gerekirse değiştirin. */
const INVESTOR_EMAIL = "yatirim@taseroncum.com";

const CATEGORIES = [
  { key: "KABA_INSAAT", icon: Building2, hint: "Karkas, kalıp, betonarme" },
  { key: "INCE_INSAAT", icon: Hammer, hint: "Sıva, şap, alçı, seramik" },
  { key: "ELEKTRIK", icon: Zap, hint: "Güçlü ve zayıf akım tesisatı" },
  { key: "TESISAT", icon: Droplets, hint: "Sıhhi tesisat, ısıtma, doğalgaz" },
  { key: "BOYA_BADANA", icon: Paintbrush, hint: "İç ve dış cephe boya" },
  { key: "DEKORASYON", icon: Sofa, hint: "İç mimari uygulama" },
  { key: "IZOLASYON", icon: ThermometerSnowflake, hint: "Isı, su ve ses yalıtımı" },
  { key: "CELIK_YAPI", icon: Factory, hint: "Çelik konstrüksiyon, montaj" },
  { key: "PEYZAJ", icon: Sprout, hint: "Bahçe, sulama, sert zemin" },
  { key: "RESTORASYON", icon: Landmark, hint: "Tarihi yapı ve güçlendirme" },
] as const;

type HomeJob = {
  id: string;
  title: string;
  city: string;
  category: string;
  budgetMin: number | null;
  budgetMax: number | null;
  durationText: string | null;
  company: { companyName: string } | null;
  _count: { bids: number };
};

async function getHomeData() {
  try {
    const live = { approvalStatus: "APPROVED" as const, status: "OPEN" as const, isDeleted: false };
    const [jobs, liveCount, firmCount, contractorCount, bidCount, byCategory] = await Promise.all([
      prisma.jobPost.findMany({
        where: live,
        orderBy: { createdAt: "desc" },
        take: 9,
        select: {
          id: true,
          title: true,
          city: true,
          category: true,
          budgetMin: true,
          budgetMax: true,
          durationText: true,
          company: { select: { companyName: true } },
          _count: { select: { bids: true } },
        },
      }),
      prisma.jobPost.count({ where: live }),
      prisma.user.count({ where: { role: "FIRMA", isActive: true } }),
      prisma.user.count({ where: { role: "TASERON", isActive: true } }),
      prisma.bid.count(),
      prisma.jobPost.groupBy({ by: ["category"], where: live, _count: { _all: true } }),
    ]);
    const categoryCounts: Record<string, number> = {};
    byCategory.forEach((row) => (categoryCounts[row.category] = row._count._all));
    return { jobs: jobs as HomeJob[], liveCount, firmCount, contractorCount, bidCount, categoryCounts };
  } catch (error) {
    console.error("Ana sayfa verisi alınamadı:", error);
    return { jobs: [] as HomeJob[], liveCount: 0, firmCount: 0, contractorCount: 0, bidCount: 0, categoryCounts: {} as Record<string, number> };
  }
}

const tl = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });
const num = new Intl.NumberFormat("tr-TR");

function budget(min: number | null, max: number | null) {
  if (min && max) return `${tl.format(min)} – ${tl.format(max)}`;
  if (min) return `${tl.format(min)} ve üzeri`;
  if (max) return `En fazla ${tl.format(max)}`;
  return "Bütçe teklife açık";
}

export default async function HomePage() {
  const data = await getHomeData();
  const tickerItems = data.jobs.length
    ? data.jobs.map((j) => ({ id: j.id, text: j.title, meta: `${getCategoryLabel(j.category)}, ${j.city}` }))
    : CATEGORIES.map((c) => ({ id: c.key, text: getCategoryLabel(c.key), meta: c.hint }));

  return (
    <div className="home">
      {/* HERO */}
      <section className="h-hero">
        <div className="brand-shell h-hero-grid">
          <div className="h-hero-copy">
            <p className="h-kicker">
              <span className="h-pulse" aria-hidden="true" />
              {data.liveCount > 0
                ? `Şu an ${num.format(data.liveCount)} onaylı ilan yayında`
                : "İnşaatın dijital buluşma noktası"}
            </p>
            <h1>Her kat, doğru ustayla yükselir.</h1>
            <p className="h-lede">
              Taşeroncum, kaba inşaattan peyzaja on uzmanlık alanında taşeronları ve firmaları
              buluşturur. Her ilan yayına girmeden önce ekibimiz tarafından incelenir. Teklifler
              fiyatı, süresi ve notuyla tek ekranda karşılaştırılır.
            </p>
            <div className="h-actions">
              <Link className="h-btn h-btn-primary" href="/ilanlar">
                Onaylı ilanları incele <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link className="h-btn h-btn-ghost" href="/register?type=taseron">
                Taşeron olarak ilan ver
              </Link>
            </div>
            <ul className="h-hero-facts">
              <li><ShieldCheck size={16} aria-hidden="true" /> Moderasyonlu ilanlar</li>
              <li><Star size={16} aria-hidden="true" /> İş sonu değerlendirme</li>
              <li><MapPin size={16} aria-hidden="true" /> 81 ilde kullanılabilir</li>
            </ul>
          </div>
          <div className="h-hero-art">
            <CraneScene />
          </div>
        </div>

        {/* canlı ilan şeridi */}
        <div className="h-ticker" aria-label={data.jobs.length ? "Son yayınlanan ilanlar" : "Uzmanlık alanları"}>
          <span className="h-ticker-tag">{data.jobs.length ? "Son ilanlar" : "Uzmanlıklar"}</span>
          <div className="h-ticker-track">
            <ul className="h-ticker-list">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <li key={`${item.id}-${i}`} aria-hidden={i >= tickerItems.length || undefined}>
                  {data.jobs.length ? (
                    <Link href={`/ilan/${item.id}`} tabIndex={i >= tickerItems.length ? -1 : undefined}>
                      <strong>{item.text}</strong> <span>{item.meta}</span>
                    </Link>
                  ) : (
                    <span><strong>{item.text}</strong> <span>{item.meta}</span></span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PAZAR */}
      <section className="h-market" id="pazar">
        <div className="brand-shell h-market-grid">
          <div>
            <h2>Ekonominin en hızlı büyüyen sektörü hâlâ telefon rehberiyle çalışıyor.</h2>
            <p>
              Bir şantiye şefi doğru elektrikçiyi bulmak için tanıdığını arar. İyi bir taşeron
              bir sonraki işini kulaktan dolma bilgiyle bekler. Arada kaybolan zaman, bütçe ve
              güven bu sektörün en büyük görünmeyen kalemi.
            </p>
            <p>
              Taşeroncum bu kalemi kapatır: doğrulanmış ilan, karşılaştırılabilir teklif ve iş
              bitiminde kalıcı bir itibar kaydı.
            </p>
          </div>
          <div className="h-ledger" role="table" aria-label="Türkiye inşaat sektörü göstergeleri">
            <div className="h-ledger-head" role="row">
              <span role="columnheader">Gösterge</span>
              <span role="columnheader">Değer</span>
            </div>
            {[
              { k: "İnşaatın GSYH içindeki payı", sub: "2025, 2. çeyrek", v: "%6,5" },
              { k: "İnşaat sektörü yıllık büyümesi", sub: "2025, 3. çeyrek", v: "%13,9" },
              { k: "Ekonominin genel büyümesi", sub: "2025, 3. çeyrek", v: "%3,7" },
              { k: "Sektörde çalışan kişi", sub: "2025, rekor seviye", v: "2 milyon+" },
            ].map((row) => (
              <div className="h-ledger-row" role="row" key={row.k}>
                <span role="cell">
                  {row.k}
                  <small>{row.sub}</small>
                </span>
                <span role="cell" className="h-ledger-dots" aria-hidden="true" />
                <strong role="cell">{row.v}</strong>
              </div>
            ))}
            <p className="h-ledger-src">Kaynak: TÜİK verileri (KTO İnşaat Sektörü 2025 Değerlendirmesi), Forbes Türkiye.</p>
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section className="h-steps" id="nasil-calisir">
        <div className="brand-shell">
          <div className="h-section-head">
            <h2>Bir iş, dört adımda ayağa kalkar.</h2>
            <p>İlan açılmasından değerlendirmeye kadar her adım aynı platformda, kayıt altında.</p>
          </div>
          <ol className="h-steps-grid">
            {[
              { t: "Taşeron ilanını açar", d: "Uzmanlığını, şehrini, bütçe aralığını ve süreyi yazar. Taslak olarak kaydeder, hazır olunca onaya gönderir." },
              { t: "Ekibimiz inceler", d: "Her ilan yayına girmeden önce kontrol edilir. Eksik veya uygunsuz ilan, gerekçesiyle sahibine geri döner." },
              { t: "Firmalar teklif verir", d: "Onaylı ilanı gören firmalar fiyat, süre ve notlarıyla teklif bırakır. Taşeron tüm teklifleri yan yana görür." },
              { t: "İş başlar, itibar kalır", d: "Teklif kabul edilir, iş başlar. Bittiğinde firma puan ve yorum bırakır. Bu kayıt bir sonraki işin referansıdır." },
            ].map((s, i) => (
              <li key={s.t} className="h-step">
                <div className="h-step-building" aria-hidden="true">
                  {Array.from({ length: i + 1 }).map((_, f) => (
                    <span key={f} className={f === i ? "is-new" : undefined} />
                  ))}
                </div>
                <span className="h-step-no">Adım {i + 1}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* UZMANLIKLAR */}
      <section className="h-trades" id="uzmanliklar">
        <div className="brand-shell">
          <div className="h-section-head">
            <h2>Temelden çatıya on uzmanlık alanı.</h2>
            <p>Bir alan seçin, o alandaki onaylı ilanları görün.</p>
          </div>
          <ul className="h-trades-grid">
            {CATEGORIES.map(({ key, icon: Icon, hint }) => {
              const count = data.categoryCounts[key] || 0;
              return (
                <li key={key}>
                  <Link href={`/ilanlar?category=${key}`} className="h-trade">
                    <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
                    <span className="h-trade-name">{getCategoryLabel(key)}</span>
                    <span className="h-trade-hint">{hint}</span>
                    <span className="h-trade-count">{count > 0 ? `${count} açık ilan` : "İlan bekleniyor"}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* İLANLAR */}
      <section className="h-jobs" id="ilanlar">
        <div className="brand-shell">
          <div className="h-section-head h-section-head-row">
            <div>
              <h2>Şantiyeler ekip arıyor.</h2>
              <p>Ekibimizin onayladığı en yeni ilanlar.</p>
            </div>
            <Link href="/ilanlar" className="h-link">
              Tüm ilanları gör <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          {data.jobs.length ? (
            <ul className="h-jobs-grid">
              {data.jobs.slice(0, 6).map((job) => (
                <li key={job.id}>
                  <Link href={`/ilan/${job.id}`} className="h-job">
                    <span className="h-job-cat">{getCategoryLabel(job.category)}</span>
                    <h3>{job.title}</h3>
                    <dl>
                      <div><dt>Konum</dt><dd>{job.city}</dd></div>
                      <div><dt>Bütçe</dt><dd>{budget(job.budgetMin, job.budgetMax)}</dd></div>
                      {job.durationText && <div><dt>Süre</dt><dd>{job.durationText}</dd></div>}
                    </dl>
                    <span className="h-job-foot">
                      <span>{job.company?.companyName}</span>
                      <span>{job._count.bids} teklif</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-empty">
              <HardHat size={32} aria-hidden="true" />
              <div>
                <h3>İlk ilanı siz açın.</h3>
                <p>Yayındaki ilan şu an yok. Taşeron olarak kaydolun, ilanınız onaylandığında firmalar burada görecek.</p>
              </div>
              <Link href="/register?type=taseron" className="h-btn h-btn-primary">İlan oluştur</Link>
            </div>
          )}
        </div>
      </section>

      {/* GÜVEN / ÜRÜN */}
      <section className="h-trust">
        <div className="brand-shell h-trust-grid">
          <div className="h-trust-copy">
            <h2>Güven, sistemin içine yerleşik.</h2>
            <ul className="h-trust-list">
              <li>
                <h3>Onaysız ilan yayına çıkmaz</h3>
                <p>Moderasyon ekibi her ilanı inceler. Reddedilen ilan, düzeltilmesi gereken noktayla birlikte geri döner.</p>
              </li>
              <li>
                <h3>Teklifler yan yana</h3>
                <p>Fiyat, süre ve not aynı formatta gelir. Pazarlık mesaj trafiğinde kaybolmaz.</p>
              </li>
              <li>
                <h3>İtibar taşınabilir</h3>
                <p>Her tamamlanan iş, taşeronun profiline puan ve yorum olarak işlenir.</p>
              </li>
            </ul>
          </div>
          <figure className="h-mock" aria-label="Örnek ilan ve teklif ekranı">
            <div className="h-mock-bar"><span /><span /><span /></div>
            <div className="h-mock-body">
              <div className="h-mock-job">
                <div>
                  <span className="h-mock-cat">Elektrik</span>
                  <strong>12 daireli konut, iç tesisat</strong>
                  <span className="h-mock-meta">Kocaeli, Gebze, 45 gün</span>
                </div>
                <span className="h-mock-status"><CheckCircle2 size={15} aria-hidden="true" /> Onaylandı</span>
              </div>
              <p className="h-mock-label">Gelen teklifler</p>
              {[
                { f: "Akın Yapı A.Ş.", p: "₺485.000", d: "40 gün", best: true },
                { f: "Marmara İnşaat", p: "₺512.000", d: "38 gün" },
                { f: "Demir Proje Ltd.", p: "₺530.000", d: "45 gün" },
              ].map((o) => (
                <div key={o.f} className={`h-mock-offer${o.best ? " is-best" : ""}`}>
                  <span>{o.f}</span>
                  <span>{o.d}</span>
                  <strong>{o.p}</strong>
                </div>
              ))}
            </div>
            <figcaption>Örnek görünüm. Firma adları temsilidir.</figcaption>
          </figure>
        </div>
      </section>

      {/* YATIRIMCI */}
      <section className="h-investor" id="yatirimci">
        <div className="brand-shell">
          <div className="h-investor-top">
            <h2>Taşeroncum&apos;un temeli atıldı. Yükselmek için ortak arıyoruz.</h2>
            <p>
              Platform canlıda: ilan, onay, teklif ve değerlendirme akışı çalışıyor. Sıradaki kat
              gelir modeli ve ölçek.
            </p>
          </div>

          {data.liveCount + data.bidCount + data.firmCount + data.contractorCount > 0 && (
          <div className="h-live">
            {[
              { v: data.liveCount, l: "Yayındaki onaylı ilan" },
              { v: data.bidCount, l: "Verilen teklif" },
              { v: data.firmCount, l: "Kayıtlı firma" },
              { v: data.contractorCount, l: "Kayıtlı taşeron" },
            ].map((s) => (
              <div key={s.l}>
                <strong>{num.format(s.v)}</strong>
                <span>{s.l}</span>
              </div>
            ))}
            <p className="h-live-note">Rakamlar veritabanından canlı okunur.</p>
          </div>
          )}

          <ol className="h-roadmap">
            <li className="is-done">
              <span className="h-road-stage">Temel, tamamlandı</span>
              <h3>Çalışan pazaryeri</h3>
              <p>Rol bazlı hesaplar, moderasyonlu ilan akışı, teklif yönetimi, değerlendirme sistemi ve yönetim paneli.</p>
            </li>
            <li>
              <span className="h-road-stage">Kat 1: gelir</span>
              <h3>Öne çıkan ilan ve firma üyeliği</h3>
              <p>İlanını üst sıralara taşımak isteyen taşeron ve sınırsız teklif vermek isteyen firmalar için ücretli paketler.</p>
            </li>
            <li>
              <span className="h-road-stage">Kat 2: güven</span>
              <h3>Hakediş güvencesi</h3>
              <p>Ödemenin iş teslimine bağlandığı güvenceli ödeme ve işlem başına hizmet bedeli.</p>
            </li>
            <li>
              <span className="h-road-stage">Kat 3: ölçek</span>
              <h3>Mobil uygulama ve bölgesel büyüme</h3>
              <p>Şantiyede kullanılan mobil uygulama, anlık teklif bildirimi ve büyükşehirlerden başlayarak saha ağı.</p>
            </li>
          </ol>

          <div className="h-investor-cta">
            <a className="h-btn h-btn-primary" href={`mailto:${INVESTOR_EMAIL}?subject=Taşeroncum yatırım görüşmesi`}>
              Yatırımcı görüşmesi talep et <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <Link className="h-btn h-btn-ghost-dark" href="/yonetim-kurulu">Yönetim kurulunu tanıyın</Link>
          </div>
        </div>
      </section>

      {/* İKİ KAPI */}
      <section className="h-doors" aria-label="Kayıt seçenekleri">
        <Link href="/register?type=firma" className="h-door">
          <Building2 size={30} strokeWidth={1.5} aria-hidden="true" />
          <span className="h-door-who">Firmayım</span>
          <span className="h-door-title">Projeme uzman ekip bulmak istiyorum.</span>
          <span className="h-door-go">Firma hesabı aç <ArrowUpRight size={18} aria-hidden="true" /></span>
        </Link>
        <Link href="/register?type=taseron" className="h-door h-door-alt">
          <HardHat size={30} strokeWidth={1.5} aria-hidden="true" />
          <span className="h-door-who">Taşeronum</span>
          <span className="h-door-title">Uzmanlığıma uygun yeni işler almak istiyorum.</span>
          <span className="h-door-go">Taşeron hesabı aç <ArrowUpRight size={18} aria-hidden="true" /></span>
        </Link>
      </section>
    </div>
  );
}
