import React, { useState } from 'react'

const ImageUpload = ({ image, updateImage }) => {
  const [error, setError] = useState(null)

  const handleImageCapture = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecciona un archivo de imagen válido.')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        updateImage(reader.result)
        setError(null)
      }
      reader.onerror = () => {
        setError('Error al leer el archivo. Por favor, intenta de nuevo.')
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {!image ? (
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tomar Foto con la Cámara
              </label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageCapture}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">o</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Seleccionar desde Galería
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageCapture}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <img
              src={image}
              alt="Preview"
              className="max-w-full mx-auto rounded-lg shadow-lg"
            />
            <div className="flex justify-center mt-4">
              <button
                onClick={() => updateImage(null)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Eliminar Foto
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageUpload
