"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info, AlertCircle, CheckCircle, XCircle } from "lucide-react"

export default function DebugInfo() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkAPKEndpoint = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("https://altura.up.railway.app/api/apk/download", {
        method: 'HEAD',
        headers: {
          'Accept': 'application/vnd.android.package-archive, application/octet-stream, */*',
          'Cache-Control': 'no-cache'
        }
      })

      const info = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        ok: response.ok,
        url: response.url,
        timestamp: new Date().toISOString()
      }

      setDebugInfo(info)
    } catch (error) {
      setDebugInfo({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = () => {
    if (!debugInfo) return <Info className="h-4 w-4" />
    if (debugInfo.error) return <XCircle className="h-4 w-4 text-red-500" />
    if (debugInfo.ok) return <CheckCircle className="h-4 w-4 text-green-500" />
    return <AlertCircle className="h-4 w-4 text-yellow-500" />
  }

  const getStatusColor = () => {
    if (!debugInfo) return "bg-gray-100 text-gray-800"
    if (debugInfo.error) return "bg-red-100 text-red-800"
    if (debugInfo.ok) return "bg-green-100 text-green-800"
    return "bg-yellow-100 text-yellow-800"
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getStatusIcon()}
            Debug Info - APK Download
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Sembunyikan" : "Tampilkan"}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={checkAPKEndpoint}
            disabled={isLoading}
            size="sm"
            variant="outline"
          >
            {isLoading ? "Checking..." : "Check APK Endpoint"}
          </Button>
          
          {debugInfo && (
            <Badge className={getStatusColor()}>
              {debugInfo.error ? "Error" : debugInfo.ok ? "OK" : `HTTP ${debugInfo.status}`}
            </Badge>
          )}
        </div>

        {isExpanded && debugInfo && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-md">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Status:</span> {debugInfo.status}
              </div>
              <div>
                <span className="font-medium">Status Text:</span> {debugInfo.statusText}
              </div>
              <div>
                <span className="font-medium">OK:</span> {debugInfo.ok ? "Yes" : "No"}
              </div>
              <div>
                <span className="font-medium">Timestamp:</span> {new Date(debugInfo.timestamp).toLocaleString()}
              </div>
            </div>

            {debugInfo.headers && (
              <div>
                <div className="font-medium text-sm mb-2">Response Headers:</div>
                <div className="space-y-1 text-xs">
                  {Object.entries(debugInfo.headers).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-mono">{key}:</span>
                      <span className="font-mono text-gray-600">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {debugInfo.error && (
              <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                <div className="font-medium">Error:</div>
                <div className="font-mono">{debugInfo.error}</div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-600">
          <div className="font-medium mb-1">Tips untuk mengatasi masalah download:</div>
          <ul className="list-disc list-inside space-y-1">
            <li>Pastikan koneksi internet stabil</li>
            <li>Nonaktifkan popup blocker di browser</li>
            <li>Coba browser yang berbeda</li>
            <li>Periksa pengaturan keamanan browser</li>
            <li>Pastikan ada ruang penyimpanan yang cukup</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
