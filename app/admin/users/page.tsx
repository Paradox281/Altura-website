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
import { Users, CreditCard, Calendar } from "lucide-react"

interface User {
  id: number;
  fullname: string;
  email: string;
  totalBookings: number;
  totalSpent: number;
}

interface UserResponse {
  data: {
    users: User[];
  };
  status: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token tidak ditemukan");
        }

        const response = await fetch("http://localhost:8080/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data pengguna");
        }

        const data: UserResponse = await response.json();
        setUsers(data.data.users);
        setStats({
          totalUsers: data.data.users.length,
          totalBookings: data.data.users.reduce((acc, user) => acc + user.totalBookings, 0),
          totalRevenue: data.data.users.reduce((acc, user) => acc + user.totalSpent, 0),
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat mengambil data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
        <h1 className="text-lg font-semibold">Users</h1>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Pengguna</CardTitle>
              <CardDescription>Jumlah pengguna terdaftar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-2xl font-bold">{stats.totalUsers}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Booking</CardTitle>
              <CardDescription>Jumlah booking keseluruhan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-2xl font-bold">{stats.totalBookings}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Pendapatan</CardTitle>
              <CardDescription>Total pendapatan dari semua pengguna</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Pengguna</CardTitle>
            <CardDescription>Semua pengguna yang terdaftar</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Total Booking</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.fullname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {user.totalBookings}
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
