import React from 'react'

function AccountId({ accountId, maxChars = 21 }) {
    const numLeadingChars = maxChars / 2.5
    const numTrailingChars = maxChars / 1.5
    const calcLeadingChars = accountId.slice(0, numLeadingChars)
    const calcTrailingChars = accountId.slice(-numTrailingChars)

    return (
        <>
            {accountId.length > maxChars ? `${calcLeadingChars}...${calcTrailingChars}` : accountId}
        </>
    )
}

export default AccountId