"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Printer } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Booking {
  id: number;
  fullname: string;
  destination: string;
  booking_date: string;
  departure_date: string;
  return_date: string;
  harga_asli: number;
  harga_diskon: number;
  status: string;
}

interface BookingResponse {
  data: {
    booking: Booking;
  };
  status: string;
}

export default function PrintBookingPage() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id;

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data booking");
      }

      const data: BookingResponse = await response.json();
      setBooking(data.data.booking);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat mengambil data");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Memuat data...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Data booking tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header untuk navigasi (tidak akan tercetak) */}
      <div className="mb-4 flex justify-between items-center print:hidden">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Cetak
        </Button>
      </div>

      {/* Konten kwitansi */}
      <div className="max-w-2xl mx-auto bg-white shadow-lg print:shadow-none">
        <Card className="print:shadow-none print:border-none">
          <CardHeader className="text-center border-b-2 border-gray-200 pb-4">
            <CardTitle className="text-3xl font-bold text-gray-800">
              ALTURA TRAVEL
            </CardTitle>
            <p className="text-gray-600 mt-2">Laporan Booking Perjalanan</p>
            <p className="text-sm text-gray-500 mt-1">
              Jl. Contoh No. 123, Jakarta Selatan
            </p>
            <p className="text-sm text-gray-500">
              Telp: (021) 1234-5678 | Email: info@altura.com
            </p>
          </CardHeader>

          <CardContent className="p-6">
            {/* Informasi Booking */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Detail Booking
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">ID Booking</p>
                  <p className="font-semibold">#{booking.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tanggal Booking</p>
                  <p className="font-semibold">{formatDate(booking.booking_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nama Pelanggan</p>
                  <p className="font-semibold">{booking.fullname}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold capitalize">{booking.status}</p>
                </div>
              </div>
            </div>

            {/* Informasi Perjalanan */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Detail Perjalanan
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Destinasi</p>
                  <p className="font-semibold">{booking.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tanggal Berangkat</p>
                  <p className="font-semibold">{formatDate(booking.departure_date)}</p>
                </div>
              </div>
            </div>

            {/* Rincian Biaya */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Rincian Biaya
              </h3>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Harga Asli</span>
                  <span className="font-semibold">{formatCurrency(booking.harga_asli)}</span>
                </div>
                {booking.harga_diskon > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Diskon</span>
                    <span className="font-semibold text-green-600">
                      -{formatCurrency(booking.harga_diskon)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total Bayar</span>
                    <span className="text-lg font-bold text-blue-600">
                      {booking.harga_asli > 0
                        ? (booking.harga_diskon > 0 && booking.harga_diskon < booking.harga_asli
                            ? formatCurrency(booking.harga_asli - booking.harga_diskon)
                            : formatCurrency(booking.harga_asli)
                          )
                        : "-"
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t-2 border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Terima kasih telah mempercayai Altura Travel untuk perjalanan Anda
                </p>
                <div className="flex justify-between items-end">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Dicetak pada</p>
                    <p className="font-semibold">{new Date().toLocaleDateString("id-ID")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Altura Travel</p>
                    <div className="mt-8">
                      <p className="text-sm">(_________________)</p>
                      <p className="text-xs text-gray-500">Tanda Tangan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 