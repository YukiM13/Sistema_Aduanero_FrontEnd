import React from 'react';
import styled from 'styled-components';

const StyledButton = ({title, event}) => {
  return (
    <StyledWrapper>
      <button onClick={event} className="button">
        <span className="button__text">{title}</span>
        <span className="button__icon"><svg className="svg" fill="none" height={24} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" width={24} xmlns="http://www.w3.org/2000/svg"><line x1={12} x2={12} y1={5} y2={19} /><line x1={5} x2={19} y1={12} y2={12} /></svg></span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    --main-focus: #13567d;
    --font-color: rgb(0 58 93);
    --bg-color-sub: rgb(19 86 125);
    --bg-color: #d9e7ef;
    --main-color: rgb(0, 65, 119);
    position: relative;
    width: 150px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    border: 2px solid var(--main-color);
    box-shadow: 2px 2px var(--main-color);
    background-color: var(--bg-color);
    border-radius: 10px;
    overflow: hidden;
  }

  .button, .button__icon, .button__text {
    transition: all 0.3s;
  }

  .button .button__text {
    transform: translateX(22px);
    color: var(--font-color);
    font-weight: 600;
  }

  .button .button__icon {
    position: absolute;
    transform: translateX(109px);
    height: 100%;
    width: 39px;
    background-color: var(--bg-color-sub);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button .svg {
    width: 20px;
    fill: var(--main-color);
  }

  .button:hover {
    background: var(--bg-color);
  }

  .button:hover .button__text {
    color: transparent;
  }

  .button:hover .button__icon {
    width: 148px;
    transform: translateX(0);
  }

  .button:active {
    transform: translate(3px, 3px);
    box-shadow: 0px 0px var(--main-color);
  }`;

export default StyledButton;
