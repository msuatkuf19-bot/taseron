"use client";

import { motion } from "framer-motion";
import { Shield, Star, Lock, UserCheck } from "lucide-react";

const trustItems = [
  {
    icon: Shield,
    title: "Doğrulanmış Profiller",
    description: "Her üye kimlik doğrulamasından geçer",
  },
  {
    icon: Star,
    title: "Gerçek Yorumlar",
    description: "Sadece gerçek işlerden gelen değerlendirmeler",
  },
  {
    icon: Lock,
    title: "Güvenli İletişim",
    description: "Kişisel bilgileriniz korunur",
  },
  {
    icon: UserCheck,
    title: "Ücretsiz Kayıt",
    description: "Hemen ücretsiz kayıt olun, başlayın",
  },
];

export function TrustBar() {
  return (
    <section className="py-12 md:py-16 bg-light-gray-bg">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-orange/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-orange transition-colors">
                    <Icon className="w-6 h-6 text-primary-orange group-hover:text-white transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-text-primary">{item.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
