import * as React from "react";
import { Routes, Route } from "react-router-dom";

import RedirectPage from "./modules/redirects/pages/RedirectPage";
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