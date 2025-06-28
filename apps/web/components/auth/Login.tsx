'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
        if (res.ok) router.push('/dashboard')
        else {
            const { error: msg } = await res.json().catch(() => ({}))
            setError(msg || 'Login failed. Check your credentials.')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0f2f0]">
            <div className="max-w-md w-full bg-white rounded-2xl border border-gray-300 shadow-md p-8">
                <div className="flex flex-col items-center mb-8">
                    <span className="inline-block bg-blue-100 text-blue-600 rounded-full p-3 mb-3">
                        <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                    </span>
                    <h2 className="text-3xl font-bold text-blue-700">Healthcare Portal Login</h2>
                    <p className="text-gray-500 text-sm mt-2">Access your patient portal</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="text-red-600 text-center text-sm">{error}</div>}

                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">Email Address</label>
                        <input
                            type="email"
                            className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            placeholder="patient@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">Password</label>
                        <input
                            type="password"
                            className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold rounded-lg py-3 hover:bg-blue-700 transition"
                    >
                        Log In
                    </button>
                </form>
                <div className="mt-6 text-center text-gray-600">
                    New to our portal?{' '}
                    <Link href="/signup" className="text-blue-600 font-semibold hover:underline transition">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    )
}