"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { Plus, Pencil, Trash2 } from "lucide-react"

interface Testimonial {
  id: number;
  fullname: string;
  rating: number;
  testimonial: string;
  created_at: string;
}

interface TestimonialResponse {
  data: {
    testimonials: {
      totalTestimonial: number;
      averageRating: number;
      allTestimonials: Testimonial[];
    };
  };
  status: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    fullname: "",
    rating: 5,
    testimonial: "",
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch("http://localhost:8080/api/admin/testimonial", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data testimonial");
      }

      const data: TestimonialResponse = await response.json();
      console.log("Response data:", data);

      if (!Array.isArray(data.data.testimonials.allTestimonials)) {
        console.error("Data yang diterima bukan array:", data.data);
        setTestimonials([]);
        return;
      }

      setTestimonials(data.data.testimonials.allTestimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat mengambil data");
      setTestimonials([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const url = isEditMode && selectedTestimonial
        ? `http://localhost:8080/api/admin/testimonial/${selectedTestimonial.id}`
        : "http://localhost:8080/api/admin/testimonial";

      const response = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Gagal ${isEditMode ? "mengubah" : "menambahkan"} testimonial`);
      }

      toast.success(`Testimonial berhasil ${isEditMode ? "diubah" : "ditambahkan"}`);
      setIsDialogOpen(false);
      fetchTestimonials();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan data");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus testimonial ini?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch(`http://localhost:8080/api/testimonials/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus testimonial");
      }

      toast.success("Testimonial berhasil dihapus");
      fetchTestimonials();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus data");
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setFormData({
      fullname: testimonial.fullname,
      rating: testimonial.rating,
      testimonial: testimonial.testimonial,
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedTestimonial(null);
    setFormData({
      fullname: "",
      rating: 5,
      testimonial: "",
    });
    setIsEditMode(false);
    setIsDialogOpen(true);
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
        <h1 className="text-lg font-semibold">Testimonials</h1>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Daftar Testimonial</h2>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Komentar</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell>{testimonial.fullname}</TableCell>
                    <TableCell>{testimonial.rating}/5</TableCell>
                    <TableCell className="max-w-md truncate">{testimonial.testimonial}</TableCell>
                    <TableCell>{formatDate(testimonial.created_at)}</TableCell>
                    <TableCell className="text-right">
                      {/* <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(testimonial)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button> */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(testimonial.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
