export default function About() {
  return (
    <section id="about" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Neden Bizi Seçmelisiniz?
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Oyun çevirisi konusunda yılların deneyimi ve uzman ekibimizle, 
              oyununuzu global pazara başarıyla taşıyoruz. Her projede kalite, 
              hız ve müşteri memnuniyetini ön planda tutuyoruz.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="text-green-500 text-xl mr-3">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">500+ Başarılı Proje</h3>
                  <p className="text-gray-600">Farklı türlerde oyun çevirisi deneyimi</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-green-500 text-xl mr-3">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">50+ Dil Desteği</h3>
                  <p className="text-gray-600">Geniş dil yelpazesi ve yerel uzmanlar</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-green-500 text-xl mr-3">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Hızlı Teslimat</h3>
                  <p className="text-gray-600">Acil projeler için hızlı çözümler</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl p-8 lg:p-12">
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-4">98%</div>
              <p className="text-xl text-gray-700 mb-8">Müşteri Memnuniyeti</p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-gray-600">Tamamlanan Proje</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">50+</div>
                  <div className="text-gray-600">Desteklenen Dil</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
