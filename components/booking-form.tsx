"use client"

import { useState } from "react"
import { Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
interface BookingFormProps {
  destinationId: number
  price: number
}

export default function BookingForm({ destinationId, price }: BookingFormProps) {
  const [guests, setGuests] = useState(1)
  const [selectedDate, setSelectedDate] = useState("")
  const totalPrice = price * guests
  const { toast } = useToast()

  const handleDownload = async () => {
    try {
      const response = await fetch("https://altura.up.railway.app/api/apk/download")
      if (!response.ok) throw new Error("Gagal mengunduh APK")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "Altura.apk"
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      toast({
        title: "Berhasil",
        description: "APK berhasil diunduh.",
      })
    } catch (err) {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat mengunduh APK.",
      })
    }
  }

  return (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Pesan Sekarang
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Download Aplikasi Altura</DialogTitle>
            <DialogDescription>
              Klik tombol di bawah untuk mengunduh file APK aplikasi Altura.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 mt-6">
            <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 w-full">
              Download APK
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <p className="text-xs text-gray-500 text-center">
        Free cancellation up to 24 hours before the trip
      </p>
    </div>
  )
}
