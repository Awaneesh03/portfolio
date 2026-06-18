import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface AvailabilityStatus {
  available: boolean
  label: string
}

const DEFAULT: AvailabilityStatus = { available: true, label: 'Open to internships' }

export function useAvailability() {
  const [status, setStatus] = useState<AvailabilityStatus>(DEFAULT)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'availability')
      .single()
      .then(({ data }) => {
        if (data?.value) setStatus(data.value as AvailabilityStatus)
      })
  }, [])

  return status
}
