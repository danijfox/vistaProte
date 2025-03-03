import React, { useState } from 'react'
import { jsPDF } from 'jspdf'

const Summary = ({ formData, setActiveTab }) => {
  const { personalData, image, signature } = formData
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const resetForm = () => {
    // Reiniciar al estado inicial
    window.location.reload()
  }

  const generatePDF = async () => {
    try {
      setIsGenerating(true)
      setError(null)

      // Crear nuevo documento PDF
      const doc = new jsPDF()
      
      // Configurar fuente para caracteres españoles
      doc.setFont('helvetica')
      
      // Título
      doc.setFontSize(20)
      doc.text('Registro de Visita Médica', 20, 20)
      
      // Datos personales
      doc.setFontSize(12)
      let yPos = 40
      
      const addText = (text, y) => {
        doc.text(text, 20, y)
        return y + 10
      }

      yPos = addText(`Nombre: ${personalData.nombre || ''}`, yPos)
      yPos = addText(`Apellidos: ${personalData.apellidos || ''}`, yPos)
      yPos = addText(`Edad: ${personalData.edad || ''}`, yPos)
      yPos = addText(`Fecha de Nacimiento: ${personalData.fechaNacimiento || ''}`, yPos)
      
      // Motivo de la visita (con saltos de línea si es necesario)
      if (personalData.motivo) {
        yPos = addText('Motivo de la visita:', yPos)
        const motivo = doc.splitTextToSize(personalData.motivo, 170)
        doc.text(motivo, 20, yPos)
        yPos += (motivo.length * 7)
      }

      // Añadir imagen si existe
      if (image) {
        try {
          doc.addImage(image, 'JPEG', 20, yPos, 80, 60)
          yPos += 70
        } catch (e) {
          console.error('Error al añadir la imagen:', e)
        }
      }

      // Añadir firma si existe
      if (signature) {
        try {
          doc.addImage(signature, 'PNG', 20, yPos, 80, 40)
        } catch (e) {
          console.error('Error al añadir la firma:', e)
        }
      }

      // Guardar el PDF
      doc.save('registro-visita-medica.pdf')
      setIsGenerating(false)
      setShowSuccess(true)
    } catch (err) {
      console.error('Error al generar PDF:', err)
      setError('Error al generar el PDF. Por favor, inténtelo de nuevo.')
      setIsGenerating(false)
    }
  }

  const goToSection = (section) => {
    setActiveTab(section)
  }

  // Validar campos obligatorios
  const isFormValid = () => {
    return (
      personalData?.nombre && 
      personalData?.apellidos && 
      personalData?.edad && 
      personalData?.fechaNacimiento && 
      personalData?.motivo && 
      signature
    )
  }

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ¡PDF Generado con Éxito!
          </h2>
          
          <p className="text-gray-600 mb-8">
            El registro de la visita médica se ha descargado correctamente en su dispositivo.
          </p>

          <div className="space-y-4">
            <button
              onClick={resetForm}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium shadow-sm transition-colors"
            >
              Iniciar Nuevo Registro
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Resumen de la Visita</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <h3 className="font-bold mb-2">Datos Personales</h3>
          {!personalData?.nombre || 
           !personalData?.apellidos || 
           !personalData?.edad || 
           !personalData?.fechaNacimiento || 
           !personalData?.motivo ? (
            <div className="text-red-500">
              ⚠️ Falta completar datos personales
              <button
                onClick={() => goToSection('personal')}
                className="ml-2 text-blue-500 underline"
              >
                Completar
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 p-3 rounded">
              <p><span className="font-semibold">Nombre:</span> {personalData.nombre}</p>
              <p><span className="font-semibold">Apellidos:</span> {personalData.apellidos}</p>
              <p><span className="font-semibold">Edad:</span> {personalData.edad}</p>
              <p><span className="font-semibold">Fecha de Nacimiento:</span> {personalData.fechaNacimiento}</p>
              <p><span className="font-semibold">Motivo:</span> {personalData.motivo}</p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-2">Imagen (Opcional)</h3>
          {!image ? (
            <p className="text-gray-500 italic">No se ha incluido imagen</p>
          ) : (
            <img src={image} alt="Uploaded" className="w-32 h-32 object-cover rounded" />
          )}
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-2">Firma</h3>
          {!signature ? (
            <div className="text-red-500">
              ⚠️ Falta firma
              <button
                onClick={() => goToSection('signature')}
                className="ml-2 text-blue-500 underline"
              >
                Firmar
              </button>
            </div>
          ) : (
            <img src={signature} alt="Signature" className="w-32 h-16 object-contain" />
          )}
        </div>

        <button
          onClick={generatePDF}
          disabled={!isFormValid() || isGenerating}
          className={`w-full py-2 px-4 rounded flex items-center justify-center ${
            !isFormValid() || isGenerating
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generando PDF...
            </>
          ) : (
            'Generar PDF'
          )}
        </button>
      </div>
    </div>
  )
}

export default Summary
