"use client";

import { motion } from "framer-motion";
import { FileText, Users, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "İlan Aç",
    description: "İhtiyacınız olan işi detaylı bir şekilde tanımlayın. Lokasyon, bütçe ve iş kapsamını belirleyin.",
    mockup: "📝",
    color: "from-blue-500 to-blue-600",
  },
  {
    number: "02",
    icon: Users,
    title: "Teklif Al",
    description: "Doğrulanmış taşeronlardan gelen teklifleri inceleyin. Profil, yorum ve puanları karşılaştırın.",
    mockup: "💬",
    color: "from-primary-orange to-warning-yellow",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Ustayı Seç",
    description: "Size en uygun teklifi veren ustayı seçin. Direkt iletişime geçin ve işe başlayın.",
    mockup: "✅",
    color: "from-success-green to-green-600",
  },
];

export function HowItWorks() {
  return (
    <section id="nasil-calisir" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block mb-4">
            <span className="bg-primary-orange/10 text-primary-orange text-sm font-semibold px-4 py-2 rounded-full">
              Nasıl Çalışır?
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            3 Adımda <span className="text-primary-orange">İşe Başlayın</span>
          </h2>
          <p className="text-lg text-text-secondary">
            Platformumuz üzerinden hızlı ve güvenli bir şekilde doğru ustayı bulun
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connection Lines */}
          <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border-gray to-transparent -z-10"></div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                {/* Card */}
                <div className="bg-white border-2 border-border-gray rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all h-full">
                  {/* Step Number Badge */}
                  <div className="absolute -top-5 left-8">
                    <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                      <span className="text-white text-xl font-bold">{step.number}</span>
                    </div>
                  </div>

                  {/* Mockup/Icon */}
                  <div className="mt-6 mb-6 flex items-center justify-center">
                    <div className="w-24 h-24 bg-light-gray-bg rounded-2xl flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
                      {step.mockup}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${step.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-text-primary">{step.title}</h3>
                    </div>
                    <p className="text-text-secondary leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity pointer-events-none`}></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-text-secondary mb-6">
            Binlerce firma ve taşeron zaten platformumuzu kullanıyor
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="inline-flex items-center justify-center bg-primary-orange hover:bg-primary-orange/90 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Hemen Başla →
            </a>
            <a
              href="#avantajlar"
              className="inline-flex items-center justify-center bg-white border-2 border-border-gray hover:border-primary-orange text-text-primary hover:text-primary-orange font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105"
            >
              Avantajları Keşfet
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
