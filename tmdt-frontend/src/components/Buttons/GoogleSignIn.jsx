import React, { useCallback } from 'react'
import GoogleLogo from '../../assets/Google.png'
import { API_BASE_URL } from '../../api/constant'

const GoogleSignIn = () => {
    const handleClick = useCallback(() => {
        window.location.href = API_BASE_URL + "/oauth2/authorization/google";
    }, [])

    return (
        <button
            onClick={handleClick}
            className="flex justify-center items-center w-full h-[48px] border border-gray-300 bg-white hover:bg-gray-50 transition shadow-sm rounded-sm gap-2"
        >
            <img src={GoogleLogo} alt="Google" className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-800">
        Tiếp tục với Google
      </span>
        </button>
    )
}

export default GoogleSignIn
