import React from 'react'

const CopyIcon = ({ color }) => {
    const stroke = color || '#2B9AF4'
    return (
        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 7.48071H8.25C7.42157 7.48071 6.75 8.15229 6.75 8.98071V15.7307C6.75 16.5591 7.42157 17.2307 8.25 17.2307H15C15.8284 17.2307 16.5 16.5591 16.5 15.7307V8.98071C16.5 8.15229 15.8284 7.48071 15 7.48071Z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.75 11.9807H3C2.60218 11.9807 2.22064 11.8227 1.93934 11.5414C1.65804 11.2601 1.5 10.8785 1.5 10.4807V3.73071C1.5 3.33289 1.65804 2.95136 1.93934 2.67005C2.22064 2.38875 2.60218 2.23071 3 2.23071H9.75C10.1478 2.23071 10.5294 2.38875 10.8107 2.67005C11.092 2.95136 11.25 3.33289 11.25 3.73071V4.48071" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

export default CopyIcon