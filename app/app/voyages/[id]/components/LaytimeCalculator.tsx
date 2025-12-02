"use client";

import { useState } from "react";

interface LaytimeCalculatorProps {
  voyageId: string;
}

export default function LaytimeCalculator({ voyageId }: LaytimeCalculatorProps) {
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = async () => {
    setCalculating(true);
    try {
      const response = await fetch(`/api/voyages/${voyageId}/calculate`);
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      }
    } catch (error) {
      console.error("Calculation failed:", error);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Laytime Calculator</h3>
        <button
          onClick={handleCalculate}
          disabled={calculating}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {calculating ? "Calculating..." : "Calculate Laytime"}
        </button>
      </div>

      {result && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="font-semibold mb-4">Calculation Results</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Time Used:</span>
              <p className="text-lg font-semibold">{result.timeUsed || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Time Allowed:</span>
              <p className="text-lg font-semibold">{result.timeAllowed || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <span className="text-sm text-gray-500">Result:</span>
              <p className="text-xl font-bold text-blue-600">
                {result.result || 'Calculation pending'}
              </p>
            </div>
          </div>
        </div>
      )}

      {!result && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">Click "Calculate Laytime" to generate results</p>
        </div>
      )}
    </div>
  );
}
