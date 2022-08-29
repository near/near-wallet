import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import trandingProjectsIcon from '../media/trandingProjects.svg';


const Container = styled.div`
  width: 100%;
  background: linear-gradient(93.02deg, #CEF0FF -68.39%, #EDFCFF 14.93%, #D6DFFE 100%);
  border-radius: 16px;
  padding: 25px;
  margin-top: 25px;
  margin-bottom: 50px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;

  & > h2 {
    font-weight: 700;
    font-size: 22px;
    line-height: 33px;
    letter-spacing: 0.02em;
    color: #25272A;
    margin: 0;
    margin-left: 10px;
  }
`;

const ProjectsArea = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;

  & a {
    min-width: 132px;
    min-height: 117px;
    text-decoration: none!important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: 800;
    font-size: 16px;
    line-height: 28px;
    text-align: center;
    color: #25272A;
    margin: 16px 0;

    & img {
      margin-bottom: 9px;
    }
  }
`;

export default function ({ projects }) {
    return (
        <Container>
            <Header>
                <img src={trandingProjectsIcon} alt="Tranding projects"/>
                <h2><Translate id='explore.trendingProjects'/></h2>
            </Header>
            <ProjectsArea>
                {projects.map((el) => (
                    <a key={el.name} href={`https://awesomenear.com/${el.linkName}`} target='_blank' rel='noopener noreferrer'>
                        <img src={el.icon} alt={el.name} width='80' height='80'/>
                        <div>{el.name}</div>
                    </a>
                ))}
            </ProjectsArea>
        </Container>
    );
}
