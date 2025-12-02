"use client";

import { useState, useEffect } from "react";
import { CharterParty } from "@prisma/client";

interface CharterPartiesManagerProps {
  voyageId: string;
}

export default function CharterPartiesManager({ voyageId }: CharterPartiesManagerProps) {
  const [charterParties, setCharterParties] = useState<CharterParty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharterParties();
  }, [voyageId]);

  const fetchCharterParties = async () => {
    try {
      const response = await fetch(`/api/voyages/${voyageId}/charter-parties`);
      if (response.ok) {
        const data = await response.json();
        setCharterParties(data);
      }
    } catch (error) {
      console.error("Failed to fetch charter parties:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse"><div className="h-24 bg-gray-200 rounded"></div></div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Charter Parties</h3>
      {charterParties.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No charter parties added yet</p>
        </div>
      ) : (
        charterParties.map((cp) => (
          <div key={cp.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900">{cp.cpNumber}</h4>
            <p className="text-sm text-gray-600">Laytime: {cp.laytimeAllowed} {cp.laytimeUnit}</p>
          </div>
        ))
      )}
    </div>
  );
}
