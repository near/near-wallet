import React from 'react'

import { Form } from 'semantic-ui-react'

import MSearchImage from '../../images/icon-m-search.svg'

import styled from 'styled-components'

const SearchForm = styled(Form)`
    float: right;

    &&&& .search input {
        width: 360px;

        height: 36px;
        border: 2px solid #e6e6e6;
        border-radius: 25px;
        padding-left: 40px;

        font-size: 14px;

        background-color: #f8f8f8;
        background-image: url(${MSearchImage});
        background-position: 12px center;
        background-repeat: no-repeat;
        background-size: 14px auto;
    }
`

const Search = ({ handleSubmit, handleChange, search }) => (
    <SearchForm onSubmit={handleSubmit}>
        <Form.Input
            className='search'
            name='search'
            value={search}
            onChange={handleChange}
            placeholder='Search transactions and receipts...'
        />
    </SearchForm>
)

export default Search
