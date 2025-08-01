"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Typed from "typed.js"
import { motion } from "framer-motion"
import { ChevronDown, ChevronLeft, ChevronRight, Tag, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTourPackageDiskon, getTopDestinations, getTestimonials, type TourPackageDiskon, type Destination, type Testimonial } from "@/lib/api"

declare global {
  interface Window {
    AOS?: any;
  }
}

export default function Home() {
  const typedRef = useRef(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentPromoSlide, setCurrentPromoSlide] = useState(0)
  const [currentDestinationSlide, setCurrentDestinationSlide] = useState(0)
  const [promoDestinations, setPromoDestinations] = useState<TourPackageDiskon[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentTestimonialSlide, setCurrentTestimonialSlide] = useState(0);

  useEffect(() => {
    const totalSlides = Math.ceil(testimonials.length / 3);
    const interval = setInterval(() => {
      setCurrentTestimonialSlide((prev) =>
        prev === totalSlides - 1 ? 0 : prev + 1
      );
    }, 5000); // pindah setiap 5 detik
  
    return () => clearInterval(interval); // bersihkan saat unmount
  }, [testimonials]);

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

    // Initialize Typed.js
    const typed = new Typed(typedRef.current, {
      strings: ["Altura", "Adventure", "Experience", "Memories"],
      typeSpeed: 80,
      backSpeed: 50,
      backDelay: 1500,
      loop: true,
    })

    // Fetch data from API
    const fetchData = async () => {
      try {
        const [promoData, destinationData, testimonialData] = await Promise.all([
          getTourPackageDiskon(),
          getTopDestinations(),
          getTestimonials()
        ]);
        
        setPromoDestinations(promoData);
        setDestinations(destinationData);
        setTestimonials(testimonialData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Auto-play banner slider
    const bannerInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
    }, 6000)

    // Auto-play promo slider
    const promoInterval = setInterval(() => {
      setCurrentPromoSlide((prev) => (prev + 1) % Math.ceil(promoDestinations.length / 3))
    }, 4000)

    // Auto-play destination slider
    const destinationInterval = setInterval(() => {
      setCurrentDestinationSlide((prev) => (prev + 1) % Math.ceil(destinations.length / 3))
    }, 5000)

    return () => {
      typed.destroy()
      clearInterval(bannerInterval)
      clearInterval(promoInterval)
      clearInterval(destinationInterval)
    }
  }, [promoDestinations.length, destinations.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)
  }

  const nextPromoSlide = () => {
    setCurrentPromoSlide((prev) => (prev + 1) % Math.ceil(promoDestinations.length / 3))
  }

  const prevPromoSlide = () => {
    setCurrentPromoSlide(
      (prev) => (prev - 1 + Math.ceil(promoDestinations.length / 3)) % Math.ceil(promoDestinations.length / 3),
    )
  }

  const nextDestinationSlide = () => {
    setCurrentDestinationSlide((prev) => (prev + 1) % Math.ceil(destinations.length / 3))
  }

  const prevDestinationSlide = () => {
    setCurrentDestinationSlide(
      (prev) => (prev - 1 + Math.ceil(destinations.length / 3)) % Math.ceil(destinations.length / 3),
    )
  }
  const prevTestimonialSlide = () => {
    setCurrentTestimonialSlide((prev) =>
      prev === 0 ? Math.ceil(testimonials.length / 3) - 1 : prev - 1
    );
  };
  
  const nextTestimonialSlide = () => {
    setCurrentTestimonialSlide((prev) =>
      prev === Math.ceil(testimonials.length / 3) - 1 ? 0 : prev + 1
    );
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-4 relative z-10"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Welcome to <span ref={typedRef}></span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-blue-100">
          Temukan destinasi menakjubkan dan ciptakan kenangan tak terlupakan dengan pengalaman perjalanan pilihan kami
          </p>
        </motion.div>

        {/* Enhanced Banner Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative w-full max-w-7xl mx-auto px-4 mb-8"
        >
          <div className="relative h-24 md:h-[300px] lg:h-[350px] xl:h-[400px] rounded-2xl overflow-hidden shadow-2xl">
            {bannerSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 transform ${
                  index === currentSlide
                    ? "opacity-100 scale-100"
                    : index === (currentSlide - 1 + bannerSlides.length) % bannerSlides.length
                      ? "opacity-0 scale-105 -translate-x-full"
                      : "opacity-0 scale-95 translate-x-full"
                }`}
              >
                <img 
                  src={slide.image || "/placeholder.svg"} 
                  alt={slide.title} 
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }} 
                  className="object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
                <div className="absolute inset-0 flex items-center">
                  <div className="text-left text-white px-8 md:px-12 lg:px-16 max-w-2xl">
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: index === currentSlide ? 1 : 0, x: index === currentSlide ? 0 : -50 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">{slide.title}</h3>
                      <p className="text-lg md:text-xl lg:text-2xl mb-6 text-blue-100 leading-relaxed">{slide.subtitle}</p>
                     
                    </motion.div>
                  </div>
                </div>
              </div>
            ))}

            {/* Enhanced Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-3 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-3 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Enhanced Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {bannerSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 ${
                    index === currentSlide
                      ? "w-8 h-3 bg-white rounded-full"
                      : "w-3 h-3 bg-white/50 rounded-full hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-6000 ease-linear"
                style={{ width: `${((currentSlide + 1) / bannerSlides.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 relative z-10">
          <Link href="/destinations">Jelajahi Tujuan</Link>
        </Button>

        <div className="absolute bottom-10 animate-bounce">
          <ChevronDown size={36} />
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" data-aos="fade-up">
              🔥 Penawaran Khusus & Promosi
            </h2>
            <p className="text-xl text-gray-600" data-aos="fade-up" data-aos-delay="100">
           Dapatkan promo khusus hingga 20% jika pesan sekarang di aplikasi android kami
            </p>
          </div>

          {/* Promo Slider */}
          <div className="relative" data-aos="fade-up" data-aos-delay="200">
            <div className="overflow-hidden rounded-xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentPromoSlide * 100}%)` }}
              >
                {Array.from({ length: Math.ceil(promoDestinations.length / 3) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                      {promoDestinations.slice(slideIndex * 3, (slideIndex + 1) * 3).map((destination) => (
                        <div
                          key={destination.promoId}
                          className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white transform hover:scale-105"
                        >
                          {/* Promo Badge */}
                          <div className="absolute top-4 left-4 z-10">
                            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                              <Tag className="w-4 h-4 mr-1" />
                              {destination.persentaseDiskon}% OFF
                            </div>
                          </div>

                          <Link href={`/detail/${destination.idDestinasi}`}>
                            <div className="relative h-64">
                              <img
                                src={destination.gambarDestinasi || '/logo.png'}
                                alt={destination.namaDestinasi}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                className="object-cover"
                              />
                            </div>
                            <div className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold mb-2">{destination.namaDestinasi}</h3>
                                <p className="flex items-center space-x-2"><User />{destination.jumlahBooking}</p>
                              </div>
                              <p className="text-gray-600 mb-4">{destination.deskripsiDestinasi}</p>

                              {/* Pricing */}
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                  <span className="text-gray-400 line-through text-sm">
                                    Rp {destination.hargaAsli.toLocaleString()}
                                  </span>
                                  <span className="text-red-600 font-bold text-lg">
                                    Rp {(destination.hargaAsli - destination.hargaDiskon).toLocaleString()}
                                  </span>
                                </div>
                                <div className="text-green-600 font-bold text-sm">
                                  Save Rp {destination.hargaDiskon.toLocaleString()}
                                </div>
                              </div>

                              <Button className="w-full bg-red-600 hover:bg-red-700">Book Now - Limited Offer!</Button>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Navigation */}
            <button
              onClick={prevPromoSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl rounded-full p-3 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={nextPromoSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl rounded-full p-3 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>

            {/* Promo Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(promoDestinations.length / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPromoSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentPromoSlide ? "bg-red-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-center mt-12" data-aos="fade-up">
            <Button asChild variant="outline" size="lg">
              <Link href="/destinations">Lihat Semua Promosi
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section id="destinations" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12" data-aos="fade-up">
            Destinasi Populer
          </h2>

          {/* Destination Slider */}
          <div className="relative" data-aos="fade-up" data-aos-delay="200">
            <div className="overflow-hidden rounded-xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentDestinationSlide * 100}%)` }}
              >
                {Array.from({ length: Math.ceil(destinations.length / 3) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                      {destinations.slice(slideIndex * 3, (slideIndex + 1) * 3).map((destination) => (
                        <div
                          key={destination.id}
                          className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          <Link href={`/detail/${destination.id}`}>
                            <div className="relative h-64">
                              <img
                                src={destination.imageUrl || '/logo.png'}
                                alt={destination.name}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                className="object-cover"
                              />
                              {destination.hargaDiskon && (
                                <div className="absolute top-4 left-4 z-10">
                                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                                    <Tag className="w-4 h-4 mr-1" />
                                    {destination.persentaseDiskon}% OFF
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold mb-2">{destination.name}</h3>
                                <p className="flex items-center space-x-2"><User />{destination.jumlahBooking}</p>
                              </div>
                              <p className="text-gray-600 mb-4">{destination.description}</p>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                  {destination.hargaDiskon ? (
                                    <>
                                      <span className="text-gray-400 line-through text-sm">
                                        Rp {destination.price.toLocaleString()}
                                      </span>
                                        <span className="text-red-600 font-bold text-lg">
                                        Rp {(destination.price - destination.hargaDiskon).toLocaleString()}                                        </span>
                                    </>
                                  ) : (
                                    <span className="text-blue-600 font-bold text-lg">
                                      Rp {destination.price.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                <Button variant="outline">View Details</Button>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination Navigation */}
            <button
              onClick={prevDestinationSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl rounded-full p-3 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={nextDestinationSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl rounded-full p-3 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>

            {/* Destination Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(destinations.length / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDestinationSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentDestinationSlide ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/destinations">Tampilkan Semua Destinasi</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12" data-aos="fade-up">
          Apa kata Pelanggan
          </h2>

          <div className="relative" data-aos="fade-up" data-aos-delay="200">
            <div className="overflow-hidden rounded-xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonialSlide * 100}%)` }}
              >
                {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                      {testimonials
                        .slice(slideIndex * 3, (slideIndex + 1) * 3)
                        .map((testimonial) => (
                          <div
                            key={testimonial.id}
                            className="bg-white p-6 rounded-xl shadow"
                          >
                            <div className="flex items-center mb-4">
                              <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                  {testimonial.userName.charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-bold">{testimonial.userName}</h4>
                                <p className="text-gray-500 text-sm">
                                  {new Date(testimonial.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-600">{testimonial.testimonial}</p>
                            <div className="mt-4 flex items-center">
                              {Array.from({ length: 5 }).map((_, index) => (
                                <svg
                                  key={index}
                                  className={`w-5 h-5 ${
                                    index < testimonial.rating ? "text-yellow-400" : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonialSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonialSlide ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Call to Action */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6" data-aos="fade-up">
          Siap untuk Petualangan Anda Berikutnya?
          </h2>
          <p className="text-xl mb-8" data-aos="fade-up" data-aos-delay="100">
            
            Bergabunglah dengan ribuan wisatawan yang telah merasakan keajaiban tur Altura.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <Link href="/destinations">Pesan Sekarang</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

// Enhanced banner slides data
const bannerSlides = [
  {
    title: "Liburan seru",
    subtitle: "Diskon hingga 20% pesan langsung di aplikasi sekarang",
    image: "/Biru Putih Modern Paket Tour Flyer (1).png",
    
    
  },
  {
    title: "Promo seruu",
    subtitle: "Pengalaman terbaik bagi keluarga",
    image: "/Capture.PNG",
    
    
  },
  {
    title: "Akomodasi terbaik",
    subtitle: "Tempat-tempat keren menanti anda",
    image: "/Biru Putih Modern Kolase Promosi Paket Liburan Banner-min.png",
  
    
  },
  
  
]
