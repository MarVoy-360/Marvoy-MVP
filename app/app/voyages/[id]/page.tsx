"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import PortCallsManager from './components/PortCallsManager'
import Link from 'next/link'

interface Voyage {
  id: string
  voyageNumber: string
  vesselName: string
  vesselIMO: string | null
  status: string
  createdAt: string
  portCalls: PortCall[]
  cargos: Cargo[]
  charterParties: CharterParty[]
  createdBy: {
    name: string | null
    email: string
  }
}

interface PortCall {
  id: string
  portName: string
  portCode: string | null
  country: string | null
  sequence: number
  eta: string | null
  etd: string | null
  status: string
  activities: any[]
  cargoLoads: any[]
  cargoDischarges: any[]
}

interface Cargo {
  id: string
  cargoName: string
  quantity: number
  unit: string
  status: string
  loadPort: any
  dischargePort: any
}

interface CharterParty {
  id: string
  cpNumber: string
  cpType: string
  charterer: string
  laycanType: string
  laytimeAllowed: number | null
  demurrageRate: number | null
  despatchRate: number | null
  calculations: any[]
}

export default function VoyageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [voyage, setVoyage] = useState<Voyage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'ports' | 'cargos' | 'charter'>('overview')

  useEffect(() => {
    if (params.id) {
      fetchVoyage()
    }
  }, [params.id])

  const fetchVoyage = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/voyages/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch voyage')
      }

      const data = await response.json()
      setVoyage(data.voyage)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ESTIMATE':
        return 'bg-blue-100 text-blue-800'
      case 'ACTUAL':
        return 'bg-green-100 text-green-800'
      case 'FROZEN':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="space-y-4">
                <div className="h-20 bg-gray-100 rounded"></div>
                <div className="h-40 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !voyage) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error: {error || 'Voyage not found'}</p>
            <Link href="/app/voyages" className="text-red-600 hover:underline mt-2 inline-block">
              ← Back to Voyages
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/app/voyages"
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">{voyage.voyageNumber}</h1>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(voyage.status)}`}>
                    {voyage.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {voyage.vesselName} {voyage.vesselIMO && `• ${voyage.vesselIMO}`}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/app/voyages/${voyage.id}/edit`}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Edit
              </Link>
              <button
                className="px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052A3]"
              >
                Calculate Laytime
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {['overview', 'ports', 'cargos', 'charter'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-[#0066CC] text-[#0066CC]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-sm font-medium text-gray-500">Port Calls</div>
                <div className="mt-2 text-3xl font-bold text-gray-900">{voyage.portCalls.length}</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-sm font-medium text-gray-500">Cargos</div>
                <div className="mt-2 text-3xl font-bold text-gray-900">{voyage.cargos.length}</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-sm font-medium text-gray-500">Charter Parties</div>
                <div className="mt-2 text-3xl font-bold text-gray-900">{voyage.charterParties.length}</div>
              </div>
            </div>

            {/* Port Calls Summary */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Port Rotation</h2>
                <button className="text-sm text-[#0066CC] hover:text-[#0052A3]">
                  + Add Port
                </button>
              </div>
              {voyage.portCalls.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No port calls added yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {voyage.portCalls.map((port) => (
                    <div key={port.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          {port.sequence}. {port.portName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {port.country} {port.portCode && `• ${port.portCode}`}
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {port.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Voyage Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Voyage Info</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Created By</div>
                  <div className="text-sm font-medium text-gray-900">
                    {voyage.createdBy.name || voyage.createdBy.email}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Created At</div>
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(voyage.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ports' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Port Calls</h2>
              <button className="px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052A3]">
                + Add Port Call
              </button>
            </div>
            <PortCallsManager voyageId={params.id as string} onUpdate={fetchVoyage} />
          </div>
        )}

        {activeTab === 'cargos' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Cargos</h2>
              <button className="px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052A3]">
                + Add Cargo
              </button>
            </div>
            <p className="text-gray-500 text-center py-8">Cargo management UI coming soon...</p>
          </div>
        )}

        {activeTab === 'charter' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Charter Party</h2>
              <button className="px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052A3]">
                + Add Charter Party
              </button>
            </div>
            <p className="text-gray-500 text-center py-8">Charter party details coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}
