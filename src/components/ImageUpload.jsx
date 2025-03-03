import React, { useState, useRef, useEffect } from 'react'

const ImageUpload = ({ image, updateImage }) => {
  const [showCamera, setShowCamera] = useState(false)
  const [error, setError] = useState(null)
  const [isCameraAvailable, setIsCameraAvailable] = useState(true)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  // Comprobar disponibilidad de cámara al cargar el componente
  useEffect(() => {
    checkCameraAvailability()
    // Limpiar recursos al desmontar
    return () => {
      stopCamera()
    }
  }, [])

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const hasCamera = devices.some(device => device.kind === 'videoinput')
      setIsCameraAvailable(hasCamera)
      if (!hasCamera) {
        setError('No se detectó ninguna cámara en el dispositivo.')
      }
    } catch (err) {
      console.error('Error al verificar la cámara:', err)
      setIsCameraAvailable(false)
      setError('No se pudo verificar la disponibilidad de la cámara.')
    }
  }

  const startCamera = async () => {
    try {
      setError(null)
      
      // Comprobar si el navegador soporta getUserMedia
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Tu navegador no soporta el acceso a la cámara.')
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setShowCamera(true)
      }
    } catch (err) {
      console.error('Error al acceder a la cámara:', err)
      let errorMessage = 'Error al acceder a la cámara. '

      switch (err.name) {
        case 'NotAllowedError':
          errorMessage += 'Por favor, permite el acceso a la cámara en tu navegador.'
          break
        case 'NotFoundError':
          errorMessage += 'No se encontró ninguna cámara en el dispositivo.'
          break
        case 'NotReadableError':
          errorMessage += 'La cámara está siendo utilizada por otra aplicación.'
          break
        default:
          errorMessage += 'Por favor, intenta de nuevo o utiliza la opción de subir imagen.'
      }

      setError(errorMessage)
      setShowCamera(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop()
      })
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setShowCamera(false)
  }

  const takePhoto = () => {
    if (!videoRef.current) return

    try {
      const video = videoRef.current
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      const photoUrl = canvas.toDataURL('image/jpeg', 0.8)
      updateImage(photoUrl)
      stopCamera()
    } catch (err) {
      console.error('Error al capturar la foto:', err)
      setError('Error al capturar la foto. Por favor, intenta de nuevo.')
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecciona un archivo de imagen válido.')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        updateImage(reader.result)
      }
      reader.onerror = () => {
        setError('Error al leer el archivo. Por favor, intenta con otra imagen.')
      }
      reader.readAsDataURL(file)
    }
  }

  const skipPhoto = () => {
    updateImage(null)
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right text-red-700 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        )}

        {!showCamera && !image && (
          <div className="space-y-4">
            {isCameraAvailable && (
              <>
                <button
                  onClick={startCamera}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium shadow-sm transition-colors"
                >
                  Tomar Foto con Cámara
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">o</span>
                  </div>
                </div>
              </>
            )}

            <label className="block w-full">
              <span className="sr-only">Seleccionar archivo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-3 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  file:w-full"
              />
            </label>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">o</span>
              </div>
            </div>

            <button
              onClick={skipPhoto}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium shadow-sm transition-colors"
            >
              Continuar sin Foto
            </button>
          </div>
        )}

        {showCamera && (
          <div className="space-y-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  videoRef.current.play()
                }
              }}
            />
            <div className="flex space-x-2">
              <button
                onClick={takePhoto}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                Capturar Foto
              </button>
              <button
                onClick={stopCamera}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {image && !showCamera && (
          <div className="space-y-4">
            <img
              src={image}
              alt="Preview"
              className="max-w-full mx-auto rounded-lg shadow-lg"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  updateImage(null)
                  setShowCamera(false)
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Eliminar Foto
              </button>
              <button
                onClick={startCamera}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Tomar Nueva Foto
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageUpload
