import React from 'react'
import { jsPDF } from 'jspdf'

const Summary = ({ formData, setActiveTab }) => {
  const { personalData, image, signature } = formData

  const generatePDF = () => {
    const doc = new jsPDF()
    
    // Añadir título
    doc.setFontSize(20)
    doc.text('Registro de Visita Médica', 20, 20)
    
    // Añadir datos personales
    doc.setFontSize(12)
    doc.text(`Nombre: ${personalData.nombre || ''}`, 20, 40)
    doc.text(`Apellidos: ${personalData.apellidos || ''}`, 20, 50)
    doc.text(`Edad: ${personalData.edad || ''}`, 20, 60)
    doc.text(`Fecha de Nacimiento: ${personalData.fechaNacimiento || ''}`, 20, 70)
    doc.text(`Motivo de la visita: ${personalData.motivo || ''}`, 20, 80)

    // Añadir imagen si existe
    if (image) {
      doc.addImage(image, 'JPEG', 20, 100, 80, 60)
    }

    // Añadir firma si existe
    if (signature) {
      doc.addImage(signature, 'PNG', 20, 170, 80, 40)
    }

    doc.save('registro-visita-medica.pdf')
  }

  const goToSection = (section) => {
    setActiveTab(section)
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Resumen de la Visita</h2>

        <div className="mb-6">
          <h3 className="font-bold mb-2">Datos Personales</h3>
          {!personalData?.nombre ? (
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
            <div>
              <p>Nombre: {personalData.nombre}</p>
              <p>Apellidos: {personalData.apellidos}</p>
              <p>Edad: {personalData.edad}</p>
              <p>Fecha de Nacimiento: {personalData.fechaNacimiento}</p>
              <p>Motivo: {personalData.motivo}</p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-2">Imagen</h3>
          {!image ? (
            <div className="text-red-500">
              ⚠️ Falta subir imagen
              <button
                onClick={() => goToSection('image')}
                className="ml-2 text-blue-500 underline"
              >
                Subir
              </button>
            </div>
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
          disabled={!personalData?.nombre || !image || !signature}
          className={`w-full py-2 px-4 rounded ${
            !personalData?.nombre || !image || !signature
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Generar PDF
        </button>
      </div>
    </div>
  )
}

export default Summary
