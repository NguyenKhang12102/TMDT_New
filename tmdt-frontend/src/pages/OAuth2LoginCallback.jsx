import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveToken } from '../utils/jwt-helper.js';
import {useDispatch} from "react-redux";
import { setAuthenticated } from '../store/features/authSlice.jsx';
import { loadUserInfo } from '../store/features/user.js';
import { fetchUserDetails } from '../api/UserInfo.js';


const OAuth2LoginCallback = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(()=>{
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if(token){
            saveToken(token);
            dispatch(setAuthenticated(true));
            fetchUserDetails(token)
                .then((user) => {
                    dispatch(loadUserInfo(user));
                    navigate('/');
                })
                .catch((err) => {
                    console.error("Lỗi khi lấy thông tin user:", err);
                    navigate('/login');
                });
        }
        else{
            navigate('/login')
        }
    },[navigate])
    return (
        <div></div>
    )
}

export default OAuth2LoginCallback