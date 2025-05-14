import React from 'react';
import {
  Grid, List, ListItem, ListItemIcon, ListItemText, Button, Divider, CardHeader, Stack, Paper
} from '@mui/material';
import { IconChevronRight, IconChevronLeft } from "@tabler/icons";
import CustomCheckbox from "../../forms/theme-elements/CustomCheckbox";

function not(a, b) {
  return a.filter((value) => b.findIndex((item) => item.pant_Id === value.pant_Id) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.findIndex((item) => item.pant_Id === value.pant_Id) !== -1);
}

const EnhancedTransferList = ({ left, right, setRight, leftTitle, rightTitle, leftKey, leftLabel }) => {
  const [checked, setChecked] = React.useState([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.findIndex((item) => item.pant_Id === value.pant_Id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleCheckedRight = () => {
    setRight([...right, ...leftChecked]);
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title, items) => (
    <Paper variant="outlined">
      <CardHeader
        sx={{ px: 2 }}
        title={title}
        subheader={`${items.length} seleccionadas`}
      />
      <Divider />
      <List
        sx={{
          width: 300,
          height: 300,
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((item) => {
          const labelId = `transfer-list-item-${item[leftKey]}-label`;

          return (
            <ListItem
              key={item[leftKey]}
              role="listitem"
              button
              onClick={handleToggle(item)}
            >
              <ListItemIcon>
                <CustomCheckbox
                  checked={checked.findIndex((checkedItem) => checkedItem[leftKey] === item[leftKey]) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={item[leftLabel]} />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>{customList(leftTitle, left)}</Grid>
      <Grid item>
        <Stack spacing={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            <IconChevronRight width={20} height={20} />
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            <IconChevronLeft width={20} height={20} />
          </Button>
        </Stack>
      </Grid>
      <Grid item>{customList(rightTitle, right)}</Grid>
    </Grid>
  );
};

export default EnhancedTransferList;