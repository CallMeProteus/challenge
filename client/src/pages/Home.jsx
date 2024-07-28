import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import useUser from '../hooks/useUser'

function formatBalance(balance) {
  if (!balance) return '0.0000'
  const num = parseFloat(balance)
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  })
}

export default function Home() {
    const { user } = useAuth()
    const getUser = useUser()
    const [formattedBalance, setFormattedBalance] = useState('0.0000')

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        if (user && user.balance) {
            setFormattedBalance(formatBalance(user.balance))
        }
    }, [user])

    return (
        <div className='container mt-3'>
            <h2>
                <div className='row'>
                    <div className="mb-12">
                        {user?.email ? (
                            <>
                                <span>Balance: </span>
                                <span>{formattedBalance} ETH</span>
                            </>
                        ) : 'Please login first'}
                    </div>
                </div>
            </h2>
        </div>
    )
}