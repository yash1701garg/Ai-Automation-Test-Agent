import React from 'react'
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    
    <div>
        <WorkspaceHeader/>
        {children}
    </div>
  )
}

export default layout