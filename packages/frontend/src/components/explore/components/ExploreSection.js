import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  border-radius: 16px;
  margin-top: 40px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  background: ${(p) => p.colour};
  height: 57px;
  border-radius: 8px;
  padding: 0 25px;

  & h2 {
    font-weight: 700;
    font-size: 22px;
    line-height: 33px;
    letter-spacing: 0.02em;
    color: #25272A;
    margin: 0;
    margin-left: 10px;
  }

  & a {
    font-weight: 800;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    letter-spacing: -0.01em;
    margin-left: auto;
  }
`;

const ProjectsArea = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`;

const Card = styled.a`
    width: 318px;
    height: 160px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    text-decoration: none!important;
    font-weight: 800;
    font-size: 16px;
    line-height: 28px;
    text-align: center;
    color: #25272A;
    padding: 24px 16px;
    margin-top: 24px;

    @media (max-width: 768px) {
      width: 100%;
    }
`;

const CardHeader = styled.div`
    display: flex;
    margin-bottom: 24px;

    & img {
        margin-right: 12px;
    }
`;

const Meta = styled.div`
    text-align: left;

    & div {
        font-weight: 800;
        font-size: 16px;
        line-height: 21px;
    }

    & span {
        padding: 0px 8px;
        background: #F0F0F1;
        border-radius: 8px;
        font-weight: 500;
        font-size: 14px;
        line-height: 21px;
        text-align: center;
        color: #72727A;
        display: inline-block;
    }
`;

const CardInfo = styled.div`
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    color: #24272A;
    text-align: left;
`;



export default function ({ content }) {
    const { name, icon, sectionLink, colour, projects } = content;
    return (
        <Container>
            <Header colour={colour}>
                <img src={icon} alt={name}/>
                <h2>{name}</h2>
                <a href={`https://awesomenear.com/categories/${sectionLink}`} target='_blank' rel='noopener noreferrer'><Translate id='explore.seeAll'/></a>
            </Header>
            <ProjectsArea>
                {projects.map((el) => (
                    <Card key={el.name} href={`https://awesomenear.com/${el.linkName}`} target='_blank' rel='noopener noreferrer'>
                        <CardHeader>
                            <img src={el.icon} alt={el.name} width='40' height='40'/>
                            <Meta>
                                <div>{el.name}</div>
                                <span>{el.category}</span>
                            </Meta>
                        </CardHeader>
                        <CardInfo>{el.info}</CardInfo>
                    </Card>
                ))}
            </ProjectsArea>
        </Container>
    );
}
