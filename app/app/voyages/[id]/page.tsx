'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Voyage {
  id: string;
  vesselName: string;
  voyageNumber: string;
  departurePort: string;
  arrivalPort: string;
  departureDate: string;
  arrivalDate: string;
  status: string;
  cargoType?: string;
  cargoWeight?: number;
}

export default function VoyageDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [voyage, setVoyage] = useState<Voyage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoyage = async () => {
      try {
        const id = params?.id;
        if (!id) return;
        
        const response = await fetch(`/api/voyages/${id}`);
        if (response.ok) {
          const data = await response.json();
          setVoyage(data);
        }
      } catch (error) {
        console.error('Error fetching voyage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVoyage();
  }, [params]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Loading voyage details...</p>
        </div>
      </div>
    );
  }

  if (!voyage) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-center text-gray-500">Voyage not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg">
          <div className="border-b px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              {voyage.vesselName} - {voyage.voyageNumber}
            </h1>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-700">Vessel Name</p>
                  <p className="text-sm text-gray-500">{voyage.vesselName}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-700">Voyage Number</p>
                  <p className="text-sm text-gray-500">{voyage.voyageNumber}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-700">Departure Port</p>
                  <p className="text-sm text-gray-500">{voyage.departurePort}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-700">Arrival Port</p>
                  <p className="text-sm text-gray-500">{voyage.arrivalPort}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-700">Departure Date</p>
                  <p className="text-sm text-gray-500">
                    {new Date(voyage.departureDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-700">Arrival Date</p>
                  <p className="text-sm text-gray-500">
                    {new Date(voyage.arrivalDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                voyage.status === 'completed' ? 'bg-green-100 text-green-800' :
                voyage.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {voyage.status}
              </span>
            </div>

            {voyage.cargoType && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">Cargo Information</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="text-sm font-medium text-gray-900">{voyage.cargoType}</p>
                  </div>
                  {voyage.cargoWeight && (
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="text-sm font-medium text-gray-900">{voyage.cargoWeight} tons</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
