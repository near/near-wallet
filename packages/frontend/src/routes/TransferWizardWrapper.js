import React from 'react';
import styled from 'styled-components';

import Container from '../components/common/styled/Container.css'; 
import cleanUpKeysImg from '../images/wallet-migration/screenshots/clean-up-keys.png';
import logOutImg from '../images/wallet-migration/screenshots/log-out.png';
import secureAccountsImg from '../images/wallet-migration/screenshots/secure-accounts.png';
import transferAccountsImg from '../images/wallet-migration/screenshots/transfer-your-accounts.png';

const Table = styled.table`
    table-layout: fixed;
    width: 100%;
`;

const Td = styled.td`
    border-bottom: solid 1px lightgrey;
    width: 100%;
`;

const ImageTd = styled(Td)`
    text-align: center;
`;

const Warning = styled.p`
    color: #980000;
`;

const Important = styled.p`
    color: #ff0000;
`;

const ScreenshotImg = styled.img`
    width: 300px;
`;


export const TransferWizardWrapper = () => {
    return (
        <Container>
            <h1 >Migrating from Near Wallet</h1>
            <p>As announced in an earlier <a target="blank" href="https://medium.com/nearprotocol/near-opens-the-door-to-more-wallets-255eee58eb97">blog post</a> on July 31, 2022, the NEAR wallet domain (https://wallet.near.org) will transition from a web wallet into a wallet hub, showcasing the variety of wallets maintained by the community. During and after the transition, users will be encouraged to migrate their accounts to other ecosystem wallets. To simplify the process, the Pagoda team has created a Wallet Transfer Wizard to guide users through every step. Users are still free to migrate to a new wallet manually using a 12-word recovery phrase or hardware wallet.</p>
            <br />
            <h3>Transferring your accounts</h3>
            <br />
            <h4>Using your Recovery Phrase</h4>
            <p>The most familiar way to transfer your accounts to a new wallet is by importing your recovery phrase. If you want to enhance the security of your accounts and transfer multiple accounts at once, we recommend using the Wallet Transfer Wizard.</p>
            <p>Before you transfer the account using the recovery phrase, you will need to disable two-factor authentication (2FA). 2FA will no longer be supported and your accounts will not be available until email and phone number authentication are disabled. Access your account settings, located under Security & Recovery on the current wallet.near.org, to disable 2FA in all accounts before migrating your keys to another wallet provider.</p>
            <p>If you opt to use the Transfer Wizard, the wizard will handle removing 2FA, as well as email and phone authentication.</p>
            <br />
            <h4>Using your Ledger</h4>
            <p>If you are using a Ledger to secure your account, you can import your account to a new hardware-supported wallet such as <b>Nightly Wallet</b> or <b>Sender Wallet</b>. <b> Ledger-secured accounts cannot be transferred using the Transfer Wizard.</b></p>
            <p>If you opt to use the Transfer Wizard, the wizard will handle removing 2FA, as well as email and phone authentication for you.</p>
            <p>As when migrating the account using the Recovery Phrase, you will need to disable 2FA. Access your account settings, located under “Security & Recovery”, to disable 2FA in all accounts before migrating your keys to another wallet provider. If you opt to use the Transfer Wizard, the wizard will handle removing 2FA, as well as email and phone authentication.</p>
            <br />
            <h4>Using the Wallet Transfer Wizard (Recommended)</h4>
            <p>The Transfer Wizard makes it easy to bulk-transfer your connected accounts and offers a security checkup to help keep your accounts safe. The Wizard will guide you through key rotation, removal of old access keys, and the bulk transfer of your connected accounts to the wallet of your choice.</p>
            <br />
            <h3>Choosing a Wallet</h3>
            <p>You can learn more about the currently supported wallets in the Transfer Wizard by visiting the links below. You can also do a feature comparison with this <a target="blank" href="https://docs.google.com/spreadsheets/d/1Q9ZEeWpFHgcPthSCvzyiVcaKdBIcdS3r96v48OYsDBM">Google Sheet</a>.</p>
            <br />
            <Table>
                <tr>
                    <Td>
                        <b>Name</b>
                    </Td>
                    <Td>
                        <b>Website</b>
                    </Td>
                    <Td>
                        <b>Brief Description</b>
                    </Td>
                </tr>
                <tr>
                    <td>
                        <p>MyNearWallet</p>
                    </td>
                    <td>
                        <p><a target="blank" href="https://www.mynearwallet.com/">https://www.mynearwallet.com/</a></p>
                    </td>
                    <td>
                        <p>A browser based wallet that offers the same UI and features of the Near wallet.</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Meteor Wallet</p>
                    </td>
                    <td>
                        <p><a target="blank" href="https://meteorwallet.app/">https://meteorwallet.app/</a></p>
                    </td>
                    <td>
                        <p>Both a browser and extension wallet, with advanced NFT features.</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>HERE Wallet</p>
                    </td>
                    <td>
                        <p><a target="blank" href="https://herewallet.app/">https://herewallet.app/</a></p>
                    </td>
                    <td>
                        <p>Non-custodial mobile wallet with a friendly user interface and advanced features.</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Nightly Wallet</p>
                    </td>
                    <td>
                        <p><a target="blank" href="https://wallet.nightly.app/">https://wallet.nightly.app/</a></p>
                    </td>
                    <td>
                        <p>A mobile and extension wallet, with support for multiple ecosystems.</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Welldone Wallet</p>
                    </td>
                    <td>
                        <p><a target="blank" href="https://welldonestudio.io/">https://welldonestudio.io/</a></p>
                    </td>
                    <td>
                        <p>A multi-chain extension wallet that gives you control over all your assets from a single platform.</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Sender Wallet</p>
                    </td>
                    <td>
                        <p><a target="blank" href="https://senderwallet.io/">https://senderwallet.io/</a></p>
                    </td>
                    <td>
                        <p>Security-audited mobile & extension wallet with 1M+ users, supporting NEAR & Aurora. Sender is backed by Pantera, Binance and MetaWeb.</p>
                    </td>
                </tr>
            </Table>
            <br />
            <h3>How does the Wizard Work?</h3>
            <p>The Transfer Wizard is designed to improve the security posture of your connected accounts before migrating them to a new wallet by rotating your keys, cleaning up old keys, and securely transferring your accounts to a new wallet. You can access the Wallet Transfer Wizard from the banner at the top of wallet.near.org. </p>
            <Warning><b>Note</b>:  The wizard does not support unfunded accounts (implicit accounts) or accounts using Ledger. You can import your Ledger accounts manually to a supported wallet.</Warning>
            <hr />
            <Table>
                <tr>
                    <Td>
                        <p><b>Step 1. Secure Your Accounts</b></p>
                        <p>The first recommended security step is to rotate your keys, generating a new 12-word recovery phrase. This process is similar to updating your password.</p>
                        <ol type="1">
                            <li>Generate a new recovery phrase</li>
                            <li>
                                Securely write down or save your new recovery phrase
                                <ol type="a">
                                    <li>Confirm the account it recovers</li>
                                    <li>Don't confuse it with your old recovery phrase</li>
                                </ol>
                            </li>
                            <li>Verify your new recovery phrase</li>
                            <li>Keep your new phrase in a safe place</li>
                        </ol>
                        <Important><b>Note</b>: Your recovery phrase grants full access to your account. Keep it in a safe place and never share it with anyone. Pagoda or the NEAR Foundation cannot help recover lost accounts or assets.</Important>
                    </Td>
                    <ImageTd>
                        <ScreenshotImg alt="Secure Accounts" src={secureAccountsImg} />
                    </ImageTd>
                </tr>
                <tr>
                    <Td>
                        <p><b>Step2. Clean Up Your Keys</b></p>
                        <p>Next, NEAR wants to reduce the amount of apps that you've shared keys with, similar to revoking access for third-parties. This may cause you to be disconnected from some apps.</p>
                        <ol type="1">
                            <li>Review suggested keys to remove (optional)</li>
                            <li>Enter your recovery phrase to confirm removal</li>
                            <li>Remove outdated and unnecessary keys. You may need to log back in to certain apps if you remove their limited access key. </li>
                        </ol>
                    </Td>
                    <ImageTd>
                        <ScreenshotImg alt="Clean up Keys" src={cleanUpKeysImg} />
                    </ImageTd>
                </tr>
                <tr>
                    <Td>
                        <p><b>Step 3. Transfer Your Accounts</b></p>
                        <p>Next, you will use the Wallet Selector to select your destination wallet and transfer your accounts. It's best to know which wallet you plan to use prior to starting the transfer. <a target="blank" href="https://docs.google.com/spreadsheets/d/1Q9ZEeWpFHgcPthSCvzyiVcaKdBIcdS3r96v48OYsDBM">List of Supported Wallets</a></p>
                        <ol type="1">
                            <li>Choose the wallet you want to transfer your accounts to</li>
                            <li>Select the accounts you want to transfer</li>
                            <li>Copy a temporary password to secure the account transfer</li>
                            <li>Enter the temporary password in the new wallet</li>
                            <li>Follow instructions within the new wallet to complete wallet setup and account transfer (this varies per wallet)</li>
                            <li>Confirm that you have access to your accounts in the new wallet and return to wallet.near.org to complete the process</li>
                        </ol>
                    </Td>
                    <ImageTd>
                        <ScreenshotImg alt="Transfer Accounts" src={transferAccountsImg} />
                    </ImageTd>
                </tr>
                <tr>
                    <Td>
                        <p><b>Step 4. Log Out of Near.org</b></p>
                        <p>The final step is to log out of the NEAR Wallet and begin using your new wallet.</p>
                        <ol type="1">
                            <li>Return to wallet.near.org after successful account transfer and tap <i>"Complete"</i> in the "Complete the Transfer" panel</li>
                            <li>Verify that you have access to your accounts in the new wallet</li>
                            <li>Log out all accounts from near.org</li>
                            <li>Start using your new wallet to manage your accounts</li>
                        </ol>
                    </Td>
                    <ImageTd>
                        <ScreenshotImg alt="Logout Near" src={logOutImg} />
                    </ImageTd>
                </tr>
            </Table>
        </ Container>
    );
};
