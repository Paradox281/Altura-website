import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Users, Star, Check, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getDestinationDetail, type DestinationDetail } from "@/lib/api"
import BookingForm from "@/components/booking-form"
import ImageGallery from "@/components/image-gallery"

interface PageProps {
  params: {
    id: string
  }
}

export default async function DestinationDetailPage({ params }: PageProps) {
  let destination: DestinationDetail

  try {
    destination = await getDestinationDetail(params.id)
  } catch (error) {
    notFound()
  }

  if (!destination) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[60vh] overflow-hidden">
          <Image
            src={destination.image || "/logo.png"}
            alt={destination.nama}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-white">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">{destination.lokasi}</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{destination.nama}</h1>
                <div className="flex items-center gap-6 text-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{destination.jumlah_orang} people</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span>{destination.jumlahBooking} bookings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">About This Destination</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">{destination.description}</p>
                {destination.longDescription && (
                  <p className="text-gray-600 leading-relaxed">{destination.longDescription}</p>
                )}
              </CardContent>
            </Card>

            {/* Highlights */}
            {destination.highlights && destination.highlights.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Highlights</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {destination.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Itinerary */}
            {destination.itenary && destination.itenary.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
                  <div className="space-y-4">
                    {destination.itenary.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 leading-relaxed">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Facilities */}
            {destination.facilities && destination.facilities.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Facilities & Services</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {destination.facilities.map((facility) => (
                      <Badge key={facility.id} variant="secondary" className="justify-start p-3">
                        <Check className="w-4 h-4 mr-2 text-green-500" />
                        {facility.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {destination.galleries && destination.galleries.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Photo Gallery</h2>
                  <ImageGallery images={destination.galleries} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                Rp {(Number(destination.harga ?? 0) - Number(destination.hargaDiskon ?? 0)).toLocaleString()}
                </div>
                  <p className="text-gray-600">per person</p>
                </div>

                <Separator className="my-6" />

                {/* Quick Info */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Group Size</span>
                    </div>
                    <span className="font-medium">{destination.groupSize || `${destination.jumlah_orang} people`}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Location</span>
                    </div>
                    <span className="font-medium">{destination.lokasi}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Bookings</span>
                    </div>
                    <span className="font-medium">{destination.jumlahBooking} completed</span>
                  </div>
                </div>

                <BookingForm destinationId={destination.id} price={destination.harga} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Siap Bertualang?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Bergabung dengan {destination.jumlahBooking} wisatawan lain yang telah merasakan destinasi menakjubkan ini.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-blue-600 hover:bg-white hover:text-blue-600"
            >
              <Link href="/">Explore More Destinations</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
