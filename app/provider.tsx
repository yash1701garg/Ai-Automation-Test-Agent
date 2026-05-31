'use client';
import { UserDetailContext } from '@/context/UserDetailContext';
import axios from 'axios';
import React, { useState,useEffect } from 'react';

const Provider = (
    {children}: Readonly<{
  children: React.ReactNode;
}>
) => {
    const [userDetail,setUserDetail] = useState<any>(null);
    const CreateNewUser = async() => {
        try {
            const response = await axios.post('/api/users',{})
            console.log('response',response)
            setUserDetail(response?.data?.user)
        } catch (error) {
            console.log('error',error)
        }
    }

    useEffect(() => {
        CreateNewUser();
    }, [])
  return (
    <UserDetailContext.Provider value={{userDetail, userDetails: userDetail, setUserDetail}}>
        <div>{children}</div>
    </UserDetailContext.Provider>
    
  )
}

export default Provider;