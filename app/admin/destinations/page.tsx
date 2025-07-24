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
import { Pencil, Trash2, Plus, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

interface Facility {
  id: number;
  name: string;
  description: string | null;
}

interface Gallery {
  id: number;
  imageUrl: string;
  description: string | null;
}

interface Destination {
  id: number;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  price: number;
  quota: number;
  itinerary: string;
  facilities: Facility[];
  galleries: Gallery[];
  jumlahBooking: number;
  hargaDiskon: number | null;
  persentaseDiskon: number | null;
  promoId: number | null;
}

interface DestinationResponse {
  data: {
    destinations: Destination[];
  };
  status: string;
}

interface DestinationFormData {
  name: string;
  location: string;
  image: File | null;
  price: string;
  description: string;
  quota: string;
  itinerary: string;
}

interface Regency {
  id: number;
  name: string;
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [formData, setFormData] = useState<DestinationFormData>({
    name: "",
    location: "",
    image: null,
    price: "",
    description: "",
    quota: "",
    itinerary: "",
  });
  const router = useRouter();
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const fetchDestinations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/destination`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data destinasi");
      }

      const data: DestinationResponse = await response.json();
      setDestinations(data.data.destinations);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat mengambil data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/regencies/13.json")
      .then((response) => response.json())
      .then((data) => setRegencies(data))
      .catch((error) => console.error("Error fetching regencies:", error));
  }, []);

  const handleInputChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, location: e.target.value });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, location: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value);
        }
      });

      const url = isEditMode && selectedDestination
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/destinations/${selectedDestination.id}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/api/destinations`;

      const response = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan data destinasi");
      }

      toast.success(`Destinasi berhasil ${isEditMode ? "diperbarui" : "ditambahkan"}`);
      setIsDialogOpen(false);
      fetchDestinations();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan data");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus destinasi ini?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/destinations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus destinasi");
      }

      toast.success("Destinasi berhasil dihapus");
      fetchDestinations();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus data");
    }
  };

  const handleEdit = (destination: Destination) => {
    setSelectedDestination(destination);
    setFormData({
      name: destination.name,
      location: destination.location,
      image: null,
      price: destination.price.toString(),
      description: destination.description,
      quota: destination.quota.toString(),
      itinerary: destination.itinerary,
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

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
        <h1 className="text-lg font-semibold">Destinations</h1>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Daftar Destinasi</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setIsEditMode(false);
                setSelectedDestination(null);
                setFormData({
                  name: "",
                  location: "",
                  image: null,
                  price: "",
                  description: "",
                  quota: "",
                  itinerary: "",
                });
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Destinasi
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{isEditMode ? "Edit Destinasi" : "Tambah Destinasi"}</DialogTitle>
                <DialogDescription>
                  {isEditMode ? "Edit informasi destinasi" : "Tambahkan destinasi baru"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Destinasi</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Lokasi</Label>
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleSelectChange}
                      required
                      className="w-full border rounded p-2"
                    >
                      <option value="">Pilih Kabupaten/Kota</option>
                      {regencies.map((regency: Regency) => (
                        <option key={regency.id} value={regency.name}>
                          {regency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Gambar</Label>
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={!isEditMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Harga</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quota">Kuota</Label>
                    <Input
                      id="quota"
                      name="quota"
                      type="number"
                      value={formData.quota}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itinerary">Itinerary</Label>
                    <Textarea
                      id="itinerary"
                      name="itinerary"
                      value={formData.itinerary}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <DialogFooter className="sticky bottom-0 bg-background pt-4">
                  <Button type="submit">
                    {isEditMode ? "Simpan Perubahan" : "Tambah Destinasi"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Kuota</TableHead>
                  <TableHead>Booking</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {destinations.map((destination) => (
                  <TableRow key={destination.id}>
                    <TableCell>{destination.name}</TableCell>
                    <TableCell>{destination.location}</TableCell>
                    <TableCell>{formatCurrency(destination.price)}</TableCell>
                    <TableCell>{destination.quota}</TableCell>
                    <TableCell>{destination.jumlahBooking}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/destinations/${destination.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(destination)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(destination.id)}
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
