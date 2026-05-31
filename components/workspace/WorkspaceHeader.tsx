import React from 'react'
import Image from 'next/image'
import {UserButton} from '@clerk/nextjs'


const WorkspaceHeader = () => {
  return (
    <div className='flex justify-between p-6 items-center'>
       <Image src={"/logo.svg"} alt="logo" width={200} height={40} />
      
       <ul className='flex gap-6 items-center'>
         <li className='cursor-pointer hover:text-blue-500'>Workspaces</li>
         <li className='cursor-pointer hover:text-blue-500'>Pricing</li>
         <li className='cursor-pointer hover:text-blue-500'>Supports</li>
         
       </ul>
       <UserButton/>
      
    </div>
  )
}

export default WorkspaceHeader