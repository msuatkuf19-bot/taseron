import { HeroSection } from "@/components/landing/hero-section";
import { listApprovedJobs } from "@/actions/jobs";
import { JobsGrid } from "@/components/jobs/JobsGrid";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default async function HomePage() {
 const { jobs, pagination } = await listApprovedJobs({ page: 1, pageSize: 6 });
 const gridPagination = {page:pagination.page,pageSize:pagination.pageSize,totalCount:pagination.total,totalPages:pagination.totalPages};
 return <div><HeroSection /><section id="ilanlar" className="brand-shell home-jobs"><div className="section-heading"><div><p className="eyebrow">YENİ FIRSATLAR, SAĞLAM BAŞLANGIÇLAR</p><h2>Bir sonraki işiniz burada.</h2><p>Güncel ve onaylanmış iş ilanlarını keşfedin.</p></div><Link href="/ilanlar">Tüm ilanları keşfet <ArrowUpRight size={18} /></Link></div><JobsGrid jobs={jobs || []} pagination={gridPagination} /></section><section id="nasil-calisir" className="how-section"><div className="brand-shell"><p className="eyebrow">KARMAŞIK SÜREÇLERİ GERİDE BIRAKIN</p><h2>Üç adımda doğru iş birliği.</h2><div className="steps-grid">{[{title:"Kendinizi tanıtın",text:"Firma veya taşeron olarak kaydolun. Profilinizde uzmanlığınızı ve ihtiyaçlarınızı paylaşın."},{title:"Doğru fırsatı bulun",text:"Projeniz için ilan oluşturun veya uzmanlığınıza uygun onaylı ilanları inceleyin."},{title:"Tekliflerle buluşun",text:"Teklifleri değerlendirin, iş ortaklarınızla iletişime geçin ve yeni bir başlangıç yapın."}].map((step,i) => <article key={step.title}><span className="step-number">0{i+1} /</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></div></section></div>;
}
