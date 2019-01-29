# NEAR DevNet Wallet

This is in-browser web-based wallet for working with NEAR DevNet accounts. This wallet stores account keys in open text using the localStorage under https://wallet.nearprotocol.com domain on user's machine.

> NEAR Wallet features UI and usability designed by a backend engineer and should not be considered a final product.

`nearlib.js` is integrated with this wallet and uses cross-domain iframe messaging to communicate to sign transactions. This is would be secure since the account keys are never exposed to the app. But,we (NEAR) still have some work to do to prevent other security issues with application authorization, transaction verification and signing.

DISCLAIMER: This is a developers' preview Wallet. It should be used for NEAR Protocol DevNet only. Learn more at https://wallet.nearprotocol.com

