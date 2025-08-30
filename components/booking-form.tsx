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
  const [errorDetails, setErrorDetails] = useState("")
  const [retryCount, setRetryCount] = useState(0)
  const totalPrice = price * guests
  const { toast } = useToast()

  const handleDownload = async () => {
    setIsDownloading(true)
    setDownloadStatus('downloading')
    setDownloadProgress(0)
    setErrorDetails("")
    setRetryCount(prev => prev + 1)

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

      console.log('Memulai download APK...')
      
      const response = await fetch("https://altura.up.railway.app/api/apk/download", {
        headers: {
          'Accept': 'application/vnd.android.package-archive, application/octet-stream, */*',
          'Cache-Control': 'no-cache'
        }
      })
      
      console.log('Response status:', response.status, response.statusText)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorMsg = `HTTP ${response.status}: ${response.statusText}`
        setErrorDetails(errorMsg)
        throw new Error(errorMsg)
      }
      
      const blob = await response.blob()
      console.log('Blob info:', { size: blob.size, type: blob.type })
      
      if (blob.size === 0) {
        setErrorDetails("File yang diunduh kosong")
        throw new Error("File yang diunduh kosong")
      }
      
      // Selesaikan progress ke 100%
      if (progressInterval) clearInterval(progressInterval)
      setDownloadProgress(100)
      
      // Simulasi delay untuk menampilkan progress 100%
      setTimeout(() => {
        try {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = "Altura.apk"
          a.style.display = 'none'
          document.body.appendChild(a)
          a.click()
          a.remove()
          window.URL.revokeObjectURL(url)
          
          setDownloadStatus('completed')
          setRetryCount(0) // Reset retry count on success
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
        } catch (downloadError) {
          console.error('Error saat mendownload file:', downloadError)
          setErrorDetails("Gagal menyimpan file APK")
          throw new Error('Gagal menyimpan file APK')
        }
      }, 500)
      
    } catch (err) {
      if (progressInterval) clearInterval(progressInterval)
      
      let errorMessage = "Terjadi kesalahan saat mengunduh APK."
      
      if (err instanceof Error) {
        if (err.message.includes('HTTP')) {
          errorMessage = `Server error: ${err.message}`
        } else if (err.message.includes('File yang diunduh kosong')) {
          errorMessage = "File yang diunduh kosong. Silakan coba lagi."
        } else if (err.message.includes('Gagal menyimpan file APK')) {
          errorMessage = "Gagal menyimpan file APK. Periksa pengaturan browser."
        } else {
          errorMessage = err.message
        }
      }
      
      console.error('Download error:', err)
      setDownloadStatus('error')
      toast({
        title: "Gagal",
        description: errorMessage,
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
                {retryCount > 1 && (
                  <div className="text-xs text-orange-600 text-center">
                    Percobaan ke-{retryCount}
                  </div>
                )}
              </div>
            )}
            
            {downloadStatus === 'error' && errorDetails && (
              <div className="w-full p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="text-sm text-red-800 font-medium mb-1">
                  Detail Error:
                </div>
                <div className="text-xs text-red-600">
                  {errorDetails}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Tips: Cek koneksi internet, nonaktifkan popup blocker, atau coba browser lain
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
