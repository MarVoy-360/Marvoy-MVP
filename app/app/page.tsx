import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AppDashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-marvoy-primary">MarVoy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <form action="/api/auth/signout" method="post">
                <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-2 text-gray-600">Welcome to your MarVoy laytime calculator platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Voyages</h3>
            <p className="text-3xl font-bold text-marvoy-primary">0</p>
            <p className="text-sm text-gray-500 mt-1">Active voyages</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Calculations</h3>
            <p className="text-3xl font-bold text-orange-600">0</p>
            <p className="text-sm text-gray-500 mt-1">Pending review</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Claims</h3>
            <p className="text-3xl font-bold text-green-600">$0</p>
            <p className="text-sm text-gray-500 mt-1">Total this month</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-marvoy-primary hover:bg-blue-50 transition-colors text-left">
              <div className="text-2xl mb-2">🚢</div>
              <div className="font-semibold text-gray-900">New Voyage</div>
              <div className="text-sm text-gray-500">Create a new voyage</div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-marvoy-primary hover:bg-blue-50 transition-colors text-left">
              <div className="text-2xl mb-2">📋</div>
              <div className="font-semibold text-gray-900">Laytime Calculation</div>
              <div className="text-sm text-gray-500">Start new calculation</div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-marvoy-primary hover:bg-blue-50 transition-colors text-left">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold text-gray-900">Reports</div>
              <div className="text-sm text-gray-500">View analytics</div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-marvoy-primary hover:bg-blue-50 transition-colors text-left">
              <div className="text-2xl mb-2">⚙️</div>
              <div className="font-semibold text-gray-900">Settings</div>
              <div className="text-sm text-gray-500">Configure preferences</div>
            </button>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-2">🎉 Welcome to MarVoy MVP!</h4>
          <p className="text-blue-800 text-sm">
            This is the initial version of the MarVoy laytime calculator platform. 
            More features coming soon: Voyage management, SOF processing, automated calculations, 
            third-party collaboration, AI-powered insights, and much more!
          </p>
        </div>
      </main>
    </div>
  )
}
