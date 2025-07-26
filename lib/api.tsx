import { API_BASE_URL, API_ENDPOINTS } from './config';

// Tipe data untuk response API
export interface TourPackageDiskon {
  promoId: number;
  idDestinasi: number;
  namaDestinasi: string;
  deskripsiDestinasi: string;
  hargaAsli: number;
  hargaDiskon: number;
  persentaseDiskon: number;
  jumlahBooking: number;
  gambarDestinasi: string;
  lokasiDestinasi: string;
}

export interface Destination {
  id: number;
  name: string;
  location: string;
  imageUrl: string;
  description: string;
  price: number;
  quota: number;
  itenary: string[];
  jumlahBooking: number;
  hargaDiskon: number | null;
  persentaseDiskon: number | null;
  promoId: number | null;
}

export interface DestinationDetail {
  id: number;
  nama: string;
  image: string;
  description: string;
  longDescription?: string;
  harga: number;
  jumlah_orang: number;
  lokasi: string;
  itenary: string[];
  facilities: Facility[];
  jumlahBooking: number;
  galleries: string[];
  highlights?: string[];
  groupSize?: string;
  hargaDiskon?: number | null; // tambahkan ini
  persentaseDiskon?: number | null; // jika perlu
  promoId?: number | null; // jika perlu
}

export interface Facility {
  id: number;
  name: string;
}

export interface Testimonial {
  id: number;
  testimonial: string;
  rating: number;
  userName: string;
  createdAt: string;
}

// Fungsi-fungsi untuk mengambil data
export async function getTourPackageDiskon(): Promise<TourPackageDiskon[]> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TOUR_PACKAGE_DISKON}`);
  const data = await response.json();
  return data.data.tourPackages;
}

export async function getTopDestinations(): Promise<Destination[]> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TOP_DESTINATIONS}`);
  const data = await response.json();
  return data.data.destinations;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TESTIMONIALS}`);
  const data = await response.json();
  return data.data.testimonials;
}

export async function getDestinationDetail(id: string): Promise<DestinationDetail> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.DESTINATION_DETAIL.replace(':id', id)}?t=${Date.now()}`, {
    cache: 'no-store',
  });

  const data = await response.json();

  if (data.data && data.data.destination) {
    const destination = data.data.destination;

    if (destination.image) {
      destination.image = destination.image.replace(/`/g, '').trim();
    }

    if (destination.galleries && Array.isArray(destination.galleries)) {
      destination.galleries = destination.galleries.map((gallery: string) =>
        gallery.replace(/`/g, '').trim()
      );
    }
  }
  
  return data.data.destination;
}


export async function getDestinations(params?: { location?: string; sortBy?: string; search?: string }): Promise<Destination[]> {
  const searchParams = new URLSearchParams();
  if (params?.location) searchParams.append('location', params.location);
  if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params?.search) searchParams.append('search', params.search);
  
  const response = await fetch(`${API_BASE_URL}/api/destinations?${searchParams.toString()}`);
  const data = await response.json();
  return data.data.destinations;
}

export async function getLocations(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/api/locations`);
  const data = await response.json();
  return data.data.locations;
}