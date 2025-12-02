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
