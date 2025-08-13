import React from 'react'
import Rightcontnet from './rightcontnet'
import Leftcontent from './LeftContent' 
import './mainContent.css'

const MainContent = () => {
    return (
        <div className='mainContent'>
            <Leftcontent />
            <Rightcontnet />
        </div>
    )
}

export default MainContent
