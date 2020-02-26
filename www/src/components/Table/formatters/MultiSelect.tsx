import React from "react";
import clsx from "clsx";
import withCustomCell, { CustomCellProps } from "./withCustomCell";

import { makeStyles, createStyles, Grid, Chip } from "@material-ui/core";

import _MultiSelect from "components/MultiSelect";
import { FieldType } from "constants/fields";
import { useFiretableContext } from "contexts/firetableContext";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      minWidth: 0,

      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    fullHeight: {
      height: "100%",
      font: "inherit",
      color: "inherit",
      letterSpacing: "inherit",
    },

    select: {
      padding: theme.spacing(0, 3, 0, 1.5),
      display: "flex",
      alignItems: "center",

      "&&": { paddingRight: theme.spacing(4) },
    },
    icon: { marginRight: theme.spacing(1) },

    chipList: {
      overflowX: "hidden",
      width: "100%",
    },
    chip: { cursor: "inherit" },
  })
);

function MultiSelect({
  row,
  rowIdx,
  column,
  value,
  onSubmit,
}: CustomCellProps) {
  const classes = useStyles();

  const { options } = column as any;
  const { setSelectedCell } = useFiretableContext();

  // Support SingleSelect field
  const isSingle = (column as any).type === FieldType.singleSelect;

  // If SingleSelect, transform string to array of strings
  const transformedValue = isSingle
    ? (([value] as unknown) as string[])
    : value;
  // And support transforming array of strings back to string
  const handleChange = value => onSubmit(isSingle ? value.join(", ") : value);

  // Render chips
  const renderValue = value => (
    <Grid container spacing={1} wrap="nowrap" className={classes.chipList}>
      {value?.map(
        item =>
          typeof item === "string" && (
            <Grid item key={item}>
              <Chip label={item} className={classes.chip} />
            </Grid>
          )
      )}
    </Grid>
  );

  const onClick = e => {
    setSelectedCell!({ row: rowIdx, column: column.key });
    e.stopPropagation();
  };

  return (
    <_MultiSelect
      value={transformedValue}
      onChange={handleChange}
      label={column.name}
      options={options}
      TextFieldProps={{
        fullWidth: true,
        label: "",
        hiddenLabel: true,
        variant: "standard" as "filled",
        InputProps: {
          disableUnderline: true,
          classes: { root: classes.fullHeight },
        },
        SelectProps: {
          classes: {
            root: clsx(classes.fullHeight, classes.select),
            icon: classes.icon,
          },
          renderValue,
          MenuProps: {
            anchorOrigin: { vertical: "bottom", horizontal: "left" },
            transformOrigin: { vertical: "top", horizontal: "left" },
          },
        },
        onClick,
      }}
      freeText
      className={clsx(classes.fullHeight, classes.root)}
      multiple={!isSingle}
    />
  );
}

export default withCustomCell(MultiSelect);