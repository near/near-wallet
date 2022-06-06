import { createSelector } from 'reselect';

import { selectAccountId } from '../../slices/account';
import { selectRecoveryMethodsByAccountId, selectRecoveryMethodsLoading } from '../../slices/recoveryMethods';

export default createSelector(
    [selectRecoveryMethodsLoading, selectAccountId, selectRecoveryMethodsByAccountId],
    (loading, accountId, recoveryMethods) => (loading && !recoveryMethods.length) || !accountId
);
