import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { selectAccountId } from '../../../redux/slices/account';

const accountDaosUrl = 'https://api.testnet.app.astrodao.com/api/v1/daos/account-daos/';

const proposalsUrl = (id) => `https://api.testnet.app.astrodao.com/api/v1/proposals?s={"$and":[{"daoId":{"$eq":"${id}"}}]}&limit=1000&offset=0`;

const fetchData = (url) => {
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=utf-8',
        }
    }).then((response) => {
        return response.json();
    })
        .then((data) => {
            return data;
        });
}; 

export const useDao = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const accountId = useSelector(selectAccountId);

    const getData = useCallback(async (accountId) => {
        setLoading(true);
        
        const dao = await fetchData(accountDaosUrl+accountId);

        const data = await Promise.all(dao.map(({ activeProposalCount, id }) => activeProposalCount ? fetchData(proposalsUrl(id)) : null ));
        
        setData(dao.map((item, index) => ({...item, proposal: data[index]})));

        setLoading(false);

    }, [fetchData, setLoading]);

    useEffect(() => {
        if (accountId) {
            getData(accountId);
        }
    }, [getData, accountId]);

    return {loading, data};
};
