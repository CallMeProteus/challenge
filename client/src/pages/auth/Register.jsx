import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../../api/apiConfig'

// Basic Ethereum address validation function
const isValidEthereumAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export default function Register() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password2: '',
        ethereumAddress: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
        setError('')
    }

    const validateForm = () => {
        if (!formData.first_name || !formData.last_name || !formData.email || !formData.password || !formData.password2 || !formData.ethereumAddress) {
            setError('All fields are required')
            return false
        }
        if (formData.password !== formData.password2) {
            setError('Passwords do not match')
            return false
        }
        if (!isValidEthereumAddress(formData.ethereumAddress)) {
            setError('Invalid Ethereum address')
            return false
        }
        return true
    }

    async function onSubmitForm(event) {
        event.preventDefault()
        if (!validateForm()) return

        setLoading(true)
        setError('')

        try {
            await axiosInstance.post('auth/register', JSON.stringify(formData))
            setLoading(false)
            navigate('/auth/login')
        } catch (error) {
            setLoading(false)
            setError(error.response?.data?.message || 'An error occurred during registration. Please try again.')
        }
    }

    return (
        <div className='container'>
            <h2>Register</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={onSubmitForm}>
                <div className="mb-3">
                    <input type="text" name="first_name" placeholder='First Name' autoComplete='given-name' className='form-control' value={formData.first_name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <input type="text" name="last_name" placeholder='Last Name' autoComplete='family-name' className='form-control' value={formData.last_name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <input type="email" name="email" placeholder='Email' autoComplete='email' className='form-control' value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <input type="password" name="password" placeholder='Password' autoComplete='new-password' className='form-control' value={formData.password} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <input type="password" name="password2" placeholder='Confirm Password' autoComplete='new-password' className='form-control' value={formData.password2} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <input type="text" name="ethereumAddress" placeholder='Ethereum Wallet Address' autoComplete='off' className='form-control' value={formData.ethereumAddress} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <button disabled={loading} className='btn btn-success' type="submit">
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </div>
            </form>
        </div>
    )
}