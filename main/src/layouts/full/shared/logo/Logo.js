import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ReactComponent as LogoDark } from 'src/assets/images/logos/LOGO.svg';
import { ReactComponent as LogoDarkRTL } from 'src/assets/images/logos/LOGO.svg';
import { ReactComponent as LogoLight } from 'src/assets/images/logos/LOGO.svg';
import { ReactComponent as LogoLightRTL } from 'src/assets/images/logos/LOGO.svg';
import { styled } from '@mui/material';

const Logo = () => {
  const customizer = useSelector((state) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? '40px' : '180px',
    overflow: 'hidden',
    display: 'block',
  }));

  if (customizer.activeDir === 'ltr') {
    return (
      <LinkStyled to="/">
        {customizer.activeMode === 'light' ? (
          <LogoLight height={customizer.TopbarHeight} />
        ) : (
          <LogoDark height={customizer.TopbarHeight} />
        )}
      </LinkStyled>
    );
  }
  return (
    <LinkStyled to="/">
      {customizer.activeMode === 'light' ? (
        <LogoDarkRTL height={customizer.TopbarHeight} />
      ) : (
        <LogoLightRTL height={customizer.TopbarHeight} />
      )}
    </LinkStyled>
  );
};

export default Logo;
