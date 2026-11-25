'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [donors, setDonors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function fetchDonors() {
      const { data, error } = await supabase
        .from('blood_donors')
        .select('*')
        .order('id', { ascending: false })

      if (error) {
        setErrorMsg(error.message)
      } else if (data) {
        setDonors(data)
      }
      setLoading(false)
    }

    fetchDonors()
  }, [])

  return (
    <main className="p-8 max-w-2xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Blood Donors Directory</h1>

      {loading && <p className="text-gray-500">Loading donors...</p>}

      {errorMsg && (
        <p className="p-3 bg-red-100 text-red-700 rounded mb-4">
          Error: {errorMsg}
        </p>
      )}

      {!loading && !errorMsg && donors.length === 0 && (
        <p className="text-gray-500">
          Connected to Supabase! No rows in the donors table yet—click Insert in Supabase to add a dummy row and refresh.
        </p>
      )}

      <div className="space-y-3">
        {donors.map((donor) => (
          <div key={donor.id} className="p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{donor.name}</h2>
              <span className="px-3 py-1 bg-red-100 text-red-700 font-bold rounded-full text-sm">
                {donor.blood_group}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Location: {donor.location} • Availability: {donor.availability}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}
