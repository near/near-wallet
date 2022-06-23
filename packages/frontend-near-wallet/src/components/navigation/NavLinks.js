import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    width: 100%;
    a {
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: 100ms;
        color: #72727A;
        font-size: 15px;
        white-space: nowrap;

        :hover, &.selected {
            text-decoration: none;
            color: #272729;

            svg {
                path, circle, line {
                    stroke: #0072CE;
                }

                &.user-icon {
                    path {
                        stroke: #0072CE;
                        fill: #0072CE;

                        :last-of-type {
                            fill: none;
                        }
                    }
                }
            }
        }
    }


    svg {
        margin-right: 10px;
        width: 23px;
        height: 23px;

        &.user-icon {
            width: 35px;
            height: 35px;
            margin-right: 4px;
            stroke-width: 0px;
        }
    }

    .usn-button {
        margin-left: auto;
        margin-right: 20px;
        height: 35px;
        padding: 5px 15px 5px 5px;
        border-radius: 20px;
        background: #D6EDFF;
        font-weight: 600;
        color: black;
        white-space: nowrap;

        :hover {
            background: #0072CE;
            color: white;
        }

        img {
            margin-right: 10px;
            margin-top: 2px;
            width: 25px;
            height: 25px;
        }
    }

    @media (max-width: 991px) {
        flex-direction: column;
        align-items: flex-start;
    }

    @media (min-width: 992px) {
        align-items: center;
        margin-left: 10px;

        a {
            margin-left: 25px;

            &.account-details-link {
                margin-left: 20px;
            }
        }
    }
`;

const NavLinks = () => (
    <Container className='nav-links'>
    </Container>
);

export default NavLinks;
