export default function Services() {
  const services = [
    {
      title: "Oyun Çevirisi",
      description: "Oyun metinlerinizi profesyonel çevirmenlerimizle 50+ dile çeviriyoruz.",
      icon: "🌍",
    },
    {
      title: "Yerelleştirme",
      description: "Sadece çeviri değil, kültürel uyarlama ve yerel pazara özel içerik hazırlıyoruz.",
      icon: "🎯",
    },
    {
      title: "Seslendirme",
      description: "Profesyonel ses sanatçılarıyla oyunlarınız için kaliteli seslendirme hizmeti.",
      icon: "🎤",
    },
    {
      title: "Kalite Kontrolü",
      description: "Her çeviri projemizde detaylı kalite kontrolü ve test süreçleri uyguluyoruz.",
      icon: "✅",
    },
    {
      title: "Teknik Entegrasyon",
      description: "Çevirilerinizi oyun motorunuza sorunsuz entegre ediyoruz.",
      icon: "⚙️",
    },
    {
      title: "7/24 Destek",
      description: "Projelerinizde her zaman yanınızdayız, hızlı ve etkili çözümler sunuyoruz.",
      icon: "💬",
    },
  ];

  return (
    <section id="services" className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hizmetlerimiz
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Oyun çevirisi konusunda kapsamlı çözümler sunuyoruz
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl hover:shadow-xl transition-shadow border border-blue-100"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
