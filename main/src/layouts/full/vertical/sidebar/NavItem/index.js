import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
// mui imports
import {
  ListItemIcon,
  ListItem,
  List,
  styled,
  ListItemText,
  Chip,
  useTheme,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const NavItem = ({ item, level, pathDirect, onClick, hideMenu }) => {
  const customizer = useSelector((state) => state.customizer);
  const Icon = item.icon;
  const theme = useTheme();
  const { t } = useTranslation();
  const itemIcon =
    level > 1 ? <Icon stroke={1.5} size="1rem" /> : <Icon stroke={1.5} size="1.3rem" />;

  const ListItemStyled = styled(ListItem)(() => ({
    whiteSpace: 'nowrap',
    marginBottom: '2px',
    padding: '8px 10px',
    borderRadius: `${customizer.borderRadius}px`,
    backgroundColor: level > 1 ? 'transparent' : '#003859',
    color:
      level > 1 && pathDirect === item.href ? `white !important` : '#bacbe6',
    paddingLeft: hideMenu ? '10px' : level > 2 ? `${level * 15}px` : '10px',
    '&:hover': {
      backgroundColor: 'white',
      color: '#0669a4',
    },
    '&.Mui-selected': {
      color: 'white',
      backgroundColor: '#034165',
      '&:hover': {
        backgroundColor: 'white',
        color: '#0669a4',
      },
    },
  }));

  return (
    <List component="li" disablePadding key={item.id}>
      <ListItemStyled
        button
        component={item.external ? 'a' : NavLink}
        to={item.href}
        href={item.external ? item.href : ''}
        disabled={item.disabled}
        selected={pathDirect === item.href}
        target={item.external ? '_blank' : ''}
        onClick={onClick}
      >
        <ListItemIcon
          sx={{
            minWidth: '36px',
            p: '3px 0',
            color:
              level > 1 && pathDirect === item.href
                ? `white !important`
                : 'inherit',
          }}
        >
          {itemIcon}
        </ListItemIcon>
        <ListItemText>
          {hideMenu ? '' : <>{t(`${item.title}`)}</>}
          <br />
          {item.subtitle ? (
            <Typography variant="caption">{hideMenu ? '' : item.subtitle}</Typography>
          ) : (
            ''
          )}
        </ListItemText>

        {!item.chip || hideMenu ? null : (
          <Chip
            color={item.chipColor}
            variant={item.variant ? item.variant : 'filled'}
            size="small"
            label={item.chip}
          />
        )}
      </ListItemStyled>
    </List>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  pathDirect: PropTypes.any,
  hideMenu: PropTypes.any,
  onClick: PropTypes.func,
};

export default NavItem;
