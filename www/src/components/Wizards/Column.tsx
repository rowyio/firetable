import clsx from "clsx";

import { makeStyles, createStyles } from "@material-ui/styles";
import { Grid, GridProps, Typography } from "@material-ui/core";
import { alpha } from "@material-ui/core/styles";

import { FieldType } from "constants/fields";
import { getFieldProp } from "components/fields";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
      height: 44,
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.default,

      padding: theme.spacing(0, 1, 0, 1.5),

      color: theme.palette.text.secondary,
      "&:hover": { color: theme.palette.text.primary },

      "& svg": { display: "block" },
    },

    active: {
      backgroundColor: alpha(
        theme.palette.primary.main,
        theme.palette.action.selectedOpacity
      ),
      color:
        theme.palette.mode === "dark"
          ? theme.palette.text.primary
          : theme.palette.primary.dark,
      borderColor: alpha(
        theme.palette.primary.main,
        theme.palette.action.disabledOpacity
      ),

      "&:hover": {
        color:
          theme.palette.mode === "dark"
            ? theme.palette.text.primary
            : theme.palette.primary.dark,
      },
    },

    columnNameContainer: {
      flexShrink: 1,
      overflow: "hidden",
    },
    columnName: {
      lineHeight: "44px",
      display: "block",

      userSelect: "none",

      marginLeft: theme.spacing(0.5),
    },

    secondaryItem: { marginLeft: theme.spacing(1) },
  })
);

export interface IColumnProps extends Partial<GridProps> {
  label: string;
  type?: FieldType;
  secondaryItem?: React.ReactNode;

  active?: boolean;
}

export default function Column({
  label,
  type,
  secondaryItem,

  active,
  ...props
}: IColumnProps) {
  const classes = useStyles();

  return (
    <Grid
      container
      alignItems="center"
      wrap="nowrap"
      {...props}
      className={clsx(classes.root, active && classes.active, props.className)}
    >
      {type && <Grid item>{getFieldProp("icon", type)}</Grid>}

      <Grid item xs className={classes.columnNameContainer}>
        <Typography
          component={Grid}
          item
          variant="subtitle2"
          noWrap
          className={classes.columnName}
        >
          {label}
        </Typography>
      </Grid>

      {secondaryItem && (
        <Grid item className={classes.secondaryItem}>
          {secondaryItem}
        </Grid>
      )}
    </Grid>
  );
}
