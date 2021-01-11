import React from 'react'

const StarIcon = ({ color }) => {
    const fill = color || '#FFC785'
    return (
        <svg width="20" height="20" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 0L12.0659 6.93414L19 9.5L12.0659 12.0659L9.5 19L6.93414 12.0659L0 9.5L6.93414 6.93414L9.5 0Z" fill={fill}/>
        </svg>
    )
}

export default StarIcon