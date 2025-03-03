import { useState } from 'react'
import PersonalData from './components/PersonalData.jsx'
import ImageUpload from './components/ImageUpload.jsx'
import Signature from './components/Signature.jsx'
import Summary from './components/Summary.jsx'
import TabNavigation from './components/TabNavigation.jsx'

function App() {
  const [activeTab, setActiveTab] = useState('personal')
  const [formData, setFormData] = useState({
    personalData: {},
    image: null,
    signature: null
  })

  const tabs = [
    { id: 'personal', label: 'Datos Personales' },
    { id: 'image', label: 'Imagen' },
    { id: 'signature', label: 'Firma' },
    { id: 'summary', label: 'Resumen' }
  ]

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Registro de Visitas Médicas
      </h1>
      
      <TabNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <div className="mt-6">
        {activeTab === 'personal' && (
          <PersonalData 
            data={formData.personalData} 
            updateData={(data) => updateFormData('personalData', data)} 
          />
        )}
        {activeTab === 'image' && (
          <ImageUpload 
            image={formData.image} 
            updateImage={(data) => updateFormData('image', data)} 
          />
        )}
        {activeTab === 'signature' && (
          <Signature 
            signature={formData.signature} 
            updateSignature={(data) => updateFormData('signature', data)} 
          />
        )}
        {activeTab === 'summary' && (
          <Summary 
            formData={formData} 
            setActiveTab={setActiveTab}
          />
        )}
      </div>
    </div>
  )
}

export default App
