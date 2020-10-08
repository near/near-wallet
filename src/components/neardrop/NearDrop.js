import React, { useState, useEffect } from 'react';
import * as nearApi from 'near-api-js'
import Big from 'big.js'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount } from '../../hooks/allAccounts'

import { wallet } from '../../utils/wallet'

import FormButton from '../common/FormButton'
import AuthorizedGreyImage from '../../images/icon-authorized-grey.svg'
import AccessKeysIcon from '../../images/icon-keys-grey.svg'
import DashboardKeys from '../dashboard/DashboardKeys'

import './Drops.scss'

const {
    KeyPair, keyStores, Contract, Account,
    transactions:  {
        functionCall
    }
} = nearApi

export const NETWORK_ID = process.env.REACT_APP_NETWORK_ID || 'default'
export const DROP_GAS = '30000000000000'

export const toNear = (value = '0') => Big(value).times(10 ** 24).toFixed()
export const nearTo = (value = '0', to = 2) => Big(value).div(10 ** 24).toFixed(to === 0 ? undefined : to)
export const nearToInt = (value = '0') => parseInt(nearTo(value), 10)

export const howLongAgo = (ts) => {
    const howLong = (Date.now() - ts) / 1000
    if (howLong > 86400 * 2) return Math.floor(howLong / 86400) + ' days ago'
    else if (howLong > 86400) return Math.floor(howLong / 86400) + ' day ago'
    else if (howLong > 3600 * 2) return Math.floor(howLong / 3600) + ' hours ago'
    else if (howLong > 3600) return Math.floor(howLong / 3600) + ' hour ago'
    else if (howLong > 60 * 2) return Math.floor(howLong / 60) + ' minutes ago'
    else if (howLong > 60) return Math.floor(howLong / 60) + ' minute ago'
    else return Math.floor(howLong) + ' seconds ago'
}

const get = (k) => JSON.parse(localStorage.getItem(k) || '[]')
const set = (k, v) => localStorage.setItem(k, JSON.stringify(v))

export const NearDrop = (props) => {
    const contractName = 'testnet'
    const walletUrl = 'https://wallet.testnet.near.org'
    const accountId = useSelector((state) => state.account.accountId)
    const dropStorageKey = '__drops_' + accountId
    const account = useAccount(accountId)
    const contractAccount = new Account(wallet.connection, contractName)
    const keyStore = new keyStores.BrowserLocalStorageKeyStore(localStorage, 'nearlib:keystore:')

    const [contract, setContract] = useState(null)
    const [drops, setDrops] = useState([])
    const [showUsed, setShowUsed] = useState(false)
    const [sending, setSending] = useState(false)
    const [claiming, setClaiming] = useState('')

    /********************************
    Mounting init
    ********************************/
    const init = () => {
        (async () => {
            const contract = await new Contract(wallet.getAccount(), contractName, {
                viewMethods: ['get_key_balance'],
                changeMethods: ['send', 'send_limited'],
            });
            setContract(contract)
        })()
    }
    useEffect(init, [])

    useEffect(() => {
        if (!contract) return
        updateDrops(true)
    }, [contract])
    /********************************
    Update drops (idb + state), add drop, remove drop
    ********************************/
    async function getDrop(public_key) {
        const drops = await get(dropStorageKey) || []
        return drops.find((d) => d.public_key === public_key)
    }
    async function updateDrops(check = false) {
        const drops = (await get(dropStorageKey) || [])
        for (let drop of drops) {
            const { public_key: key } = drop
            drop.walletLink = await getWalletLink(key)
            if (!check) {
                continue
            }
            let res
            try {
                res = await contract.get_key_balance({ key })
            } catch (e) {
                console.warn(e)
                if (e.message.indexOf('Key is missing') > -1) {
                    await useDrop(key)
                }
            }
        }
        setDrops(drops)
    }
    async function useDrop(public_key) {
        const drops = await get(dropStorageKey) || []
        const drop = drops.find((d) => d.public_key === public_key)
        drop.used = true
        await set(dropStorageKey, drops)
        updateDrops()
    }
    async function removeDrop(public_key) {
        const drops = await get(dropStorageKey) || []
        drops.splice(drops.findIndex((d) => d.public_key === public_key), 1)
        await set(dropStorageKey, drops)
        updateDrops()
    }
    async function addDrop(newKeyPair) {
        const drops = await get(dropStorageKey) || []
        drops.push(newKeyPair)
        await set(dropStorageKey, drops)
        updateDrops()
    }
    /********************************
    Drop links
    ********************************/
    async function getWalletLink(public_key) {
        const { secretKey } = await getDrop(public_key)
        return `${walletUrl}/create/${contractName}/${secretKey}`
    }
    /********************************
    Download keypair
    ********************************/
    function downloadFile(fileName, data, type='text/plain') {
        const a = document.createElement('a')
        a.style.display = 'none'
        document.body.appendChild(a)
        a.href = window.URL.createObjectURL(new Blob([data], { type }))
        a.setAttribute("download", fileName)
        a.click()
        window.URL.revokeObjectURL(a.href)
        document.body.removeChild(a)
    }
    /********************************
    Get Contract Helper
    ********************************/
   async function getContract(viewMethods = [], changeMethods = [], secretKey) {
    if (secretKey) {
        await keyStore.setKey(
            NETWORK_ID, contractName,
            KeyPair.fromString(secretKey)
        )
    }
    const contract = new Contract(contractAccount, contractName, {
        viewMethods,
        changeMethods,
        sender: contractName
    })
    return contract
}
    /********************************
    Funding an open drop (claim, create account, create contract) with your currently logged in account
    ********************************/
    async function fundDrop() {
        // get a drop amount from the user
        const amount = toNear(window.prompt('Amount to fund with in Near Ⓝ') || 0)
        // TODO: What is minimum allowance? Seems to not match what is in contract source?
        if (nearToInt(amount) < 1) {
            window.alert('Amount too small for drop')
            return
        }
        // create a new drop keypair, add the amount to the object, store it
        const newKeyPair = nearApi.KeyPair.fromRandom('ed25519')
        const public_key = newKeyPair.public_key = newKeyPair.publicKey.toString().replace('ed25519:', '')

        // download keypair if user wants
        const downloadKey = window.confirm('Download keypair backup file before funding drop?')
        if (downloadKey) {
            const { secretKey, public_key: publicKey } = JSON.parse(JSON.stringify(newKeyPair))
            downloadFile(public_key + '.txt', JSON.stringify({ publicKey, secretKey }))
        }

        newKeyPair.amount = amount
        newKeyPair.ts = Date.now()
        await addDrop(newKeyPair)

        setSending(true)
        try {
            const actions = [
                functionCall('send', { public_key }, DROP_GAS, amount)
            ]
            return await signAndSendTransaction(contractName, actions)
        } catch(e) {
            console.warn(e)
            alert('Error occured creating drop. New Drop was moved to "Used Drops".')
            await useDrop(public_key)
        } finally {
            setSending(false)
        }
    }

    // helper for 2fa / signTx until refactor is merged
    async function signAndSendTransaction(receiverId, actions) {
        const { accountId } = wallet
        const { account, has2fa } = await wallet.getAccountAndState(accountId)
        if (has2fa) {
            return wallet.signAndSendTransactions([{receiverId, actions}], accountId)
        }
        return account.signAndSendTransaction(receiverId, actions)
    }

    /********************************
    Reclaim a drop / cancels the drop and claims to the current user
    ********************************/
    async function reclaimDrop(public_key) {
        // get the drops from idb and find the one matching this public key
        const drops = await get(dropStorageKey) || []
        const drop = drops.find((d) => d.public_key === public_key)
        if (!window.confirm(`Remove drop of ${nearTo(drop.amount, 2)} Ⓝ and transfer funds to\n${accountId}\nDo you want to continue?`)) {
            return
        }
        const contract = await getContract([], ['claim'], drop.secretKey)
        // return funds to current user
        setClaiming(public_key)
        try {
            await contract.claim({ account_id: accountId }, DROP_GAS)
            window.alert('Drop claimed')
            useDrop(public_key)
        } catch(e) {
            console.log(e)
            alert('Unable to claim drop. The drop may have already been claimed.')
        } finally {
            setClaiming('')
        }
    }

    const activeDrops = drops.filter((d) => !d.used).sort((a, b) => b.ts - a.ts)
    const usedDrops = drops.filter((d) => d.used).sort((a, b) => b.ts - a.ts)

    console.log('ACTIVE DROPS', activeDrops)
    console.log('USED DROPS', usedDrops)

    return (
        <div className="root">

            <FormButton color='green-white-arrow' sending={sending} onClick={() => fundDrop()}>
                Create New Drop
            </FormButton>
            
            { activeDrops.length > 0 && 
                <div className="drop">
                    <DashboardKeys
                        image={AccessKeysIcon}
                        title={'Active Drops'}
                        empty={'No Drops'}
                        accessKeys={activeDrops.map(({ public_key: pk, amount, ts, walletLink }) => ({
                            public_key: `${ pk.substr(0, 8) }...${ pk.substr(36) }`,
                            meta: { 
                                type: null,
                                amount: `${ nearTo(amount, 2) } Ⓝ`,
                                created: howLongAgo(ts),
                                links: [
                                    {
                                        label: 'Open Wallet Link',
                                        href: walletLink,
                                    },
                                    {
                                        label: claiming === pk ? 'Claiming Drop ...' : 'Claim and Move to "Used Drops"',
                                        onClick: () => reclaimDrop(pk)
                                    }
                                ]
                            },
                        }))}
                    />
                </div>
            }
            { showUsed ?

                <>
                <FormButton onClick={() => setShowUsed(false)}>
                    Hide Used Drops
                </FormButton>
                    <div className="drop">

                        <DashboardKeys
                            image={AuthorizedGreyImage}
                            title={'Used Drops'}
                            empty={'No Drops'}
                            accessKeys={usedDrops.map(({ public_key: pk, amount, ts, walletLink }) => ({
                                public_key: `${ pk.substr(0, 8) }...${ pk.substr(36) }`,
                                meta: { 
                                    type: null,
                                    amount: `${ nearTo(amount, 2) } Ⓝ`,
                                    // created: howLongAgo(ts),
                                    links: [
                                        {
                                            label: 'Open Wallet Link',
                                            href: walletLink,
                                        }
                                    ]
                                },
                            }))}
                        />

                    </div>
                </>
                :
                <FormButton color="gray-blue" onClick={() => setShowUsed(true)}>
                    Show Used Drops
                </FormButton>
            }
        </div>
    )
}
