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
import { Eye, CheckCircle, XCircle, Printer, BarChart3, Calendar, Package, TrendingUp, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
    totalRevenue?: number;
  };
  status: string;
}

interface PackageReport {
  destination: string;
  totalBookings: number;
  totalRevenue: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
}

interface DateReport {
  date: string;
  totalBookings: number;
  totalRevenue: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'package-report' | 'date-report'>('list');
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/booking`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data booking");
      }

      const data: BookingResponse = await response.json();
      console.log("Data booking dari API:", data.data.bookings);
      setBookings(data.data.bookings);
      const computedRevenue = data.data.bookings.reduce((acc, b) => acc + (b.total_price || 0), 0);
      setTotalRevenue(typeof data.data.totalRevenue === 'number' ? data.data.totalRevenue : computedRevenue);
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/booking/${id}/status?status=${newStatus}`, {
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
      fetchBookings();
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

  // Filter bookings berdasarkan kriteria
  const filteredBookings = bookings.filter((b) => {
    // Filter tanggal
    if (startDate || endDate) {
      const bookingDate = new Date(b.booking_date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start && bookingDate < start) return false;
      if (end && bookingDate > end) return false;
    }

    // Filter paket
    if (selectedPackage !== "all" && b.destination !== selectedPackage) {
      return false;
    }

    // Filter status
    if (selectedStatus !== "all" && b.status !== selectedStatus) {
      return false;
    }

    return true;
  }).sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime()); // Urutkan dari yang terbaru

  // Generate laporan per paket
  const generatePackageReport = (): PackageReport[] => {
    const packageMap = new Map<string, PackageReport>();
    
    filteredBookings.forEach(booking => {
      if (!packageMap.has(booking.destination)) {
        packageMap.set(booking.destination, {
          destination: booking.destination,
          totalBookings: 0,
          totalRevenue: 0,
          confirmedBookings: 0,
          pendingBookings: 0,
          cancelledBookings: 0
        });
      }
      
      const report = packageMap.get(booking.destination)!;
      report.totalBookings++;
      report.totalRevenue += booking.total_price;
      
      if (booking.status === "Confirmed") {
        report.confirmedBookings++;
      } else if (booking.status === "PENDING") {
        report.pendingBookings++;
      } else if (booking.status === "Cancelled") {
        report.cancelledBookings++;
      }
    });
    
    return Array.from(packageMap.values()).sort((a, b) => b.totalRevenue - a.totalRevenue);
  };

  // Generate laporan per tanggal
  const generateDateReport = (): DateReport[] => {
    const dateMap = new Map<string, DateReport>();
    
    filteredBookings.forEach(booking => {
      const date = new Date(booking.booking_date).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
      
      if (!dateMap.has(date)) {
        dateMap.set(date, {
          date,
          totalBookings: 0,
          totalRevenue: 0,
          confirmedBookings: 0,
          pendingBookings: 0,
          cancelledBookings: 0
        });
      }
      
      const report = dateMap.get(date)!;
      report.totalBookings++;
      report.totalRevenue += booking.total_price;
      
      if (booking.status === "Confirmed") {
        report.confirmedBookings++;
      } else if (booking.status === "PENDING") {
        report.pendingBookings++;
      } else if (booking.status === "Cancelled") {
        report.cancelledBookings++;
      }
    });
    
    return Array.from(dateMap.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Export laporan ke CSV
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.error("Tidak ada data untuk diexport");
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    const printContents = document.getElementById("report-print-area")?.innerHTML;
    if (!printContents) return;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Memuat data...</p>
      </div>
    );
  }

  const uniqueDestinations = [...new Set(bookings.map(b => b.destination))];
  const uniqueStatuses = [...new Set(bookings.map(b => b.status))];
  const packageReport = generatePackageReport();
  const dateReport = generateDateReport();

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Bookings</h1>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b">
          <Button
            variant={activeTab === 'list' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('list')}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Daftar Booking
          </Button>
          <Button
            variant={activeTab === 'package-report' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('package-report')}
            className="flex items-center gap-2"
          >
            <Package className="h-4 w-4" />
            Laporan Per Paket
          </Button>
          <Button
            variant={activeTab === 'date-report' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('date-report')}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Laporan Per Tanggal
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Label className="font-medium">Filter Tanggal:</Label>
              <Input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-32"
              />
              <span>-</span>
              <Input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-32"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Label className="font-medium">Paket:</Label>
              <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Semua Paket" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Paket</SelectItem>
                  {uniqueDestinations.map(dest => (
                    <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="font-medium">Status:</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handlePrintReport} variant="outline" className="flex gap-2">
              <Printer className="h-4 w-4" />
              Cetak
            </Button>
            <Button 
              onClick={() => exportToCSV(filteredBookings, `booking-report-${new Date().toISOString().split('T')[0]}`)}
              variant="outline" 
              className="flex gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredBookings.length}</div>
              <p className="text-xs text-muted-foreground">
                dari {bookings.length} total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {filteredBookings.filter(b => b.status === "Confirmed").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {((filteredBookings.filter(b => b.status === "Confirmed").length / filteredBookings.length) * 100).toFixed(1)}% dari total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {filteredBookings.filter(b => b.status === "PENDING").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {((filteredBookings.filter(b => b.status === "PENDING").length / filteredBookings.length) * 100).toFixed(1)}% dari total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content berdasarkan tab yang aktif */}
        <div id="report-print-area">
          {activeTab === 'list' && (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nama</TableHead>
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
                                <div className="line-through text-gray-500">{formatCurrency(booking.harga_asli)}</div>
                                <div className="font-bold text-green-600">{formatCurrency(booking.harga_asli - booking.total_price)}</div>
                              </>
                            )}
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                          {(() => {
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
                            if (typeof booking.upload_bukti === "string" && booking.upload_bukti.trim() !== "") {
                              return booking.upload_bukti.match(/\.(jpg|jpeg)$/i) ? (
                                <a href={booking.upload_bukti} target="_blank" rel="noopener noreferrer">
                                  <img src={booking.upload_bukti} alt="Bukti" className="h-12 w-auto border rounded mb-1" />
                                </a>
                              ) : (
                                <span className="text-gray-400 text-xs">Tidak ada bukti</span>
                              );
                            }
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
          )}

          {activeTab === 'package-report' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Laporan Per Paket</h3>
                <Button 
                  onClick={() => exportToCSV(packageReport, `package-report-${new Date().toISOString().split('T')[0]}`)}
                  variant="outline"
                  className="flex gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Destinasi</TableHead>
                        <TableHead>Total Booking</TableHead>
                        <TableHead>Total Pendapatan</TableHead>
                        <TableHead>Confirmed</TableHead>
                        <TableHead>Pending</TableHead>
                        <TableHead>Cancelled</TableHead>
                        <TableHead>Rata-rata per Booking</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {packageReport.map((report, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{report.destination}</TableCell>
                          <TableCell>{report.totalBookings}</TableCell>
                          <TableCell className="font-bold">{formatCurrency(report.totalRevenue)}</TableCell>
                          <TableCell className="text-green-600">{report.confirmedBookings}</TableCell>
                          <TableCell className="text-yellow-600">{report.pendingBookings}</TableCell>
                          <TableCell className="text-red-600">{report.cancelledBookings}</TableCell>
                          <TableCell>{formatCurrency(report.totalRevenue / report.totalBookings)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'date-report' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Laporan Per Tanggal</h3>
                <Button 
                  onClick={() => exportToCSV(dateReport, `date-report-${new Date().toISOString().split('T')[0]}`)}
                  variant="outline"
                  className="flex gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Total Booking</TableHead>
                        <TableHead>Total Pendapatan</TableHead>
                        <TableHead>Confirmed</TableHead>
                        <TableHead>Pending</TableHead>
                        <TableHead>Cancelled</TableHead>
                        <TableHead>Rata-rata per Booking</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dateReport.map((report, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{report.date}</TableCell>
                          <TableCell>{report.totalBookings}</TableCell>
                          <TableCell className="font-bold">{formatCurrency(report.totalRevenue)}</TableCell>
                          <TableCell className="text-green-600">{report.confirmedBookings}</TableCell>
                          <TableCell className="text-yellow-600">{report.pendingBookings}</TableCell>
                          <TableCell className="text-red-600">{report.cancelledBookings}</TableCell>
                          <TableCell>{formatCurrency(report.totalRevenue / report.totalBookings)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
