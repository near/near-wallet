import React, { Component, Fragment } from 'react'

import styled from 'styled-components'

const Top = styled(`div`)`
   @media screen and (max-width: 991px) {
      height: ${props => props.height}px ;

      > #topR {
         overflow: hidden;
      }
   }
`
const Bottom = styled(`div`)`

`

class MobileContainer extends Component {
    state = {
        topHeight: 0
    }

    componentDidMount = () => {
        this.setState(() => ({
            topR: document.getElementById('topR').clientHeight
        }))

        this.updateInnerHeight()
        window.addEventListener('resize', this.updateInnerHeight);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateInnerHeight);
    }

    updateInnerHeight = () => {
        const page = window.innerHeight - (72 + 16)
        const bottom = document.getElementById('bottom').clientHeight
        const topR = document.getElementById('topR').clientHeight

        this.setState(() => ({
            topHeight: page - bottom < topR ? 0 : page - bottom
        }))
    }

    render() {
        const { children } = this.props

        return (
            <Fragment>
                <Top id='top' height={this.state.topHeight || ''}>
                    <div id='topR'>
                        {children[0]}
                    </div>
                </Top>
                <Bottom id='bottom'>
                    {children[1]}
                </Bottom>
            </Fragment>
        )
    }
}

export default MobileContainer
