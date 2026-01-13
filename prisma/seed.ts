import { PrismaClient, Role, JobStatus, BidStatus, Category, ApprovalStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.jobPost.deleteMany();
  await prisma.contractorProfile.deleteMany();
  await prisma.companyProfile.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("123456", 10);

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@taseroncum.com",
      passwordHash: hashedPassword,
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log("✅ Admin created:", admin.email);

  // Create 2 Firma users with profiles
  const firma1 = await prisma.user.create({
    data: {
      email: "firma1@taseroncum.com",
      passwordHash: hashedPassword,
      role: Role.FIRMA,
      isActive: true,
      companyProfile: {
        create: {
          companyName: "ABC İnşaat Ltd. Şti.",
          contactName: "Ahmet Yılmaz",
          phone: "0212 555 1234",
          city: "İstanbul",
          about:
            "20 yıllık tecrübemizle büyük ölçekli inşaat projeleri gerçekleştirmekteyiz.",
        },
      },
    },
    include: { companyProfile: true },
  });
  console.log("✅ Firma 1 created:", firma1.email);

  const firma2 = await prisma.user.create({
    data: {
      email: "firma2@taseroncum.com",
      passwordHash: hashedPassword,
      role: Role.FIRMA,
      isActive: true,
      companyProfile: {
        create: {
          companyName: "XYZ Yapı A.Ş.",
          contactName: "Mehmet Kaya",
          phone: "0312 444 5678",
          city: "Ankara",
          about:
            "Konut ve ticari yapı projelerinde uzmanlaşmış bir firmayız.",
        },
      },
    },
    include: { companyProfile: true },
  });
  console.log("✅ Firma 2 created:", firma2.email);

  // Create 5 Taşeron users with profiles
  const taseronData = [
    {
      email: "taseron1@taseroncum.com",
      displayName: "Ali Demir Ustası",
      phone: "0532 111 2233",
      city: "İstanbul",
      skills: ["Kaba İnşaat", "Betonarme"],
      experienceYears: 15,
      about: "15 yıllık tecrübe ile kaba inşaat işleri yapıyoruz.",
    },
    {
      email: "taseron2@taseroncum.com",
      displayName: "Veli Elektrik",
      phone: "0533 222 3344",
      city: "İstanbul",
      skills: ["Elektrik", "Otomasyon"],
      experienceYears: 10,
      about: "A'dan Z'ye elektrik tesisat işleri yapılır.",
    },
    {
      email: "taseron3@taseroncum.com",
      displayName: "Hasan Boya Ekibi",
      phone: "0534 333 4455",
      city: "Ankara",
      skills: ["Boya", "Badana", "Dekoratif Boya"],
      experienceYears: 8,
      about: "Profesyonel boya ve badana hizmetleri.",
    },
    {
      email: "taseron4@taseroncum.com",
      displayName: "Murat Tesisat",
      phone: "0535 444 5566",
      city: "İzmir",
      skills: ["Tesisat", "Doğalgaz", "Su Tesisatı"],
      experienceYears: 12,
      about: "Su ve doğalgaz tesisatı konusunda uzmanız.",
    },
    {
      email: "taseron5@taseroncum.com",
      displayName: "Osman Dekorasyon",
      phone: "0536 555 6677",
      city: "Bursa",
      skills: ["Dekorasyon", "İç Mimari"],
      experienceYears: 6,
      about: "Modern ve klasik dekorasyon projeleri.",
    },
  ];

  const taserons = [];
  for (const data of taseronData) {
    const taseron = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        role: Role.TASERON,
        isActive: true,
        contractorProfile: {
          create: {
            displayName: data.displayName,
            phone: data.phone,
            city: data.city,
            skills: data.skills,
            experienceYears: data.experienceYears,
            about: data.about,
          },
        },
      },
      include: { contractorProfile: true },
    });
    taserons.push(taseron);
    console.log("✅ Taşeron created:", taseron.email);
  }

  // Create Taşeron Jobs with different approval statuses
  
  // 1. DRAFT İlan (Taseron1 tarafından)
  const draftJob = await prisma.jobPost.create({
    data: {
      companyId: firma1.companyProfile!.id, // CompanyProfile gerekli
      createdById: taserons[0].id,
      createdByRole: Role.TASERON,
      title: "Bahçe Peyzaj ve Düzenleme İşi",
      description:
        "Beykoz'daki villamızın bahçe peyzaj işi için teklifler bekliyoruz. 500 m² alanda çim, ağaçlandırma ve sulama sistemi kurulacak.",
      category: Category.PEYZAJ,
      city: "İstanbul",
      budgetMin: 50000,
      budgetMax: 80000,
      durationText: "3 hafta",
      contactPhone: "0532 111 2233",
      status: JobStatus.OPEN,
      approvalStatus: ApprovalStatus.DRAFT,
    },
  });
  console.log("✅ DRAFT Job created:", draftJob.title);

  // 2. PENDING_APPROVAL İlan (Taseron2 tarafından)
  const pendingJob1 = await prisma.jobPost.create({
    data: {
      companyId: firma1.companyProfile!.id,
      createdById: taserons[1].id,
      createdByRole: Role.TASERON,
      title: "Ofis Binası LED Aydınlatma Projesi",
      description:
        "Maslak'taki 8 katlı ofis binamızda tüm aydınlatmanın LED'e dönüştürülmesi gerekiyor. Akıllı aydınlatma sistemi kurulumu dahil.",
      category: Category.ELEKTRIK,
      city: "İstanbul",
      budgetMin: 120000,
      budgetMax: 180000,
      durationText: "45 gün",
      contactPhone: "0533 222 3344",
      contactEmail: "veli@elektrik.com",
      status: JobStatus.OPEN,
      approvalStatus: ApprovalStatus.PENDING_APPROVAL,
    },
  });
  console.log("✅ PENDING_APPROVAL Job created:", pendingJob1.title);

  // 3. PENDING_APPROVAL İlan (Taseron3 tarafından)
  const pendingJob2 = await prisma.jobPost.create({
    data: {
      companyId: firma2.companyProfile!.id,
      createdById: taserons[2].id,
      createdByRole: Role.TASERON,
      title: "Apartman Dış Cephe Boyası",
      description:
        "Çankaya'daki 12 katlı apartmanın dış cephe boyası yenilenecek. Isı yalıtımlı boya kullanılacak.",
      category: Category.BOYA_BADANA,
      city: "Ankara",
      budgetMin: 90000,
      budgetMax: 120000,
      durationText: "2 ay",
      contactPhone: "0534 333 4455",
      status: JobStatus.OPEN,
      approvalStatus: ApprovalStatus.PENDING_APPROVAL,
    },
  });
  console.log("✅ PENDING_APPROVAL Job created:", pendingJob2.title);

  // 4. REJECTED İlan (Taseron4 tarafından - uygunsuz içerik nedeniyle reddedilmiş)
  const rejectedJob = await prisma.jobPost.create({
    data: {
      companyId: firma2.companyProfile!.id,
      createdById: taserons[3].id,
      createdByRole: Role.TASERON,
      title: "Tesisat Onarım İşi",
      description:
        "Acil tesisat onarımı yapılacak. Detaylı bilgi için arayın.",
      category: Category.TESISAT,
      city: "İzmir",
      budgetMin: 10000,
      budgetMax: 20000,
      durationText: "1 hafta",
      contactPhone: "0535 444 5566",
      status: JobStatus.OPEN,
      approvalStatus: ApprovalStatus.REJECTED,
      rejectedAt: new Date(),
      rejectedById: admin.id,
      rejectionReason:
        "İlan açıklaması çok kısa ve belirsiz. Lütfen yapılacak işleri detaylı olarak açıklayın, hangi tür tesisat onarımı olduğunu, kaç daire/ofis olduğunu ve işin kapsamını belirtin.",
    },
  });
  console.log("✅ REJECTED Job created:", rejectedJob.title);

  // 5-8. APPROVED İlanlar (Admin tarafından onaylanmış)
  const approvedJobsData = [
    {
      companyId: firma1.companyProfile!.id,
      createdById: taserons[0].id,
      createdByRole: Role.TASERON,
      title: "5 Katlı Bina Kaba İnşaat İşi",
      description:
        "Kadıköy'de yapılacak 5 katlı konut projesinin kaba inşaat işleri için taşeron aranmaktadır. Tecrübeli ekipler başvurabilir. Toplam 2500 m² inşaat alanı bulunmaktadır. Betonarme iskelet sistem uygulanacaktır.",
      category: Category.KABA_INSAAT,
      city: "İstanbul",
      budgetMin: 400000,
      budgetMax: 600000,
      durationText: "4 ay",
      contactPhone: "0532 111 2233",
      status: JobStatus.OPEN,
      approvalStatus: ApprovalStatus.APPROVED,
      approvedAt: new Date(),
      approvedById: admin.id,
    },
    {
      companyId: firma1.companyProfile!.id,
      createdById: taserons[1].id,
      createdByRole: Role.TASERON,
      title: "AVM Elektrik Tesisatı Projesi",
      description:
        "Beşiktaş'ta inşa edilecek 3 katlı AVM'nin komple elektrik tesisat işleri için teklif alınmaktadır. Güçlü akım, zayıf akım, yangın alarm sistemi ve jeneratör bağlantıları dahil edilecektir.",
      category: Category.ELEKTRIK,
      city: "İstanbul",
      budgetMin: 250000,
      budgetMax: 350000,
      durationText: "3 ay",
      contactPhone: "0533 222 3344",
      contactEmail: "elektrik@avm.com",
      status: JobStatus.OPEN,
      approvalStatus: ApprovalStatus.APPROVED,
      approvedAt: new Date(),
      approvedById: admin.id,
    },
    {
      companyId: firma2.companyProfile!.id,
      createdById: taserons[2].id,
      createdByRole: Role.TASERON,
      title: "Ofis Binası Komple İç Dekorasyon",
      description:
        "Çankaya'da bulunan 10 katlı ofis binasının tüm iç dekorasyon işleri yapılacak. Asma tavan, duvar kağıdı, zemin kaplamaları ve aydınlatma armatürleri dahil.",
      category: Category.DEKORASYON,
      city: "Ankara",
      budgetMin: 300000,
      budgetMax: 450000,
      durationText: "2.5 ay",
      contactPhone: "0534 333 4455",
      status: JobStatus.OPEN,
      approvalStatus: ApprovalStatus.APPROVED,
      approvedAt: new Date(),
      approvedById: admin.id,
    },
    {
      companyId: firma2.companyProfile!.id,
      createdById: taserons[4].id,
      createdByRole: Role.TASERON,
      title: "200 Daireli Konut Projesi Çatı İzolasyonu",
      description:
        "Keçiören'de bulunan yeni yapı konut projesinin çatı ve teras izolasyon işleri. Toplam 5000 m² alan. Su yalıtımı ve ısı yalıtımı birlikte uygulanacak.",
      category: Category.IZOLASYON,
      city: "Ankara",
      budgetMin: 500000,
      budgetMax: 700000,
      durationText: "2 ay",
      contactPhone: "0536 555 6677",
      status: JobStatus.OPEN,
      approvalStatus: ApprovalStatus.APPROVED,
      approvedAt: new Date(),
      approvedById: admin.id,
    },
  ];

  const approvedJobs = [];
  for (const jobData of approvedJobsData) {
    const job = await prisma.jobPost.create({
      data: jobData,
    });
    approvedJobs.push(job);
    console.log("✅ APPROVED Job created:", job.title);
  }

  // Create Bids for approved jobs
  const bidsData = [
    {
      jobId: approvedJobs[0].id,
      contractorId: taserons[0].contractorProfile!.id,
      message: "Bu işi 450.000 TL'ye 4 ayda kaliteli bir şekilde bitirebiliriz. Referanslarımız mevcuttur.",
      proposedPrice: 450000,
      estimatedDuration: "120 gün",
      status: BidStatus.PENDING,
    },
    {
      jobId: approvedJobs[0].id,
      contractorId: taserons[1].contractorProfile!.id,
      message: "Kaba inşaat işlerinde de tecrübemiz var. 500.000 TL teklifimiz.",
      proposedPrice: 500000,
      estimatedDuration: "100 gün",
      status: BidStatus.PENDING,
    },
    {
      jobId: approvedJobs[1].id,
      contractorId: taserons[1].contractorProfile!.id,
      message: "Elektrik tesisat konusunda 10 yıllık tecrübemiz var. A sınıfı malzeme kullanıyoruz.",
      proposedPrice: 280000,
      estimatedDuration: "90 gün",
      status: BidStatus.ACCEPTED,
    },
    {
      jobId: approvedJobs[2].id,
      contractorId: taserons[2].contractorProfile!.id,
      message: "İç dekorasyon projelerinde uzman ekibimizle hizmetinizdeyiz.",
      proposedPrice: 350000,
      estimatedDuration: "75 gün",
      status: BidStatus.PENDING,
    },
    {
      jobId: approvedJobs[3].id,
      contractorId: taserons[4].contractorProfile!.id,
      message: "İzolasyon işlerinde 15 yıllık tecrübe. Garanti belgeli çalışma.",
      proposedPrice: 550000,
      estimatedDuration: "60 gün",
      status: BidStatus.PENDING,
    },
  ];

  for (const bidData of bidsData) {
    const bid = await prisma.bid.create({
      data: bidData,
    });
    console.log("✅ Bid created for job");
  }

  // Create Reviews
  const reviewsData = [
    {
      companyId: firma1.companyProfile!.id,
      contractorId: taserons[1].contractorProfile!.id,
      jobId: approvedJobs[1].id,
      rating: 5,
      comment:
        "Mükemmel bir ekip! Elektrik işlerini zamanında ve kaliteli bir şekilde tamamladılar. Kesinlikle tavsiye ederim.",
    },
    {
      companyId: firma2.companyProfile!.id,
      contractorId: taserons[2].contractorProfile!.id,
      jobId: approvedJobs[2].id,
      rating: 4,
      comment: "İyi bir iş çıkardılar. Sadece bazı detaylarda küçük aksaklıklar oldu ama genel olarak memnunuz.",
    },
    {
      companyId: firma1.companyProfile!.id,
      contractorId: taserons[0].contractorProfile!.id,
      jobId: null,
      rating: 5,
      comment: "Çok profesyonel ve güvenilir bir taşeron. Her projede çalışmak isteriz.",
    },
  ];

  for (const reviewData of reviewsData) {
    const review = await prisma.review.create({
      data: reviewData,
    });
    console.log("✅ Review created");
  }

  console.log("\n🎉 Seeding completed successfully!");
  console.log("\n📋 Demo Credentials:");
  console.log("   Admin: admin@taseroncum.com / 123456");
  console.log("   Firma 1: firma1@taseroncum.com / 123456");
  console.log("   Firma 2: firma2@taseroncum.com / 123456");
  console.log("   Taşeron 1: taseron1@taseroncum.com / 123456");
  console.log("   Taşeron 2: taseron2@taseroncum.com / 123456");
  console.log("   Taşeron 3: taseron3@taseroncum.com / 123456");
  console.log("   Taşeron 4: taseron4@taseroncum.com / 123456");
  console.log("   Taşeron 5: taseron5@taseroncum.com / 123456");
  console.log("\n📊 İlan Durumları:");
  console.log("   • 1 DRAFT ilan (Taşeron 1)");
  console.log("   • 2 PENDING_APPROVAL ilan (Admin onayı bekliyor)");
  console.log("   • 1 REJECTED ilan (Admin tarafından reddedilmiş)");
  console.log("   • 4 APPROVED ilan (Yayında)");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
