"use client";

import { useState, useEffect } from "react";
import { Cargo } from "@prisma/client";

interface CargosManagerProps {
  voyageId: string;
}

export default function CargosManager({ voyageId }: CargosManagerProps) {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    cargoName: "",
    quantity: "",
    unit: "MT",
    cargoType: "BULK",
    loadPortId: "",
    dischargePortId: "",
    charterPartyId: "",
  });

  useEffect(() => {
    fetchCargos();
  }, [voyageId]);

  const fetchCargos = async () => {
    try {
      const response = await fetch(`/api/voyages/${voyageId}/cargos`);
      if (response.ok) {
        const data = await response.json();
        setCargos(data);
      }
    } catch (error) {
      console.error("Failed to fetch cargos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/voyages/${voyageId}/cargos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          quantity: parseFloat(formData.quantity),
        }),
      });

      if (response.ok) {
        await fetchCargos();
        setIsFormOpen(false);
        setFormData({
          cargoName: "",
          quantity: "",
          unit: "MT",
          cargoType: "BULK",
          loadPortId: "",
          dischargePortId: "",
          charterPartyId: "",
        });
      }
    } catch (error) {
      console.error("Failed to create cargo:", error);
    }
  };

  const handleDelete = async (cargoId: string) => {
    if (!confirm("Are you sure you want to delete this cargo?")) return;

    try {
      const response = await fetch(`/api/voyages/${voyageId}/cargos`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cargoId }),
      });

      if (response.ok) {
        await fetchCargos();
      }
    } catch (error) {
      console.error("Failed to delete cargo:", error);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Cargos</h3>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {isFormOpen ? "Cancel" : "Add Cargo"}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo Name *
              </label>
              <input
                type="text"
                required
                value={formData.cargoName}
                onChange={(e) => setFormData({ ...formData, cargoName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Iron Ore"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo Type *
              </label>
              <select
                required
                value={formData.cargoType}
                onChange={(e) => setFormData({ ...formData, cargoType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="BULK">Bulk</option>
                <option value="CONTAINER">Container</option>
                <option value="LIQUID">Liquid</option>
                <option value="GENERAL">General</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 50000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit *
              </label>
              <select
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="MT">Metric Tons (MT)</option>
                <option value="CBM">Cubic Meters (CBM)</option>
                <option value="TEU">Twenty-foot Equivalent Units (TEU)</option>
                <option value="BBL">Barrels (BBL)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Cargo
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {cargos.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">No cargos added yet</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add Cargo" to create your first cargo</p>
          </div>
        ) : (
          cargos.map((cargo) => (
            <div
              key={cargo.id}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{cargo.cargoName}</h4>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {cargo.cargoType}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {cargo.quantity.toLocaleString()} {cargo.unit}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(cargo.id)}
                  className="text-red-600 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition-colors"
                  title="Delete cargo"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
