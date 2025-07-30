"use client"

import { useState } from "react"
import { Calendar, Users, Download, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
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
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'completed' | 'error'>('idle')
  const totalPrice = price * guests
  const { toast } = useToast()

  const handleDownload = async () => {
    setIsDownloading(true)
    setDownloadStatus('downloading')
    setDownloadProgress(0)

    let progressInterval: NodeJS.Timeout | null = null

    try {
      // Simulasi progress download
      progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            if (progressInterval) clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 15
        })
      }, 200)

      const response = await fetch("https://altura.up.railway.app/api/apk/download")
      if (!response.ok) throw new Error("Gagal mengunduh APK")
      
      const blob = await response.blob()
      
      // Selesaikan progress ke 100%
      if (progressInterval) clearInterval(progressInterval)
      setDownloadProgress(100)
      
      // Simulasi delay untuk menampilkan progress 100%
      setTimeout(() => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "Altura.apk"
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
        
        setDownloadStatus('completed')
        toast({
          title: "Berhasil",
          description: "APK berhasil diunduh.",
        })
        
        // Reset state setelah 3 detik
        setTimeout(() => {
          setIsDownloading(false)
          setDownloadProgress(0)
          setDownloadStatus('idle')
        }, 3000)
      }, 500)
      
    } catch (err) {
      if (progressInterval) clearInterval(progressInterval)
      setDownloadStatus('error')
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat mengunduh APK.",
      })
      
      // Reset state setelah 3 detik
      setTimeout(() => {
        setIsDownloading(false)
        setDownloadProgress(0)
        setDownloadStatus('idle')
      }, 3000)
    }
  }

  const getDownloadButtonContent = () => {
    if (downloadStatus === 'downloading') {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Mengunduh... {Math.round(downloadProgress)}%
        </>
      )
    } else if (downloadStatus === 'completed') {
      return (
        <>
          <CheckCircle className="mr-2 h-4 w-4" />
          Download Selesai!
        </>
      )
    } else if (downloadStatus === 'error') {
      return (
        <>
          <Download className="mr-2 h-4 w-4" />
          Coba Lagi
        </>
      )
    } else {
      return (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download APK
        </>
      )
    }
  }

  const getButtonClassName = () => {
    if (downloadStatus === 'downloading') {
      return "bg-blue-600 hover:bg-blue-700 w-full cursor-not-allowed"
    } else if (downloadStatus === 'completed') {
      return "bg-green-600 hover:bg-green-700 w-full"
    } else if (downloadStatus === 'error') {
      return "bg-red-600 hover:bg-red-700 w-full"
    } else {
      return "bg-green-600 hover:bg-green-700 w-full"
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
            {isDownloading && (
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress Download:</span>
                  <span>{Math.round(downloadProgress)}%</span>
                </div>
                <Progress value={downloadProgress} className="w-full" />
                <div className="text-xs text-gray-500 text-center">
                  {downloadStatus === 'downloading' && "Mengunduh file APK..."}
                  {downloadStatus === 'completed' && "File berhasil diunduh!"}
                  {downloadStatus === 'error' && "Gagal mengunduh file"}
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleDownload} 
              className={getButtonClassName()}
              disabled={downloadStatus === 'downloading'}
            >
              {getDownloadButtonContent()}
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
