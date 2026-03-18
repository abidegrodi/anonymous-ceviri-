"use client";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form gönderme işlemi burada yapılacak
    console.log("Form submitted:", formData);
    alert("Teşekkürler! En kısa sürede size dönüş yapacağız.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-trajan">
            İletişime Geçin
          </h2>
          <p className="text-xl text-gray-600">
            Projeniz hakkında konuşmak için bizimle iletişime geçin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 font-trajan">İletişim Bilgileri</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="text-blue-600 text-2xl mr-4">📧</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 font-trajan">E-posta</h4>
                  <p className="text-gray-600">info@gametranslate.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-blue-600 text-2xl mr-4">📞</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 font-trajan">Telefon</h4>
                  <p className="text-gray-600">+90 (XXX) XXX XX XX</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-blue-600 text-2xl mr-4">📍</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 font-trajan">Adres</h4>
                  <p className="text-gray-600">İstanbul, Türkiye</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                Adınız Soyadınız
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Adınız ve soyadınız"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                E-posta
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
                Mesajınız
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Projeniz hakkında bilgi verin..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              Gönder
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
