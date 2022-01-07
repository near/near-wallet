NEAR Wallet Fungible Token ([NEP-141](https://nomicon.io/Standards/FungibleToken/Core.html)) Discovery and Display
===

NEAR Wallet discovers fungible tokens using a range of indexer queries and displays them using data in the token's metadata per the `ft_metadata` spec ([NEP-148](https://nomicon.io/Standards/FungibleToken/Metadata.html))

## Contents

1. [NEAR Wallet fungible token discovery](#NEAR-Wallet-fungible-token-discovery)
2. [NEAR Wallet fungible token display](#NEAR-Wallet-fungible-token-display)

## NEAR Wallet fungible token discovery
The wallet will consider contracts as fungible tokens if they meet any of the following conditions:

1. Any account makes a call to it with one of the following methods and the `receiver_id` property of the `args` is the user's account ID.
    * `ft_transfer`
    * `ft_transfer_call`
    * `ft_mint`
    
2. The bridge token factory account makes a call to it with the `mint` method with the user's account ID as the `account_id` property of the `args`.
3. The user's account ID calls a method named `storage_deposit` OR any method prefixed with `ft_` on it.

The wallet will then make a view call to `ft_balance_of` on the considered contract and list it as a fungible token if it returns a value that is more than zero.

## NEAR Wallet fungible token display

The wallet will display the token using the following properties returned by the contract's `ft_metaddata`:
* `icon`: An icon will be rendered for the fungible token if a data url is supplied.
* `name`: Displayed as the fungible token's title (e.g. Banana) with a fallback to the `symbol` property.
* `symbol`: Displayed to represent the user's balance (e.g. BANANA).
* `decimals`: Used to show the proper significant digits of a token. This concept is explained well in this [OpenZeppelin post](https://docs.openzeppelin.com/contracts/3.x/erc20#a-note-on-decimals).

The wallet will also display the balance returned by `ft_balance_of`:

<img src="./assets/fungible-token-display.png" width="500">
