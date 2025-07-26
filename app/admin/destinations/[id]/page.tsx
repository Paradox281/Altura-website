"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ArrowLeft, Calendar, MapPin, Users, Tag, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DestinationPromo {
  id: number;
  namaPromo: string;
  discount: number;
  tanggalMulai: string;
  tanggalBerakhir: string;
  hargaDiskon: number;
}

interface DestinationFacility {
  id: number;
  facility: string;
}

interface GalleryImage {
  id: number;
  url: string;
}

interface DestinationDetail {
  destination: {
    id: number;
    name: string;
    description: string;
    location: string;
    image: string;
    price: number;
    quota: number;
  };
  destinationPromos: DestinationPromo[];
  destinationFacilities: DestinationFacility[];
  galleryImages: GalleryImage[];
}

interface DestinationResponse {
  data: {
    destination: DestinationDetail;
  };
  status: string;
}

interface Facility {
  id: number;
  name: string;
}

interface FacilityResponse {
  data: {
    facilities: Facility[];
  };
  status: string;
}

export default function DestinationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [destination, setDestination] = useState<DestinationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isPromoDialogOpen, setIsPromoDialogOpen] = useState(false);
  const [isFacilityDialogOpen, setIsFacilityDialogOpen] = useState(false);
  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [promoForm, setPromoForm] = useState({
    nama_diskon: "",
    deskripsi: "",
    hargaDiskon: "",
    hargaSetelahDiskon: "",
    persentase_diskon: "",
    tanggal_mulai: "",
    tanggal_berakhir: "",
  });

  const fetchDestinationDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/manage/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil detail destinasi");
      }

      const data: DestinationResponse = await response.json();
      setDestination(data.data.destination);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat mengambil data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinationDetail();
  }, [params.id]);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token tidak ditemukan");
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/facilitas`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data fasilitas");
        }

        const data: FacilityResponse = await response.json();
        setFacilities(data.data.facilities);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat mengambil data fasilitas");
      }
    };

    fetchFacilities();
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

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/promo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_destinasi: parseInt(params.id),
          ...promoForm,
          hargaDiskon: parseInt(promoForm.hargaDiskon),
          persentase_diskon: parseInt(promoForm.persentase_diskon),
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan promo");
      }

      toast.success("Promo berhasil ditambahkan");
      setIsPromoDialogOpen(false);
      fetchDestinationDetail();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat menambahkan promo");
    }
  };

  const handleFacilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/facility-destinations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idFacilitas: parseInt(selectedFacility),
          idDestinasi: parseInt(params.id),
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan fasilitas");
      }

      toast.success("Fasilitas berhasil ditambahkan");
      setIsFacilityDialogOpen(false);
      fetchDestinationDetail();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat menambahkan fasilitas");
    }
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      toast.error("Pilih gambar terlebih dahulu");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("destinationId", params.id);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gallery/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Gagal mengunggah gambar");
      }

      toast.success("Gambar berhasil diunggah");
      setIsGalleryDialogOpen(false);
      setSelectedImage(null);
      fetchDestinationDetail();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat mengunggah gambar");
    }
  };

  // Tambahkan fungsi untuk menghitung harga diskon
  const calculateDiscountedPrice = (price: number, discountPercentage: number) => {
    const hargaDiskon = price * (discountPercentage / 100);
    const hargaSetelahDiskon = price - hargaDiskon;
    return {
      hargaDiskon,
      hargaSetelahDiskon
    };
  };

  // Tambahkan useEffect untuk menghitung harga diskon otomatis
  useEffect(() => {
    if (destination && promoForm.persentase_diskon) {
      const hargaPromo = destination.destination.price;
      const persentaseDiskon = parseInt(promoForm.persentase_diskon);
      const { hargaDiskon, hargaSetelahDiskon } = calculateDiscountedPrice(hargaPromo, persentaseDiskon);
      setPromoForm(prev => ({ 
        ...prev, 
        hargaDiskon: hargaDiskon.toString(),
        hargaSetelahDiskon: hargaSetelahDiskon.toString()
      }));
    }
  }, [promoForm.persentase_diskon, destination]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Memuat data...</p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Destinasi tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold">Detail Destinasi</h1>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Informasi Utama */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Utama</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <img
                  src={destination.destination.image}
                  alt={destination.destination.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{destination.destination.name}</h2>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {destination.destination.location}
                </div>
                <p className="text-muted-foreground">{destination.destination.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Harga</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(destination.destination.price)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Kuota</p>
                  <p className="text-lg font-semibold">{destination.destination.quota} orang</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fasilitas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Fasilitas</CardTitle>
              <Dialog open={isFacilityDialogOpen} onOpenChange={setIsFacilityDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Fasilitas
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Fasilitas</DialogTitle>
                    <DialogDescription>
                      Pilih fasilitas untuk ditambahkan ke destinasi ini
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleFacilitySubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="facility">Fasilitas</Label>
                      <Select value={selectedFacility} onValueChange={setSelectedFacility}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih fasilitas" />
                        </SelectTrigger>
                        <SelectContent>
                          {facilities.map((facility) => (
                            <SelectItem key={facility.id} value={facility.id.toString()}>
                              {facility.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Tambah Fasilitas</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {destination.destinationFacilities.map((facility) => (
                  <div
                    key={facility.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted"
                  >
                    <Tag className="h-4 w-4" />
                    <span>{facility.facility}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Promo */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Promo Aktif</CardTitle>
              <Dialog open={isPromoDialogOpen} onOpenChange={setIsPromoDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Promo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Tambah Promo</DialogTitle>
                    <DialogDescription>
                      Tambahkan promo baru untuk destinasi ini
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handlePromoSubmit} className="space-y-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nama_diskon">Nama Promo</Label>
                        <Input
                          id="nama_diskon"
                          value={promoForm.nama_diskon}
                          onChange={(e) => setPromoForm(prev => ({ ...prev, nama_diskon: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deskripsi">Deskripsi</Label>
                        <Input
                          id="deskripsi"
                          value={promoForm.deskripsi}
                          onChange={(e) => setPromoForm(prev => ({ ...prev, deskripsi: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="persentase_diskon">Persentase Diskon (%)</Label>
                        <Input
                          id="persentase_diskon"
                          type="number"
                          value={promoForm.persentase_diskon}
                          onChange={(e) => setPromoForm(prev => ({ ...prev, persentase_diskon: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hargaDiskon">Harga Diskon</Label>
                        <Input
                          id="hargaDiskon"
                          type="number"
                          value={promoForm.hargaDiskon}
                          readOnly
                          className="bg-muted"
                        />
                        <p className="text-sm text-muted-foreground">
                          Harga diskon = Harga Awal × (Persentase Diskon / 100)
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hargaSetelahDiskon">Harga Setelah Diskon</Label>
                        <Input
                          id="hargaSetelahDiskon"
                          type="number"
                          value={promoForm.hargaSetelahDiskon}
                          readOnly
                          className="bg-muted"
                        />
                        <p className="text-sm text-muted-foreground">
                          Harga setelah diskon = Harga Awal - Harga Diskon
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                        <Input
                          id="tanggal_mulai"
                          type="datetime-local"
                          value={promoForm.tanggal_mulai}
                          onChange={(e) => setPromoForm(prev => ({ ...prev, tanggal_mulai: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tanggal_berakhir">Tanggal Berakhir</Label>
                        <Input
                          id="tanggal_berakhir"
                          type="datetime-local"
                          value={promoForm.tanggal_berakhir}
                          onChange={(e) => setPromoForm(prev => ({ ...prev, tanggal_berakhir: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter className="sticky bottom-0 bg-background pt-4">
                      <Button type="submit">Tambah Promo</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {destination.destinationPromos.map((promo) => (
                  <div
                    key={promo.id}
                    className="p-4 rounded-lg border bg-muted/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{promo.namaPromo}</h3>
                      <span className="text-sm font-medium text-green-600">
                        Diskon {promo.discount}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(promo.tanggalMulai)} - {formatDate(promo.tanggalBerakhir)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Galeri */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Galeri</CardTitle>
              <Dialog open={isGalleryDialogOpen} onOpenChange={setIsGalleryDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Gambar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Gambar</DialogTitle>
                    <DialogDescription>
                      Unggah gambar baru ke galeri destinasi ini
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleGallerySubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image">Gambar</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                        required
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit">Unggah Gambar</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {destination.galleryImages.map((image) => (
                  <div
                    key={image.id}
                    className="aspect-video relative overflow-hidden rounded-lg"
                  >
                    <img
                      src={image.url}
                      alt={`Gallery ${image.id}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
