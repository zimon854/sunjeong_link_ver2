'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    // 세션 변경 감지 (로그인/로그아웃 시 자동 업데이트)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.unsubscribe()
    }
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/') // 로그아웃 후 메인 페이지로 이동
  }

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-300">안녕하세요, {user.email}님!</span>
      <button
        onClick={handleLogout}
        className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
      >
        로그아웃
      </button>
    </div>
  ) : (
    <Link href="/auth/login" className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition">
      로그인 / 회원가입
    </Link>
  )
}