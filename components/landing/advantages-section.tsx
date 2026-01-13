"use client";

import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const firmaAdvantages = [
  "Tek ilanda onlarca teklif",
  "Usta puan & yorum sistemi",
  "Zaman & maliyet tasarrufu",
  "Doğrudan iletişim",
];

const taseronAdvantages = [
  "Yeni iş fırsatları",
  "Uzmanlığa göre eşleşme",
  "Profil puanı ile daha çok iş",
  "Ücretsiz ilanlara erişim",
];

export function AdvantagesSection() {
  return (
    <section id="avantajlar" className="py-20 md:py-28 bg-gradient-to-br from-light-gray-bg to-white">
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
              Avantajlarımız
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            Herkes İçin <span className="text-primary-orange">Kazanç</span>
          </h2>
          <p className="text-lg text-text-secondary">
            Firmalar ve taşeronlar için özel olarak tasarlanmış avantajlar
          </p>
        </motion.div>

        {/* Two Column Split */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Firmalar İçin */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 hover:shadow-2xl transition-shadow group border border-border-gray"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🏢
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-text-primary">
                  Firmalar İçin
                </h3>
                <p className="text-text-secondary">
                  İşinizi en uygun taşeronla buluşturun
                </p>
              </div>

              {/* Advantages List */}
              <ul className="space-y-4">
                {firmaAdvantages.map((advantage, index) => (
                  <motion.li
                    key={advantage}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 bg-success-green/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-success-green" />
                    </div>
                    <span className="text-text-primary font-medium">{advantage}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA */}
              <div className="pt-6">
                <Link href="/register?type=firma" className="block">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold group/btn shadow-lg hover:shadow-xl transition-all"
                  >
                    Firma Olarak Başla
                    <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* Decorative Element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-full pointer-events-none"></div>
            </div>
          </motion.div>

          {/* Taşeronlar İçin */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-primary-orange to-warning-yellow rounded-2xl shadow-xl p-8 lg:p-10 hover:shadow-2xl transition-shadow group text-white relative overflow-hidden"
          >
            <div className="space-y-6 relative z-10">
              {/* Header */}
              <div className="space-y-3">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🔨
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">
                  Taşeronlar İçin
                </h3>
                <p className="text-white/90">
                  Yeni iş fırsatlarını hemen yakalayın
                </p>
              </div>

              {/* Advantages List */}
              <ul className="space-y-4">
                {taseronAdvantages.map((advantage, index) => (
                  <motion.li
                    key={advantage}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{advantage}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA */}
              <div className="pt-6">
                <Link href="/register?type=taseron" className="block">
                  <Button
                    size="lg"
                    className="w-full bg-white hover:bg-white/90 text-primary-orange font-semibold group/btn shadow-lg hover:shadow-xl transition-all"
                  >
                    Taşeron Olarak Başla
                    <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "500+", label: "Aktif İlan" },
            { value: "2.5K+", label: "Kayıtlı Üye" },
            { value: "1200+", label: "Tamamlanan İş" },
            { value: "98%", label: "Memnuniyet" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary-orange mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-text-secondary font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
