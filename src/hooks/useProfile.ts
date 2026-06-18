import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { PERSONAL_INFO } from '@/data'

export type ProfileData = {
  name: string
  title: string
  subtitle: string
  email: string
  github: string
  linkedin: string
  location: string
  about: string
  aboutLong: string
}

const DEFAULT: ProfileData = {
  name: PERSONAL_INFO.name,
  title: PERSONAL_INFO.title,
  subtitle: PERSONAL_INFO.subtitle,
  email: PERSONAL_INFO.email,
  github: PERSONAL_INFO.github,
  linkedin: PERSONAL_INFO.linkedin,
  location: PERSONAL_INFO.location,
  about: PERSONAL_INFO.about,
  aboutLong: PERSONAL_INFO.aboutLong,
}

export function useProfile(): ProfileData {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'profile')
      .single()
      .then(({ data }) => {
        if (data?.value) setProfile({ ...DEFAULT, ...(data.value as Partial<ProfileData>) })
      })
  }, [])

  return profile
}
