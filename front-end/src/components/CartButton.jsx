import * as React from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Badge, { badgeClasses } from '@mui/material/Badge';
import ShoppingCart from '@mui/icons-material/ShoppingCartOutlined';
import http from '../http';

function CartButton({cartLength}) {
    const CartBadge = styled(Badge)`
    & .${badgeClasses.badge} {
        top: -12px;
        right: -6px;
    }
    `;

  return (
    <IconButton>
        <ShoppingCart sx={{color: "white", width: "30px", height: "30px"}}/>
        <CartBadge badgeContent={cartLength} color='primary' overlap='circular'/>
    </IconButton>
  )
}

export default CartButton