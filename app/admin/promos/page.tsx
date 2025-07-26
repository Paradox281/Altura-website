"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { Calendar, Percent, Tag } from "lucide-react"

interface Promo {
  id: number;
  nama: string;
  hargaDiskon: number;
  persentaseDiskon: number;
  tanggalMulai: string;
  tanggalBerakhir: string;
}

interface PromoResponse {
  data: {
    promos: {
      promoActive: number;
      totalPromos: number;
      promoList: Promo[];
    };
  };
  status: string;
}

export default function PromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    promoActive: 0,
    totalPromos: 0,
  });

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token tidak ditemukan");
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/promo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data promo");
        }

        const data: PromoResponse = await response.json();
        setPromos(data.data.promos.promoList);
        setStats({
          promoActive: data.data.promos.promoActive,
          totalPromos: data.data.promos.totalPromos,
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat mengambil data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromos();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
        <h1 className="text-lg font-semibold">Promos</h1>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Promo Aktif</CardTitle>
              <CardDescription>Jumlah promo yang sedang berlangsung</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span className="text-2xl font-bold">{stats.promoActive}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Promo</CardTitle>
              <CardDescription>Total semua promo yang pernah dibuat</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span className="text-2xl font-bold">{stats.totalPromos}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Promo</CardTitle>
            <CardDescription>Semua promo yang tersedia</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Promo</TableHead>
                  <TableHead>Harga Diskon</TableHead>
                  <TableHead>Persentase Diskon</TableHead>
                  <TableHead>Tanggal Mulai</TableHead>
                  <TableHead>Tanggal Berakhir</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promos.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell>{promo.nama}</TableCell>
                    <TableCell>{formatCurrency(promo.hargaDiskon)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        {promo.persentaseDiskon}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(promo.tanggalMulai)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(promo.tanggalBerakhir)}
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
  )
}
