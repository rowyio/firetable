export enum routes {
  home = "/",
  auth = "/auth",
  impersonatorAuth = "/impersonatorAuth",
  jwtAuth = "/jwtAuth",
  signOut = "/signOut",
  authSetup = "/authSetup",

  table = "/table",
  tableGroup = "/tableGroup",

  headlessTableWithId = "/headless/:id",
  HeadlessTableGroupWithId = "/headlessGroup/:id",
  tableWithId = "/table/:id",
  tableGroupWithId = "/tableGroup/:id",
  grid = "/grid",
  gridWithId = "/grid/:id",
  editor = "/editor",
}

export default routes;
