import React from 'react';
import styled, {css} from 'styled-components';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon   from '@mui/icons-material/ArrowBack';
const StyledButton = ({ title, event, variant = 'default',type = "button" }) => {
   let IconComponent;

  switch (variant) {
    case 'save':
      IconComponent = SaveIcon;
      break;
    case 'cancel':
      IconComponent = CancelIcon;
      break;
    case 'finish':
      IconComponent = CheckIcon;
      break;
    case 'sig':
      IconComponent = ArrowForwardIcon;
      break;
     case 'back':
      IconComponent = ArrowBackIcon;
      break;
    default:
      IconComponent = AddIcon;
      break;
  }
  return (
     <StyledWrapper variant={variant}>
      <button onClick={type === "submit" ? undefined : event}
        type={type} className="button">
        <span className="button__text">{title}</span>
        <span className="button__icon"><IconComponent sx={{ color: '#fff' }} /></span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  ${({ variant }) => {
    let colors;

    switch (variant) {
      case 'finish':
        colors = {
          fontColor: '#004d00',
          bgColor: '#d9f2d9',
          bgColorSub: '#28a745',
          mainColor: '#218838',
        };
        break;
      case 'cancel':
        colors = {
          fontColor: '#7a0000',
          bgColor: '#f9d6d5',
          bgColorSub: '#dc3545',
          mainColor: '#c82333',
        };
        break;
      case 'save':
        colors = {
          fontColor: 'rgb(0 58 93)',
          bgColor: '#d9e7ef',
          bgColorSub: 'rgb(19 86 125)',
          mainColor: 'rgb(0, 65, 119)',
        };
        break;
      default:
        colors = {
          fontColor: 'rgb(0 58 93)',
          bgColor: '#d9e7ef',
          bgColorSub: 'rgb(19 86 125)',
          mainColor: 'rgb(0, 65, 119)',
        };
    }

    return css`
      .button {
        --font-color: ${colors.fontColor};
        --bg-color: ${colors.bgColor};
        --bg-color-sub: ${colors.bgColorSub};
        --main-color: ${colors.mainColor};
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

      .button:hover .button__text {
        color: transparent;
      }

      .button:hover .button__icon {
        width: 148px;
        transform: translateX(0);
      }

      .button:hover {
        background: var(--bg-color);
      }

      .button:active {
        transform: translate(3px, 3px);
        box-shadow: 0px 0px var(--main-color);
      }
    `;
  }}
`;


export default StyledButton;

