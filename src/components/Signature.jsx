import React, { useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'

const Signature = ({ signature, updateSignature }) => {
  const sigPad = useRef(null)

  const clear = () => {
    sigPad.current.clear()
  }

  const save = () => {
    if (!sigPad.current.isEmpty()) {
      const signatureData = sigPad.current.toDataURL()
      updateSignature(signatureData)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Firma
          </label>
          <div className="border border-gray-300 rounded">
            <SignatureCanvas
              ref={sigPad}
              canvasProps={{
                className: 'w-full h-64'
              }}
            />
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={clear}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Limpiar
          </button>
          <button
            onClick={save}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Guardar
          </button>
        </div>

        {signature && (
          <div className="mt-4">
            <p className="text-green-600 font-semibold">✓ Firma guardada</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Signature
