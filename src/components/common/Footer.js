import React, { Component } from 'react'
import { Grid, List, Item } from 'semantic-ui-react'
import { Translate } from 'react-localize-redux'
import LogoFooterImage from '../../images/near.svg'

import styled from 'styled-components'

const FooterGrid = styled(Grid)`
    &&&& {
        position: absolute;
        bottom: 0px;
        width: 100%;

        background-color: #f8f8f8;

        font-size: 12px;
        font-weight: 300;
        color: #999999;

        margin-bottom: 0px;
        margin-left: 0px;

        .near-logo {
            .content {
                a {
                    font-size: 12px;
                    font-weight: 300;
                    color: #999999;
                    text-decoration: underline;

                    :hover {
                        text-decoration: none;
                    }
                }
                .color-brown-grey {
                    color: #e6e6e6;
                    padding: 0 6px;
                }
            }
            .image {
                width: 140px;
                padding-left: 14px;
                opacity: 0.3;
            }
        }

        .learn-more {
            padding: 0 40px 0 0;
            color: #24272a;
        }

        .help {
            padding-right: 0px;
            padding-top: 10px;
            padding-bottom: 10px;

            > .list {
                width: 230px;
                height: 80px;
                padding: 20px 0;
                background: #f8f8f8;
                text-align: left;

                > img {
                    width: 80px;
                    position: absolute;
                    bottom: 0px;
                    right: 200px;
                }

                > h3 {
                    font-weight: 600 !important;
                    padding: 0 0 0 40px;
                    color: #999999 !important;

                    &.color {
                        color: #0072ce !important;
                    }
                }
            }
        }
    }

    @media screen and (max-width: 991px) {
        &&&& {
            &:not(.show-mobile) {
                display: none;
            }
        }
    }

    @media screen and (max-width: 767px) {
        &&&& {
            height: 180px;

            .near-logo {
                .content {
                    text-align: center;
                }
                .image {
                    padding-left: 0px;
                }
            }
        }
    }
`

const MobileSpacer = styled.div`
    height: 180px;
    margin-top: 20px;

    @media (min-width: 768px) {
        display: none;
    }
`

class Footer extends Component {

    get showMobileFooter() {
        const noFooterRoutes = ['login', 'send-money', 'sign'];
        const currentRoute = window.location.pathname.replace(/^\/([^/]*).*$/, '$1');
        return !noFooterRoutes.includes(currentRoute);
    }

    render() {
        return (
            <>
                {this.showMobileFooter && <MobileSpacer/>}
                <FooterGrid columns={2} className={this.showMobileFooter ? 'show-mobile' : ''}>
                    <Grid.Column
                        textAlign='left'
                        verticalAlign='middle'
                        widescreen={4}
                        largeScreen={6}
                        computer={7}
                        tablet={10}
                        mobile={16}
                    >
                        <Item.Group className='near-logo'>
                            <Item>
                                <Item.Image src={LogoFooterImage} />
                                <Item.Content>
                                    &copy; {new Date().getFullYear()} <Translate id='footer.copyrights' />
                                    <br />
                                    <a href='/'><Translate id='footer.termsOfService' /></a>
                                    <span className='color-brown-grey'>|</span>
                                    <a href='/'><Translate id='footer.privacyPolicy' /></a>
                                </Item.Content>
                            </Item>
                        </Item.Group>
                    </Grid.Column>
                    <Grid.Column
                        only='computer'
                        computer={5}
                        className='learn-more'
                        verticalAlign='middle'
                    >
                        <Translate id='footer.desc' /> <a href='https://nearprotocol.com/'><Translate id='footer.learnMore' /></a>
                    </Grid.Column>
                    <Grid.Column
                        only='tablet computer'
                        widescreen={7}
                        largeScreen={5}
                        computer={4}
                        tablet={6}
                        textAlign='right'
                        className='help'
                    >
                        <List floated='right'>
                            <List.Item as='h3'><Translate id='footer.needHelp' /></List.Item>
                            <List.Item as='h3' className='color'>
                                <a href='https://near.chat'>
                                    <Translate id='footer.contactSupport' />
                                </a>
                            </List.Item>
                        </List>
                    </Grid.Column>
                </FooterGrid>
            </>
        )
    }
}

export default Footer
