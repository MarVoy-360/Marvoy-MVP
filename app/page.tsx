export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-marvoy-primary">
          MarVoy
        </h1>
        <h2 className="text-3xl font-semibold text-marvoy-secondary">
          Laytime Calculator Platform
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl">
          Modern, multi-tenant SaaS platform for maritime laytime, demurrage, and despatch calculations
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-2">🚀 Status</h3>
            <p className="text-green-600 font-bold">Development Started</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-2">⚙️ Tech Stack</h3>
            <p className="text-sm text-gray-600">Next.js 15 + TypeScript + Tailwind</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-2">📊 Database</h3>
            <p className="text-sm text-gray-600">Supabase PostgreSQL</p>
          </div>
        </div>
      </div>
    </main>
  );
}
