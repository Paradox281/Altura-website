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
import {
  Tabs, TabsList, TabsTrigger, TabsContent
} from "@/components/ui/tabs"
import { QRCodeCanvas } from "qrcode.react"
interface BookingFormProps {
  destinationId: number
  price: number
}

export default function BookingForm({ destinationId, price }: BookingFormProps) {
  const [guests, setGuests] = useState(1)
  const [selectedDate, setSelectedDate] = useState("")
  const totalPrice = price * guests

  return (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Book Now
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Pilih metode pemesanan atau pelajari cara menggunakan aplikasi.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="scan" className="mt-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="scan">Scan & Deep Link</TabsTrigger>
              <TabsTrigger value="tutorial">Tutorial Expo</TabsTrigger>
            </TabsList>

            <TabsContent value="scan" className="mt-4 space-y-4">
              <div className="text-center">
                <p>Silakan scan barcode berikut di aplikasi Expo Go:</p>
                <div className="flex justify-center items-center">
                  <QRCodeCanvas value="exp://192.168.1.6:8081" size={200} />
                </div>
                <p className="text-sm mt-2 text-gray-600">
                  atau klik link berikut untuk membuka langsung:
                </p>
                <a
                  href="exp://example.com"
                  className="text-blue-500 underline"
                  target="_blank"
                >
                  Buka dengan Expo
                </a>
              </div>
            </TabsContent>

            <TabsContent value="tutorial" className="mt-4 space-y-2">
            <div className="flex justify-center">
              <img src="https://i.pinimg.com/originals/e4/af/9f/e4af9f0025a8ce68bee2cf5a1360a501.gif" className="w-[200px] h-[200px]" />
            </div>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 mt-2">
                <li>Install aplikasi Expo Go dari Play Store / App Store</li>
                <li>Buka aplikasi dan pilih opsi "Scan QR Code"</li>
                <li>Scan barcode di tab pertama</li>
                <li>Aplikasi akan terbuka otomatis di perangkat Anda</li>
              </ol>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <p className="text-xs text-gray-500 text-center">
        Free cancellation up to 24 hours before the trip
      </p>
    </div>
  )
}
