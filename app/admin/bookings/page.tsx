"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { Eye, CheckCircle, XCircle, Printer } from "lucide-react"
import { useRouter } from "next/navigation"

interface Booking {
  id: number;
  fullname: string;
  destination: string;
  booking_date: string;
  departure_date: string;
  return_date: string;
  total_price: number;
  harga_asli: number;
  status: string;
  upload_bukti?: string | string[];
}

interface BookingResponse {
  data: {
    bookings: Booking[];
  };
  status: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch("http://localhost:8080/api/admin/booking", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data booking");
      }

      const data: BookingResponse = await response.json();
      console.log("Data booking dari API:", data.data.bookings); // Debug log
      setBookings(data.data.bookings);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat mengambil data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: "Confirmed" | "Cancelled") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch(`http://localhost:8080/api/admin/booking/${id}/status?status=${newStatus}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Gagal mengubah status booking menjadi ${newStatus}`);
      }

      toast.success(`Status booking berhasil diubah menjadi ${newStatus}`);
      fetchBookings(); // Refresh data setelah perubahan
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat mengubah status");
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

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: "bg-yellow-500",
      Pending: "bg-yellow-500",
      PENDING: "bg-yellow-500",
      Confirmed: "bg-green-500",
      Cancelled: "bg-red-500",
      COMPLETED: "bg-blue-500",
    };

    return (
      <span className={`px-2 py-1 rounded-full text-white text-xs ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status}
      </span>
    );
  };

  // Tambahkan fungsi print khusus
  const handlePrintReport = () => {
    const printContents = document.getElementById("report-print-area")?.innerHTML;
    if (!printContents) return;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // reload untuk mengembalikan halaman
  };

  // Fungsi filter bookings berdasarkan tanggal booking
  const filteredBookings = bookings.filter((b) => {
    if (!startDate && !endDate) return true;
    const bookingDate = new Date(b.booking_date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && bookingDate < start) return false;
    if (end && bookingDate > end) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Bookings</h1>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Daftar Booking</h2>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
            <div className="flex gap-2 items-center">
              <label className="font-medium">Filter Tanggal Booking:</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="border rounded px-2 py-1"
              />
              <span>-</span>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="border rounded px-2 py-1"
              />
            </div>
            <Button onClick={handlePrintReport} className="flex gap-2" variant="outline">
              <Printer className="h-4 w-4" />
              Cetak Laporan
            </Button>
          </div>
        </div>

        <div id="report-print-area">
          <div className="grid gap-4 md:grid-cols-3 mb-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Booking</CardTitle>
                <CardDescription>Jumlah seluruh booking</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-bold">{filteredBookings.length}</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Pendapatan</CardTitle>
                <CardDescription>Akumulasi total harga booking</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-bold">
                  {formatCurrency(filteredBookings.reduce((acc, b) => acc + b.total_price, 0))}
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Booking per Status</CardTitle>
                <CardDescription>
                  <div>Confirmed: {filteredBookings.filter(b => b.status === "Confirmed").length}</div>
                  <div>Pending: {filteredBookings.filter(b => b.status === "PENDING").length}</div>
                  <div>Cancelled: {filteredBookings.filter(b => b.status === "Cancelled").length}</div>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Booking</TableHead>
                    <TableHead>Nama Pengguna</TableHead>
                    <TableHead>Destinasi</TableHead>
                    <TableHead>Tanggal Booking</TableHead>
                    <TableHead>Tanggal Perjalanan</TableHead>
                    <TableHead>Total Harga</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bukti</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>#{booking.id}</TableCell>
                      <TableCell>{booking.fullname}</TableCell>
                      <TableCell>{booking.destination}</TableCell>
                      <TableCell>{formatDate(booking.booking_date)}</TableCell>
                      <TableCell>{formatDate(booking.departure_date)}</TableCell>
                      <TableCell>
                        {booking.harga_asli === booking.total_price
                          ? formatCurrency(booking.total_price)
                          : (
                            <>
                              <div>Harga Asli: {formatCurrency(booking.harga_asli)}</div>
                              <div>Diskon: -{formatCurrency(booking.harga_asli - booking.total_price)}</div>
                              <div>Total: {formatCurrency(booking.total_price)}</div>
                            </>
                          )}
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>
                        {(() => {
                          // Jika array dan ada isinya
                          if (Array.isArray(booking.upload_bukti) && booking.upload_bukti.length > 0) {
                            return (
                              <div className="flex flex-col gap-1">
                                {booking.upload_bukti.map((url, idx) =>
                                  url.match(/\.(jpg|jpeg)$/i) ? (
                                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                                      <img src={url} alt={`Bukti ${idx + 1}`} className="h-12 w-auto border rounded mb-1" />
                                    </a>
                                  ) : null
                                )}
                              </div>
                            );
                          }
                          // Jika string dan tidak kosong
                          if (typeof booking.upload_bukti === "string" && booking.upload_bukti.trim() !== "") {
                            return booking.upload_bukti.match(/\.(jpg|jpeg)$/i) ? (
                              <a href={booking.upload_bukti} target="_blank" rel="noopener noreferrer">
                                <img src={booking.upload_bukti} alt="Bukti" className="h-12 w-auto border rounded mb-1" />
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs">Tidak ada bukti</span>
                            );
                          }
                          // Jika kosong/null
                          return <span className="text-gray-400 text-xs">Tidak ada bukti</span>;
                        })()}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {booking.status === "PENDING" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStatusChange(booking.id, "Confirmed")}
                                className="text-green-500 hover:text-green-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStatusChange(booking.id, "Cancelled")}
                                className="text-red-500 hover:text-red-600"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/bookings/${booking.id}/print`)}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
