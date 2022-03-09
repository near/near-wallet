import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import TokenIcon from '../../send/components/TokenIcon';
import TokenAmount from '../../wallet/TokenAmount';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #FFFFFF;
  box-shadow: 0px 54px 80px rgba(0, 0, 0, 0.03), 0px 12.0616px 17.869px rgba(0, 0, 0, 0.0178832), 0px 3.59106px 5.32008px rgba(0, 0, 0, 0.0121168);
  border-radius: 8px;
  width: 343px;
  height: 234px;

  .token-info {
    display: flex;
    align-items: center;
    padding: 16px;
    width: 100%;

    .elipse {
      width: 8px;
      height: 8px;
      background-color: #4DD5A6;
      border-radius: 50%;
      display: inline-block;
      margin-right: 6px;
    }

    .icon {
      width: 32px;
      height: 32px;
      min-width: 32px;
      min-height: 32px;
      margin-right: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-radius: 50%;
      align-self: center;

      img, svg {
          height: 32px;
          width: 32px;
      }
    }

    .symbol {
      font-weight: 700;
      font-size: 16px;
      color: #24272a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
      margin-right: 10px;


      a {
          color: inherit;
      }
    }
  }

  .divider {
    margin: 0 !important;
  }

  .stake-box {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 24px 16px 0px 16px;

    .title {
      font-size: 14px;
      font-weight: 500;
      text-align: left;
      color: #A2A2A8;
      margin-bottom: 4px;
    }

    .balance {
      font-size: 16px;
      font-weight: 700;
      text-align: left;
      color: #000000;
    }

    .reward {
      color: #00C08B;
    }

  }

`;


const TokenStakeRewards = ({earnedToken, stakedToken}) => {
  return (
    <Container>
      <div className='token-info'>
        <div className='elipse'/>
        <div className='icon'>
          <TokenIcon symbol={earnedToken.onChainFTMetadata?.symbol} icon={earnedToken.onChainFTMetadata?.icon}/>
        </div>
        {earnedToken.contractName ?
          <span className='symbol' title={earnedToken.contractName}>
            {earnedToken.contractName}
          </span>
          :
          <span className='symbol'>
              {earnedToken.onChainFTMetadata?.symbol}
          </span>
        }
      </div>
      <div className='divider' />
      <div className='stake-box'>
        <div className='title'>
          <Translate id='staking.validator.activeStake'/>
        </div>
        <TokenAmount
            token={stakedToken}
            className="balance"
            withSymbol={true}
            showFiatAmount={false}
        />
      </div>
      <div className='stake-box'>
        <div className='title'>
          <Translate id='staking.validator.rewards'/>
        </div>
        <TokenAmount
            token={earnedToken}
            className="balance reward"
            withSymbol={true}
            showFiatAmount={false}
            balancePrefix='+'
        />
      </div>
    </Container>
  );
};

export default TokenStakeRewards;
