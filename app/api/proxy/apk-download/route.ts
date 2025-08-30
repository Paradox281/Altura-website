import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Proxy APK download request started')
    
    const response = await fetch("https://altura.up.railway.app/api/apk/download", {
      headers: {
        'Accept': 'application/vnd.android.package-archive, application/octet-stream, */*',
        'Cache-Control': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      console.error('APK server error:', response.status, response.statusText)
      return NextResponse.json(
        { error: `Server error: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    // Get the blob from the APK server
    const blob = await response.blob()
    
    if (blob.size === 0) {
      console.error('APK file is empty')
      return NextResponse.json(
        { error: 'APK file is empty' },
        { status: 400 }
      )
    }

    console.log('APK file size:', blob.size, 'bytes')

    // Create response with proper headers
    const responseHeaders = new Headers()
    responseHeaders.set('Content-Type', 'application/vnd.android.package-archive')
    responseHeaders.set('Content-Length', blob.size.toString())
    responseHeaders.set('Content-Disposition', 'attachment; filename="Altura.apk"')
    responseHeaders.set('Access-Control-Allow-Origin', '*')
    responseHeaders.set('Access-Control-Allow-Methods', 'GET')
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type')

    // Return the APK file
    return new NextResponse(blob, {
      status: 200,
      headers: responseHeaders
    })

  } catch (error) {
    console.error('Proxy APK download error:', error)
    return NextResponse.json(
      { error: 'Failed to download APK' },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  // Handle preflight request
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
