import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export const metadata: Metadata = { title: "Yönetim Kurulu | Taşeroncum.com", description: "Taşeroncum yönetim kurulu ve yönetim ekibi." };
const members = [
 {name:"Emircan Kalaycı",initials:"EK",title:"Yönetim Kurulu Başkanı",role:"CEO",area:"Genel Yönetim"},
 {name:"Batuhan Özkök",initials:"BÖ",title:"Yönetim Kurulu Başkan Yardımcısı",role:"CTO",area:"Teknoloji"},
 {name:"Uğur Horlamaz",initials:"UH",title:"Yönetim Kurulu Üyesi",role:"COO",area:"Operasyon"},
 {name:"Ahmet Yıldırım",initials:"AY",title:"Yönetim Kurulu Üyesi",role:"Müşteri İlişkileri Sorumlusu",area:"Müşteri İlişkileri"},
 {name:"Mustafa Suat S.",initials:"MS",title:"Yönetim Kurulu Başkan Yardımcı Vekili",role:"Yazılım İşleri Sorumlusu",area:"Yazılım"},
];
export default function BoardPage() {
 return <div className="board-page"><section className="board-intro brand-shell"><p className="eyebrow">TAŞERONCUM / YÖNETİM KURULU</p><div className="board-heading"><h1>Aynı vizyon.<br /><em>Güçlü bir ekip.</em></h1><p>İnsanları, uzmanlığı ve teknolojiyi bir araya getiriyoruz. İnşaat sektöründe daha güçlü iş birlikleri için birlikte çalışıyoruz.</p></div></section><section className="brand-shell board-section" aria-label="Yönetim kurulu üyeleri"><div className="board-grid">{members.map((member,index) => <article className={`member-card ${index === 0 ? "member-lead" : ""}`} key={member.name}><div className="member-art"><span className="member-area">{member.area}</span><span className="member-initials" aria-hidden="true">{member.initials}</span><span className="member-index">0{index+1}</span></div><div className="member-info"><p className="member-title">{member.title}</p><h2>{member.name}</h2><p className="member-role">{member.role}</p></div></article>)}</div><div className="board-closing"><div><p className="eyebrow">ORTAK HEDEFİMİZ</p><h2>Güvenle başlayan,<br />birlikte büyüyen iş birlikleri.</h2></div><Link href="/register" className="brand-button">Bu yapının bir parçası olun <ArrowUpRight size={19} /></Link></div></section></div>;
}
