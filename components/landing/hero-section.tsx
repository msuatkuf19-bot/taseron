import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Building2, HardHat, MoveRight } from "lucide-react";
export function HeroSection() {
  return <><section className="brand-hero"><div className="brand-shell hero-grid"><div>
    <p className="eyebrow"><span /> İNŞAATIN DİJİTAL BULUŞMA NOKTASI</p>
    <h1>Sağlam projeler.<br /><em>Doğru insanlar.</em></h1>
    <p className="hero-description">Her büyük iş, doğru bir iş birliğiyle başlar. Projenize uygun taşeronları keşfedin, uzmanlığınızı yeni fırsatlarla buluşturun.</p>
    <div className="hero-actions"><Link className="brand-button" href="/register?type=firma">Projem için ekip bul <ArrowUpRight size={19} /></Link><Link className="brand-button secondary" href="/ilanlar">İş fırsatlarını keşfet <MoveRight size={19} /></Link></div>
    <div className="hero-note"><ShieldCheck size={19} /> Onaylı ilanlar. Şeffaf teklifler. Güçlü iş birlikleri.</div>
    </div><div className="project-visual" aria-label="Firmalar ve taşeronların buluştuğu platform"><div className="visual-top"><span>GELECEĞİ BİRLİKTE İNŞA EDİYORUZ</span><ArrowUpRight size={23} /></div><div className="architecture" aria-hidden="true"><div className="tower tower-one" /><div className="tower tower-two" /><div className="tower tower-three" /><div className="ground-line" /></div><div className="visual-caption"><span>Fikirden yapıya,<br /><strong>her adımda yanınızda.</strong></span><span className="visual-number">TAŞERONCUM</span></div><div className="connection-card"><span className="connection-icon"><Building2 size={23} /></span><div><strong>Birlikte daha güçlü.</strong><p>Firma + Taşeron + Taşeroncum</p></div><ShieldCheck size={23} /></div></div></div></section>
    <section id="avantajlar" className="benefits-strip"><div className="brand-shell benefits-grid">{[{icon:ShieldCheck,title:"Onaylı ilanlar",text:"Kontrolden geçen iş fırsatları"},{icon:Building2,title:"Doğru iş ortaklığı",text:"Projenize uygun uzman ekipler"},{icon:HardHat,title:"Tek noktadan yönetim",text:"İlan, teklif ve iş takibi bir arada"}].map(item => <div className="benefit" key={item.title}><item.icon size={25} /><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}</div></section></>;
}
