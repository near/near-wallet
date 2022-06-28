import * as React from "react";
import { Routes, Route } from "react-router-dom";
import LinkdropPage from "./modules/redirects/pages/LinkdropPage";
import LoginPage from "./modules/redirects/pages/LoginPage";
import RedirectPage from "./modules/redirects/pages/RedirectPage";
import SignPage from "./modules/redirects/pages/SignPage";

import WalletMigrationPage from "./modules/wallet-migration/pages/WalletMigrationPage";

import { globalStyles } from "./styles";

const App = () => {
    globalStyles()
    return (
        <Routes>
            <Route path="/" element={<WalletMigrationPage />} />
            <Route path="*" element={<RedirectPage />} />
        </Routes>
    );
}

export default App