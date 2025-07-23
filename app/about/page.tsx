"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Award, Users, Globe, Heart, MapPin, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  useEffect(() => {
    // Load AOS from CDN
    const loadAOS = async () => {
      if (typeof window !== "undefined") {
        // Load AOS CSS
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/aos@2.3.1/dist/aos.css"
        document.head.appendChild(link)

        // Load AOS JS
        const script = document.createElement("script")
        script.src = "https://unpkg.com/aos@2.3.1/dist/aos.js"
        script.onload = () => {
          if (window.AOS) {
            window.AOS.init({
              duration: 800,
              once: false,
            })
          }
        }
        document.head.appendChild(script)
      }
    }

    loadAOS()
  }, [])

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh]">
        <img src="./logo.png" alt="About Altura" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} className="object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              About Altura
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl max-w-3xl mx-auto"
            >
              Menciptakan pengalaman perjalanan yang tak terlupakan sejak 2025
            </motion.p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-3xl font-bold mb-6">Kisah Kami</h2>
              <p className="text-gray-700 mb-4">
              Altura didirikan pada tahun 2025 oleh sekelompok pelancong yang penuh semangat dan memiliki keyakinan bahwa perjalanan bukan hanya sekadar mengunjungi tempat-tempat, tetapi juga tentang menciptakan hubungan yang bermakna dan pengalaman yang tak terlupakan.
              </p>
              <p className="text-gray-700 mb-4">
              Apa yang awalnya dimulai sebagai usaha kecil yang menawarkan tur khusus di Asia Tenggara, kini telah berkembang menjadi perusahaan perjalanan global yang hadir di lebih dari 50 negara. Meskipun kami telah berkembang, kami tetap setia pada nilai-nilai inti kami: keaslian, keberlanjutan, dan pelayanan yang luar biasa.
              </p>
              <p className="text-gray-700">
              Nama "Altura" berasal dari bahasa Spanyol yang berarti "ketinggian" atau "elevasi", mencerminkan komitmen kami untuk membawa pengalaman perjalanan ke tingkat yang lebih tinggi. Kami percaya bahwa perjalanan memiliki kekuatan untuk mengubah hidup, memperluas cara pandang, dan menciptakan kenangan yang abadi.
              </p>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden" data-aos="fade-left">
              <img src="./logo.png" alt="Altura Team" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center" data-aos="fade-up">
            Value kami
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm" data-aos="fade-up" data-aos-delay="100">
              <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">
              Keberlanjutan</h3>
              <p className="text-gray-700">
              Kami berkomitmen pada pariwisata yang bertanggung jawab yang menghormati budaya lokal, mendukung ekonomi lokal, dan meminimalkan dampak lingkungan. Kami bermitra dengan akomodasi ramah lingkungan dan mendukung upaya konservasi di destinasi yang kami kunjungi.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Keaslian</h3>
              <p className="text-gray-700">
              Kami percaya pada penciptaan pengalaman asli yang melampaui objek wisata. Tur kami meliputi
interaksi dengan masyarakat lokal, kelas memasak tradisional, dan petualangan di luar jalur yang biasa
yang menunjukkan esensi sejati setiap destinasi.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm" data-aos="fade-up" data-aos-delay="300">
              <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Keunggulan</h3>
              <p className="text-gray-700">
              Dari pemandu kami yang berpengetahuan luas hingga akomodasi yang kami pilih dengan saksama, kami berusaha untuk mencapai keunggulan dalam setiap aspek layanan kami. Kami terus mencari masukan dari para pelancong kami untuk meningkatkan dan menyempurnakan penawaran kami.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center" data-aos="fade-up">
           Developer
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="relative h-64 rounded-xl overflow-hidden mb-4">
                  <img src={member.image || "/placeholder.svg"} alt={member.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} className="object-cover" />
                </div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-blue-600 mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

   
      
      {/* Contact Us */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-3xl font-bold mb-6">Hubungi Kami</h2>
              <p className="mb-8">
              Punya pertanyaan tentang tur kami atau ingin membuat rencana perjalanan khusus? Pakar perjalanan kami siap membantu Anda merencanakan perjalanan yang sempurna.

              </p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>Sawah Padang , Payakumbuh,Sumatra Barat ,Indonesia</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3" />
                  <span>+62 082287338654</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3" />
                  <span>info@altura-travel.com</span>
                </div>
              </div>
            </div>

            <div className="bg-white text-gray-900 p-8 rounded-xl shadow-lg" data-aos="fade-left">
              <h3 className="text-xl font-bold mb-6">Send us a message</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about your dream trip..."
                  ></textarea>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6" data-aos="fade-up">
          Siap Memulai Petualangan Anda?
          </h2>
          <p className="text-xl text-gray-600 mb-8" data-aos="fade-up" data-aos-delay="100">
          Bergabunglah dengan ribuan Traveller yang telah menjelajahi dunia bersama Altura. Biarkan kami membantu Anda menciptakan kenangan yang akan bertahan seumur hidup.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4" data-aos="fade-up" data-aos-delay="200">
            <Button asChild size="lg">
              <Link href="/detail/featured">Explore Destinations</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

const teamMembers = [
  {
    name: "Muhamad Ilham Ramadhan",
    role: "Founder & CEO",
    bio: "Mahasiswa STTPayakumbuh ",
    image: "/WhatsApp Image 2025-06-09 at 17.58.28.jpeg",
  },

]
