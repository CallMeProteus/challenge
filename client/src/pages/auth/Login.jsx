import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { axiosInstance } from '../../api/apiConfig'
import useAuth from '../../hooks/useAuth'

export default function Login() {
    const { setAccessToken, setCSRFToken, setIsLoggedIn } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const fromLocation = location?.state?.from?.pathname || '/'
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    function onEmailChange(event) {
        setEmail(event.target.value)
        setError('')
    }

    function onPasswordChange(event) {
        setPassword(event.target.value)
        setError('')
    }

    async function onSubmitForm(event) {
        event.preventDefault()

        if (!email || !password) {
            setError('Please enter both email and password.')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await axiosInstance.post('auth/login', JSON.stringify({
                email,
                password
            }))

            setAccessToken(response?.data?.access_token)
            setCSRFToken(response.headers["x-csrftoken"])
            setIsLoggedIn(true)
            setEmail('')
            setPassword('')
            setLoading(false)

            navigate(fromLocation, { replace: true })
        } catch (error) {
            setLoading(false)
            setError(error.response?.data?.message || 'An error occurred during login. Please try again.')
        }
    }

    return (
        <div className='container'>
            <h2>Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={onSubmitForm}>
                <div className="mb-3">
                    <input 
                        type="email" 
                        placeholder='Email' 
                        autoComplete='username' 
                        className='form-control' 
                        id="email" 
                        value={email}
                        onChange={onEmailChange} 
                        required
                    />
                </div>
                <div className="mb-3">
                    <input 
                        type="password" 
                        placeholder='Password' 
                        autoComplete='current-password' 
                        className='form-control' 
                        id="password" 
                        value={password}
                        onChange={onPasswordChange} 
                        required
                    />
                </div>
                <div className="mb-3">
                    <button 
                        disabled={loading} 
                        className='btn btn-success' 
                        type="submit"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </form>
        </div>
    )
}