import { useState, useEffect } from "react";
import createPersistedState from "use-persisted-state";
import { differenceInDays } from "date-fns";

import { makeStyles, createStyles } from "@material-ui/styles";
import {
  MenuItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

import meta from "../../../package.json";
import WIKI_LINKS from "constants/wikiLinks";

const useLastCheckedUpdateState = createPersistedState(
  "_FT_LAST_CHECKED_UPDATE"
);
export const useLatestUpdateState = createPersistedState("_FT_LATEST_UPDATE");

const useStyles = makeStyles((theme) =>
  createStyles({
    secondaryAction: { pointerEvents: "none" },
    secondaryIcon: {
      display: "block",
      color: theme.palette.action.active,
    },
  })
);

export default function UpdateChecker() {
  const classes = useStyles();

  const [
    lastCheckedUpdate,
    setLastCheckedUpdate,
  ] = useLastCheckedUpdateState<string>();
  const [latestUpdate, setLatestUpdate] = useLatestUpdateState<null | Record<
    string,
    any
  >>(null);

  const [checkState, setCheckState] = useState<null | "LOADING" | "NO_UPDATE">(
    null
  );

  const checkForUpdate = async () => {
    setCheckState("LOADING");

    // https://docs.github.com/en/rest/reference/repos#get-the-latest-release
    const endpoint = meta.repository.url
      .replace("github.com", "api.github.com/repos")
      .replace(/.git$/, "/releases/latest");
    try {
      const res = await fetch(endpoint, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      });
      const json = await res.json();

      if (json.tag_name > "v" + meta.version) {
        setLatestUpdate(json);
        setCheckState(null);
      } else {
        setCheckState("NO_UPDATE");
      }

      setLastCheckedUpdate(new Date().toISOString());
    } catch (e) {
      console.error(e);
      setLatestUpdate(null);
      setCheckState("NO_UPDATE");
    }
  };

  // Check for new updates on page load, if last check was more than 7 days ago
  useEffect(() => {
    if (!lastCheckedUpdate) checkForUpdate();
    else if (differenceInDays(new Date(), new Date(lastCheckedUpdate)) > 7)
      checkForUpdate();
  }, [lastCheckedUpdate]);

  // Verify latest update is not installed yet
  useEffect(() => {
    if (latestUpdate?.tag_name <= "v" + meta.version) setLatestUpdate(null);
  }, [latestUpdate, setLatestUpdate]);

  if (checkState === "LOADING")
    return <MenuItem disabled>Checking for updates…</MenuItem>;
  if (checkState === "NO_UPDATE")
    return <MenuItem disabled>No updates available</MenuItem>;
  if (latestUpdate === null)
    return <MenuItem onClick={checkForUpdate}>Check for updates</MenuItem>;

  return (
    <>
      <MenuItem
        component="a"
        href={latestUpdate?.html_url}
        target="_blank"
        rel="noopener"
      >
        <ListItemText
          primary="Update available"
          secondary={latestUpdate?.tag_name}
        />
        <ListItemSecondaryAction className={classes.secondaryAction}>
          <OpenInNewIcon className={classes.secondaryIcon} />
        </ListItemSecondaryAction>
      </MenuItem>

      <MenuItem
        component="a"
        href={WIKI_LINKS.updatingFiretable}
        target="_blank"
        rel="noopener"
      >
        <ListItemText secondary="How to update Firetable" />
        <ListItemSecondaryAction className={classes.secondaryAction}>
          <OpenInNewIcon
            color="secondary"
            fontSize="small"
            className={classes.secondaryIcon}
          />
        </ListItemSecondaryAction>
      </MenuItem>
    </>
  );
}
