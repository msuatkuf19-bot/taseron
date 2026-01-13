"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, MessageSquare, Star } from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "İlan Yönetimi Paneli",
    description: "Tüm ilanlarınızı tek yerden yönetin, teklifleri karşılaştırın",
    mockup: "📋",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: MessageSquare,
    title: "Teklif & Mesajlaşma",
    description: "Taşeronlarla doğrudan iletişim kurun, anında bildirim alın",
    mockup: "💬",
    gradient: "from-primary-orange to-warning-yellow",
  },
  {
    icon: Star,
    title: "Puanlama & Yorumlar",
    description: "İş bitince değerlendirin, güvenilir ustalar ile çalışın",
    mockup: "⭐",
    gradient: "from-success-green to-green-600",
  },
];

export function FeatureMockups() {
  return (
    <section className="py-20 md:py-28 bg-white">
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
              Özellikler
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            <span className="text-primary-orange">Güçlü</span> Yönetim Araçları
          </h2>
          <p className="text-lg text-text-secondary">
            İşlerinizi kolayca takip edin, yönetin ve sonuçlandırın
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group relative"
              >
                {/* Card */}
                <div className="bg-gradient-to-br from-white to-light-gray-bg border-2 border-border-gray rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all h-full overflow-hidden">
                  {/* Mockup Container */}
                  <div className="relative mb-6 h-48 bg-gradient-to-br from-soft-dark to-dark-bg rounded-xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                    {/* Mini Dashboard Mockup */}
                    <div className="text-6xl">{feature.mockup}</div>
                    
                    {/* Glow Effect on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity`}></div>
                    
                    {/* Animated Lines (dashboard effect) */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 left-4 right-4 h-2 bg-white rounded-full"></div>
                      <div className="absolute top-10 left-4 w-1/2 h-2 bg-white rounded-full"></div>
                      <div className="absolute top-16 left-4 right-12 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-text-primary flex-1">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover Border Glow */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}>
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} blur-xl opacity-30`}></div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-light-gray-bg via-white to-light-gray-bg rounded-2xl p-8 shadow-sm border border-border-gray max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-text-primary mb-3">
              Ve daha fazlası...
            </h3>
            <p className="text-text-secondary leading-relaxed">
              Bildirimler, analitik raporlar, gelişmiş filtreleme, mobil uygulama ve 
              sürekli güncellenen yeni özelliklerle işlerinizi daha verimli yönetin.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
