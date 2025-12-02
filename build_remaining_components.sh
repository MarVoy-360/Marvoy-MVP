#!/bin/bash

echo "====================================="
echo "Building Remaining MVP Components"
echo "====================================="

# Create Charter Parties Manager component stub
mkdir -p app/app/voyages/[id]/components

cat > app/app/voyages/[id]/components/CharterPartiesManager.tsx << 'TSX'
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
TSX

echo "✅ Created CharterPartiesManager.tsx"

# Create SOF API route
mkdir -p app/api/voyages/[voyageId]/sof

cat > app/api/voyages/[voyageId]/sof/route.ts << 'TS'
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { voyageId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sofActivities = await prisma.sOFActivity.findMany({
      where: { voyageId: params.voyageId },
      orderBy: { eventTime: "asc" },
    });

    return NextResponse.json(sofActivities);
  } catch (error) {
    console.error("Failed to fetch SOF activities:", error);
    return NextResponse.json({ error: "Failed to fetch SOF activities" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { voyageId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { portCallId, eventType, eventTime, remarks } = body;

    const sofActivity = await prisma.sOFActivity.create({
      data: {
        voyageId: params.voyageId,
        portCallId,
        eventType,
        eventTime: new Date(eventTime),
        remarks,
      },
    });

    return NextResponse.json(sofActivity, { status: 201 });
  } catch (error) {
    console.error("Failed to create SOF activity:", error);
    return NextResponse.json({ error: "Failed to create SOF activity" }, { status: 500 });
  }
}
TS

echo "✅ Created SOF API route"

# Create SOF Manager component
cat > app/app/voyages/[id]/components/SOFManager.tsx << 'TSX'
"use client";

import { useState, useEffect } from "react";
import { SOFActivity } from "@prisma/client";

interface SOFManagerProps {
  voyageId: string;
}

export default function SOFManager({ voyageId }: SOFManagerProps) {
  const [activities, setActivities] = useState<SOFActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [voyageId]);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`/api/voyages/${voyageId}/sof`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error("Failed to fetch SOF activities:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse"><div className="h-24 bg-gray-200 rounded"></div></div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Statement of Facts (SOF)</h3>
      {activities.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No SOF activities recorded yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-white p-3 rounded border border-gray-200">
              <div className="font-medium text-gray-900">{activity.eventType}</div>
              <div className="text-sm text-gray-600">
                {new Date(activity.eventTime).toLocaleString()}
              </div>
              {activity.remarks && <p className="text-sm text-gray-500 mt-1">{activity.remarks}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
TSX

echo "✅ Created SOFManager.tsx"

# Create Laytime Calculator component
cat > app/app/voyages/[id]/components/LaytimeCalculator.tsx << 'TSX'
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
TSX

echo "✅ Created LaytimeCalculator.tsx"

# Create Calculator API stub
mkdir -p app/api/voyages/[voyageId]/calculate

cat > app/api/voyages/[voyageId]/calculate/route.ts << 'TS'
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { voyageId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Implement full laytime calculation logic
    // This is a placeholder that returns sample data
    const result = {
      timeUsed: "48 hours",
      timeAllowed: "72 hours",
      result: "Despatch: 24 hours",
      calculatedAt: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Calculation failed:", error);
    return NextResponse.json({ error: "Calculation failed" }, { status: 500 });
  }
}
TS

echo "✅ Created Calculator API route"

echo ""
echo "====================================="
echo "✅ All MVP components created!"
echo "====================================="
