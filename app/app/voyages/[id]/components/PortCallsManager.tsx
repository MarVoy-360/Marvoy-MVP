"use client"

import { useState, useEffect } from 'react'

interface PortCall {
  id: string
  portName: string
  portCode: string | null
  country: string | null
  sequence: number
  eta: string | null
  etd: string | null
  status: string
}

interface Props {
  voyageId: string
  onUpdate?: () => void
}

export default function PortCallsManager({ voyageId, onUpdate }: Props) {
  const [portCalls, setPortCalls] = useState<PortCall[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    portName: '',
    portCode: '',
    country: '',
    sequence: 1,
    eta: '',
    etd: '',
    status: 'PLANNED'
  })

  useEffect(() => {
    fetchPortCalls()
  }, [voyageId])

  const fetchPortCalls = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/voyages/${voyageId}/port-calls`)
      const data = await res.json()
      setPortCalls(data.portCalls || [])
      
      // Set next sequence number
      if (data.portCalls && data.portCalls.length > 0) {
        const maxSeq = Math.max(...data.portCalls.map((p: PortCall) => p.sequence))
        setFormData(prev => ({ ...prev, sequence: maxSeq + 1 }))
      }
    } catch (error) {
      console.error('Error fetching port calls:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch(`/api/voyages/${voyageId}/port-calls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setShowForm(false)
        setFormData({
          portName: '',
          portCode: '',
          country: '',
          sequence: formData.sequence + 1,
          eta: '',
          etd: '',
          status: 'PLANNED'
        })
        await fetchPortCalls()
        if (onUpdate) onUpdate()
      }
    } catch (error) {
      console.error('Error creating port call:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNED': return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="animate-pulse p-8">Loading port calls...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Port Calls</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052A3] transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Port Call'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Port Call</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Port Name *</label>
                <input
                  type="text"
                  required
                  value={formData.portName}
                  onChange={(e) => setFormData({ ...formData, portName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC]"
                  placeholder="e.g., Rotterdam"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Port Code</label>
                <input
                  type="text"
                  value={formData.portCode}
                  onChange={(e) => setFormData({ ...formData, portCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC]"
                  placeholder="e.g., NLRTM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC]"
                  placeholder="e.g., Netherlands"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sequence *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.sequence}
                  onChange={(e) => setFormData({ ...formData, sequence: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ETA</label>
                <input
                  type="datetime-local"
                  value={formData.eta}
                  onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ETD</label>
                <input
                  type="datetime-local"
                  value={formData.etd}
                  onChange={(e) => setFormData({ ...formData, etd: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052A3]"
              >
                Add Port Call
              </button>
            </div>
          </form>
        </div>
      )}

      {portCalls.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No port calls added yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Port Call" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {portCalls.map((port) => (
            <div key={port.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-medium text-gray-400">#{port.sequence}</span>
                    <h4 className="text-lg font-semibold text-gray-900">{port.portName}</h4>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(port.status)}`}>
                      {port.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                    {port.portCode && <span>🏴 {port.portCode}</span>}
                    {port.country && <span>🌍 {port.country}</span>}
                    {port.eta && (
                      <span>📥 ETA: {new Date(port.eta).toLocaleDateString()}</span>
                    )}
                    {port.etd && (
                      <span>📤 ETD: {new Date(port.etd).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
