"use strict";
const electron = require("electron");
const LICENSE_EXPIRED = "licenseExpired";
function licenseFailureKind(error) {
  if (typeof error === "object" && error !== null && Reflect.get(error, "kind") === LICENSE_EXPIRED) {
    return LICENSE_EXPIRED;
  }
  const message = error instanceof Error ? error.message : typeof error === "string" ? error : "";
  return message.includes(LICENSE_EXPIRED) ? LICENSE_EXPIRED : null;
}
const DEVICE_FAILURE_KINDS = [
  "sdkNotFound",
  "adbFailed",
  "noDevices",
  "unauthorized",
  "offline",
  "deviceNotFound",
  "deviceNotBooted",
  "bootTimedOut",
  "streamDisconnected",
  "streamStartFailed",
  "inputUnavailable",
  "connectTimedOut",
  /** adb lost the device itself: a wireless device left the network, a cable was
   *  pulled. Not `deviceNotFound`, which means we do not know that device at
   *  all — a wireless serial is an address, so it stays the way back to it. */
  "deviceDisconnected"
];
new Set(DEVICE_FAILURE_KINDS);
const DEVICE_STREAM_WINDOW_MESSAGE = "maestri:device:streamTransfer";
const C = {
  appInfo: "maestri:app:info",
  codexIsMissingFlag: "maestri:codex:isMissingFlag",
  appDiagnosticReport: "maestri:app:diagnosticReport",
  appSaveDiagnosticReport: "maestri:app:saveDiagnosticReport",
  appSetLocale: "maestri:app:setLocale",
  appPickDirectory: "maestri:app:pickDirectory",
  appLocalDirectorySuggestions: "maestri:app:localDirectorySuggestions",
  appDirectoryState: "maestri:app:directoryState",
  appCreateDirectory: "maestri:app:createDirectory",
  appQuit: "maestri:app:quit",
  appHideToTray: "maestri:app:hideToTray",
  windowControlsState: "maestri:windowControls:state",
  windowControlsMinimize: "maestri:windowControls:minimize",
  windowControlsToggleMaximize: "maestri:windowControls:toggleMaximize",
  windowControlsClose: "maestri:windowControls:close",
  windowControlsOnChanged: "maestri:windowControls:onChanged",
  appListIdes: "maestri:app:listIdes",
  appOpenInIde: "maestri:app:openInIde",
  appShowEmojiPanel: "maestri:app:showEmojiPanel",
  appRendererBooted: "maestri:app:rendererBooted",
  appRendererFault: "maestri:app:rendererFault",
  appShutdown: "maestri:app:shutdown",
  appShutdownPainted: "maestri:app:shutdownPainted",
  appStateGet: "maestri:appState:get",
  appStateSetOnboardingCompleted: "maestri:appState:setOnboardingCompleted",
  appStateSetHasSeenFloorOnboarding: "maestri:appState:setHasSeenFloorOnboarding",
  updatesState: "maestri:updates:state",
  updatesCheck: "maestri:updates:check",
  updatesOnProgress: "maestri:updates:onProgress",
  updatesRestartAndInstall: "maestri:updates:restartAndInstall",
  preferencesGet: "maestri:preferences:get",
  preferencesSet: "maestri:preferences:set",
  preferencesOnChanged: "maestri:preferences:onChanged",
  preferencesSubscribe: "maestri:preferences:subscribe",
  preferencesUnsubscribe: "maestri:preferences:unsubscribe",
  partituraList: "maestri:partitura:list",
  partituraSave: "maestri:partitura:save",
  partituraDelete: "maestri:partitura:delete",
  partituraExportOne: "maestri:partitura:exportOne",
  partituraExportAll: "maestri:partitura:exportAll",
  partituraPickFiles: "maestri:partitura:pickFiles",
  partituraReadFiles: "maestri:partitura:readFiles",
  partituraReadOpenedFiles: "maestri:partitura:readOpenedFiles",
  partituraChanged: "maestri:partitura:changed",
  partituraOpenRequested: "maestri:partitura:openRequested",
  workspaceList: "maestri:workspace:list",
  workspaceCreate: "maestri:workspace:create",
  workspacePatch: "maestri:workspace:patch",
  workspaceDelete: "maestri:workspace:delete",
  workspaceDuplicate: "maestri:workspace:duplicate",
  workspaceExport: "maestri:workspace:export",
  workspaceImport: "maestri:workspace:import",
  workspaceImportOpened: "maestri:workspace:importOpened",
  workspaceImportComplete: "maestri:workspace:importComplete",
  workspaceOpenRequested: "maestri:workspace:openRequested",
  workspaceUnload: "maestri:workspace:unload",
  workspaceReveal: "maestri:workspace:reveal",
  workspaceSwitch: "maestri:workspace:switch",
  workspaceSetPreferredIde: "maestri:workspace:setPreferredIde",
  workspaceOnChanged: "maestri:workspace:onChanged",
  workspaceOnDeleted: "maestri:workspace:onDeleted",
  workspaceOnLevelsUnloaded: "maestri:workspace:onLevelsUnloaded",
  workspaceGetActiveId: "maestri:workspace:getActiveId",
  workspaceSetFloorStatus: "maestri:workspace:setFloorStatus",
  workspaceReorderFloor: "maestri:workspace:reorderFloor",
  workspaceUndo: "maestri:workspace:undo",
  workspaceRedo: "maestri:workspace:redo",
  workspaceBeginUndoGroup: "maestri:workspace:beginUndoGroup",
  workspaceEndUndoGroup: "maestri:workspace:endUndoGroup",
  workspaceConfigFilesStatus: "maestri:workspace:configFiles:status",
  workspaceConfigFilesRead: "maestri:workspace:configFiles:read",
  workspaceConfigFilesWrite: "maestri:workspace:configFiles:write",
  workspaceConfigFilesRemove: "maestri:workspace:configFiles:remove",
  workspaceConfigFilesSync: "maestri:workspace:configFiles:sync",
  floorIsolationAvailable: "maestri:floor:isolationAvailable",
  floorCanCopy: "maestri:floor:canCopy",
  floorCreateKind: "maestri:floor:createKind",
  floorCreate: "maestri:floor:create",
  floorCreateIsolated: "maestri:floor:createIsolated",
  floorReviewList: "maestri:floor:reviewList",
  floorReviewNumber: "maestri:floor:reviewNumber",
  floorReviewSource: "maestri:floor:reviewSource",
  floorReviewName: "maestri:floor:reviewName",
  floorReviewCreate: "maestri:floor:reviewCreate",
  floorListBranches: "maestri:floor:listBranches",
  floorCancelIsolated: "maestri:floor:cancelIsolated",
  floorSeedProgress: "maestri:floor:seedProgress",
  floorRename: "maestri:floor:rename",
  floorSwitch: "maestri:floor:switch",
  floorDelete: "maestri:floor:delete",
  floorRemoveBranch: "maestri:floor:removeBranch",
  floorLandingPreflight: "maestri:floor:landingPreflight",
  floorLandingPreview: "maestri:floor:landingPreview",
  floorLandingFileDiff: "maestri:floor:landingFileDiff",
  floorLand: "maestri:floor:land",
  floorLandingRemoveBranch: "maestri:floor:landingRemoveBranch",
  floorOnLanding: "maestri:floor:onLanding",
  floorOnRemovingChanged: "maestri:floor:onRemovingChanged",
  floorRemoving: "maestri:floor:removing",
  floorTestLanding: "maestri:floor:testLanding",
  floorSnapshotCapture: "maestri:floorSnapshot:capture",
  floorHooksGet: "maestri:floorHooks:get",
  floorHooksReplace: "maestri:floorHooks:replace",
  floorHooksRun: "maestri:floorHooks:run",
  floorHooksStop: "maestri:floorHooks:stop",
  floorHooksRunSection: "maestri:floorHooks:runSection",
  floorHooksClearResult: "maestri:floorHooks:clearResult",
  floorHooksClearAllResults: "maestri:floorHooks:clearAllResults",
  floorHooksRuns: "maestri:floorHooks:runs",
  floorHooksOnRunsChanged: "maestri:floorHooks:onRunsChanged",
  floorHooksReadOutput: "maestri:floorHooks:readOutput",
  floorHooksOnOutput: "maestri:floorHooks:onOutput",
  floorHooksWrite: "maestri:floorHooks:write",
  floorHooksResize: "maestri:floorHooks:resize",
  nodeCreate: "maestri:node:create",
  nodePatch: "maestri:node:patch",
  nodePatchFrames: "maestri:node:patchFrames",
  nodeDelete: "maestri:node:delete",
  nodeDeleteMany: "maestri:node:deleteMany",
  nodeUnload: "maestri:node:unload",
  nodeSetRedacted: "maestri:node:setRedacted",
  groupCreate: "maestri:group:create",
  groupUngroup: "maestri:group:ungroup",
  groupRename: "maestri:group:rename",
  groupSetColor: "maestri:group:setColor",
  noteStackCreate: "maestri:noteStack:create",
  noteStackFileSelection: "maestri:noteStack:fileSelection",
  noteStackAddNotes: "maestri:noteStack:addNotes",
  noteStackAddPage: "maestri:noteStack:addPage",
  noteStackSpill: "maestri:noteStack:spill",
  noteStackUnstack: "maestri:noteStack:unstack",
  noteStackDeleteKeepingNotes: "maestri:noteStack:deleteKeepingNotes",
  noteStackMoveMember: "maestri:noteStack:moveMember",
  noteStackSetFront: "maestri:noteStack:setFront",
  noteStackRename: "maestri:noteStack:rename",
  noteStackClearCustomName: "maestri:noteStack:clearCustomName",
  noteStackFileDroppedNote: "maestri:noteStack:fileDroppedNote",
  noteStackMoveBetween: "maestri:noteStack:moveBetween",
  noteStackToggleUniformColor: "maestri:noteStack:toggleUniformColor",
  noteStackSetNoteColor: "maestri:noteStack:setNoteColor",
  noteStackSetEngaged: "maestri:noteStack:setEngaged",
  bandCreate: "maestri:band:create",
  bandAddTerminals: "maestri:band:addTerminals",
  bandRemoveMember: "maestri:band:removeMember",
  bandMoveMemberBetween: "maestri:band:moveMemberBetween",
  bandDissolve: "maestri:band:dissolve",
  bandMoveMember: "maestri:band:moveMember",
  bandSetOrder: "maestri:band:setOrder",
  bandSelect: "maestri:band:select",
  bandUpdate: "maestri:band:update",
  bandRename: "maestri:band:rename",
  bandSetSidebarWidth: "maestri:band:setSidebarWidth",
  bandAddNewMember: "maestri:band:addNewMember",
  bandAsksInFlight: "maestri:band:asksInFlight",
  agentAssignRole: "maestri:agent:assignRole",
  agentListWslDistros: "maestri:agent:listWslDistros",
  agentListShells: "maestri:agent:listShells",
  agentLocateLocalTmux: "maestri:agent:locateLocalTmux",
  agentDiscoverRoles: "maestri:agent:discoverRoles",
  agentValidateWslDirectory: "maestri:agent:validateWslDirectory",
  agentDirectorySuggestions: "maestri:agent:directorySuggestions",
  agentListDockerContainers: "maestri:agent:listDockerContainers",
  agentTestDockerConnection: "maestri:agent:testDockerConnection",
  agentListSandboxes: "maestri:agent:listSandboxes",
  agentListSandboxAgents: "maestri:agent:listSandboxAgents",
  agentCreateSandbox: "maestri:agent:createSandbox",
  agentTestSandboxConnection: "maestri:agent:testSandboxConnection",
  drawingCreate: "maestri:drawing:create",
  drawingRecognize: "maestri:drawing:recognize",
  drawingPatch: "maestri:drawing:patch",
  drawingDelete: "maestri:drawing:delete",
  drawingGroup: "maestri:drawing:group",
  drawingUngroup: "maestri:drawing:ungroup",
  terminalSpawn: "maestri:terminal:spawn",
  terminalWrite: "maestri:terminal:write",
  terminalDeliverPrompt: "maestri:terminal:deliverPrompt",
  terminalDims: "maestri:terminal:dims",
  terminalResize: "maestri:terminal:resize",
  terminalKill: "maestri:terminal:kill",
  terminalRestart: "maestri:terminal:restart",
  terminalDiscardResume: "maestri:terminal:discardResume",
  terminalAttach: "maestri:terminal:attach",
  terminalGetScrollback: "maestri:terminal:getScrollback",
  terminalOnData: "maestri:terminal:onData",
  terminalOnExit: "maestri:terminal:onExit",
  terminalOnStatus: "maestri:terminal:onStatus",
  terminalActivity: "maestri:terminal:activity",
  terminalMemory: "maestri:terminal:memory",
  terminalOnMemory: "maestri:terminal:onMemory",
  terminalProcessList: "maestri:terminal:processList",
  terminalProcessStop: "maestri:terminal:processStop",
  terminalTmuxSession: "maestri:terminal:tmuxSession",
  terminalEndTmuxSession: "maestri:terminal:endTmuxSession",
  terminalRemoteSessionProcesses: "maestri:terminal:remoteSessionProcesses",
  terminalStopRemoteSessionProcess: "maestri:terminal:stopRemoteSessionProcess",
  terminalRoleInstallFailures: "maestri:terminal:roleInstallFailures",
  accountsView: "maestri:accounts:view",
  accountsAdd: "maestri:accounts:add",
  accountsAddApiKey: "maestri:accounts:addApiKey",
  accountsReplaceKey: "maestri:accounts:replaceKey",
  accountsSetEndpoint: "maestri:accounts:setEndpoint",
  accountsSignOut: "maestri:accounts:signOut",
  accountsRename: "maestri:accounts:rename",
  accountsRemove: "maestri:accounts:remove",
  accountsMoveToDefault: "maestri:accounts:moveToDefault",
  accountsWatchSignIn: "maestri:accounts:watchSignIn",
  accountsWatchSignOut: "maestri:accounts:watchSignOut",
  accountsRefresh: "maestri:accounts:refresh",
  accountsRefreshPlace: "maestri:accounts:refreshPlace",
  accountsSignOutAll: "maestri:accounts:signOutAll",
  accountsKeepsSessionAlive: "maestri:accounts:keepsSessionAlive",
  accountsSetTerminal: "maestri:accounts:setTerminal",
  accountsDescribe: "maestri:accounts:describe",
  accountsOnChanged: "maestri:accounts:onChanged",
  accountsOnSignedIn: "maestri:accounts:onSignedIn",
  accountsProviders: "maestri:accounts:providers",
  accountsSetProvidersViewer: "maestri:accounts:setProvidersViewer",
  accountsOnProvidersChanged: "maestri:accounts:onProvidersChanged",
  accountsApproveProvider: "maestri:accounts:approveProvider",
  accountsRestoreBuiltInProviders: "maestri:accounts:restoreBuiltInProviders",
  accountsRestoreProvider: "maestri:accounts:restoreProvider",
  accountsRevealProvidersFolder: "maestri:accounts:revealProvidersFolder",
  accountsRevealProviderFile: "maestri:accounts:revealProviderFile",
  terminalOnRoleInstallFailures: "maestri:terminal:onRoleInstallFailures",
  terminalMarkSeen: "maestri:terminal:markSeen",
  terminalSetFocused: "maestri:terminal:setFocused",
  terminalFocusRequested: "maestri:terminal:focusRequested",
  terminalOnGeometryPinned: "maestri:terminal:onGeometryPinned",
  terminalPublishLiveColors: "maestri:terminal:publishLiveColors",
  noteRead: "maestri:note:read",
  noteWrite: "maestri:note:write",
  noteEdit: "maestri:note:edit",
  noteRename: "maestri:note:rename",
  noteOnChange: "maestri:note:onChange",
  noteAttachImage: "maestri:note:attachImage",
  noteMediaDir: "maestri:note:mediaDir",
  noteNotesDir: "maestri:note:notesDir",
  noteReveal: "maestri:note:reveal",
  noteMoveToExternal: "maestri:note:moveToExternal",
  noteMoveToManaged: "maestri:note:moveToManaged",
  noteCreateFromFile: "maestri:note:createFromFile",
  noteCreateFromRemoteFile: "maestri:note:createFromRemoteFile",
  noteRefreshFromRemoteFile: "maestri:note:refreshFromRemoteFile",
  fileTreeList: "maestri:fileTree:list",
  fileTreeWatch: "maestri:fileTree:watch",
  fileTreeUnwatch: "maestri:fileTree:unwatch",
  fileTreeAttachCheckout: "maestri:fileTree:attachCheckout",
  fileTreeOnDidChange: "maestri:fileTree:onDidChange",
  fileTreeGitState: "maestri:fileTree:gitState",
  fileTreeGitAction: "maestri:fileTree:gitAction",
  fileTreeGitChanges: "maestri:fileTree:gitChanges",
  fileTreeGitCancel: "maestri:fileTree:gitCancel",
  fileTreeGitIndexLock: "maestri:fileTree:gitIndexLock",
  fileTreeSearchContents: "maestri:fileTree:searchContents",
  fileTreeSearchFilenames: "maestri:fileTree:searchFilenames",
  fileTreeCancelSearch: "maestri:fileTree:cancelSearch",
  fileTreeOnSearchResults: "maestri:fileTree:onSearchResults",
  fileTreeGitDiffFiles: "maestri:fileTree:gitDiffFiles",
  fileTreeGitFileDiff: "maestri:fileTree:gitFileDiff",
  fileTreeGitHistory: "maestri:fileTree:gitHistory",
  fileTreeGitCommitBody: "maestri:fileTree:gitCommitBody",
  fileTreeGitBranches: "maestri:fileTree:gitBranches",
  fileTreeGitStashes: "maestri:fileTree:gitStashes",
  fileTreeGitMergePreview: "maestri:fileTree:gitMergePreview",
  fileTreeReadFile: "maestri:fileTree:readFile",
  fileTreeWriteFile: "maestri:fileTree:writeFile",
  fileTreeProbeMedia: "maestri:fileTree:probeMedia",
  fileTreeOnFileChanged: "maestri:fileTree:onFileChanged",
  fileTreeCopyPath: "maestri:fileTree:copyPath",
  fileTreeRevealFile: "maestri:fileTree:revealFile",
  fileTreeOnGitActionProgress: "maestri:fileTree:onGitActionProgress",
  fileTreeReveal: "maestri:fileTree:reveal",
  fileTreeWatchState: "maestri:fileTree:watchState",
  fileTreeRetryWatch: "maestri:fileTree:retryWatch",
  fileTreeOnWatchState: "maestri:fileTree:onWatchState",
  fileTreeOnGitState: "maestri:fileTree:onGitState",
  fileTreeFileOperation: "maestri:fileTree:fileOperation",
  fileTreeFileClipboard: "maestri:fileTree:fileClipboard",
  filesStoreAttachment: "maestri:files:storeAttachment",
  filesOpenAttachment: "maestri:files:openAttachment",
  filesRevealAttachment: "maestri:files:revealAttachment",
  filesRevealPath: "maestri:files:revealPath",
  filesLinkPaths: "maestri:files:linkPaths",
  filesResolveLocalPath: "maestri:files:resolveLocalPath",
  filesStagePastedImage: "maestri:files:stagePastedImage",
  filesClipboardFilePaths: "maestri:files:clipboardFilePaths",
  clipboardWriteImage: "maestri:clipboard:writeImage",
  appOpenExternal: "maestri:app:openExternal",
  appOpenPath: "maestri:app:openPath",
  connectionCreateTerminal: "maestri:connection:createTerminal",
  connectionCreateNote: "maestri:connection:createNote",
  connectionCreateNoteToNote: "maestri:connection:createNoteToNote",
  connectionCreatePortal: "maestri:connection:createPortal",
  connectionCreatePortalToPortal: "maestri:connection:createPortalToPortal",
  connectionCreateCrossFloor: "maestri:connection:createCrossFloor",
  connectionConnectNodes: "maestri:connection:connectNodes",
  connectionUpdateRopePoints: "maestri:connection:updateRopePoints",
  terminalResolvePath: "maestri:terminal:resolvePath",
  connectionUpdateRopePointsMany: "maestri:connection:updateRopePointsMany",
  connectionDelete: "maestri:connection:delete",
  connectionDeleteMany: "maestri:connection:deleteMany",
  connectionDisconnectNodes: "maestri:connection:disconnectNodes",
  connectionRemoveAllFor: "maestri:connection:removeAllFor",
  connectionTurnFileIntoNote: "maestri:connection:turnFileIntoNote",
  connectionTransferActive: "maestri:connection:transferActive",
  cableTieCreate: "maestri:cableTie:create",
  cableTieMove: "maestri:cableTie:move",
  cableTieDelete: "maestri:cableTie:delete",
  cableTiePrune: "maestri:cableTie:prune",
  portalRegister: "maestri:portal:register",
  portalWake: "maestri:portal:wake",
  portalUnregister: "maestri:portal:unregister",
  portalResolveSource: "maestri:portal:resolveSource",
  portalDirectoryIndex: "maestri:portal:directoryIndex",
  portalWatchFile: "maestri:portal:watchFile",
  portalUnwatchFile: "maestri:portal:unwatchFile",
  portalFileChanged: "maestri:portal:fileChanged",
  portalDesignCapture: "maestri:portalDesign:capture",
  portalDesignResolveScript: "maestri:portalDesign:resolveScript",
  portalDesignRegion: "maestri:portalDesign:region",
  portalDesignPick: "maestri:portalDesign:pick",
  deviceContract: "maestri:device:contract",
  deviceDiscover: "maestri:device:discover",
  deviceAutomation: "maestri:device:automation",
  deviceStreamTransfer: "maestri:device:streamTransfer",
  deviceFrameCaptureRequest: "maestri:device:frameCaptureRequest",
  deviceFrameCaptureResult: "maestri:device:frameCaptureResult",
  deviceSessionsPublish: "maestri:device:sessionsPublish",
  interAgentListPeers: "maestri:interAgent:listPeers",
  snapNode: "maestri:snapNode",
  tidyNode: "maestri:tidyNode",
  paletteRank: "maestri:palette:rank",
  prompterSerialize: "maestri:prompter:serialize",
  prompterMentionTargets: "maestri:prompter:mentionTargets",
  prompterDeliver: "maestri:prompter:deliver",
  prompterMaterialize: "maestri:prompter:materialize",
  prompterFileIndex: "maestri:prompter:fileIndex",
  prompterCancelFileIndex: "maestri:prompter:cancelFileIndex",
  prompterFileIcon: "maestri:prompter:fileIcon",
  chatConversation: "maestri:chat:conversation",
  chatLoadOlderHistory: "maestri:chat:loadOlderHistory",
  chatLoadHistoryBackTo: "maestri:chat:loadHistoryBackTo",
  chatSearchHistory: "maestri:chat:searchHistory",
  chatCancelSearchHistory: "maestri:chat:cancelSearchHistory",
  chatThreads: "maestri:chat:threads",
  chatEnter: "maestri:chat:enter",
  chatExit: "maestri:chat:exit",
  chatSetShowsShellWindowDuringTurns: "maestri:chat:setShowsShellWindowDuringTurns",
  chatSend: "maestri:chat:send",
  chatInterrupt: "maestri:chat:interrupt",
  chatAcknowledgeAttention: "maestri:chat:acknowledgeAttention",
  chatMarkRead: "maestri:chat:markRead",
  chatSwitchThread: "maestri:chat:switchThread",
  chatClearThread: "maestri:chat:clearThread",
  chatDeleteEntry: "maestri:chat:deleteEntry",
  chatDeleteAttachment: "maestri:chat:deleteAttachment",
  chatOnConversationEvent: "maestri:chat:onConversationEvent",
  chatAttachmentFacts: "maestri:chat:attachmentFacts",
  chatOpenAttachment: "maestri:chat:openAttachment",
  chatStartAttachmentDrag: "maestri:chat:startAttachmentDrag",
  agentUsageGetState: "maestri:agentUsage:getState",
  agentUsageRefresh: "maestri:agentUsage:refresh",
  agentUsageRefreshAll: "maestri:agentUsage:refreshAll",
  agentUsageRestoreDefaults: "maestri:agentUsage:restoreDefaults",
  agentUsageRevealProvidersFolder: "maestri:agentUsage:revealProvidersFolder",
  agentUsageSetViewer: "maestri:agentUsage:setViewer",
  agentUsageOnStateChanged: "maestri:agentUsage:onStateChanged",
  gitHostsConfigure: "maestri:gitHosts:configure",
  gitHostsRestoreDefault: "maestri:gitHosts:restoreDefault",
  gitHostsRestoreMissingDefaults: "maestri:gitHosts:restoreMissingDefaults",
  gitHostsCheckAccount: "maestri:gitHosts:checkAccount",
  gitHostsRevealProvidersFolder: "maestri:gitHosts:revealProvidersFolder",
  pullRequestsGetState: "maestri:pullRequests:getState",
  pullRequestsOnStateChanged: "maestri:pullRequests:onStateChanged",
  pullRequestsOnOpenSheet: "maestri:pullRequests:onOpenSheet",
  pullRequestsSetPresented: "maestri:pullRequests:setPresented",
  pullRequestsPrepare: "maestri:pullRequests:prepare",
  pullRequestsImagePrefix: "maestri:pullRequests:imagePrefix",
  pullRequestsKeepImage: "maestri:pullRequests:keepImage",
  pullRequestsImagesExist: "maestri:pullRequests:imagesExist",
  pullRequestsShowImages: "maestri:pullRequests:showImages",
  pullRequestsCloseImages: "maestri:pullRequests:closeImages",
  pullRequestsImagesDismissed: "maestri:pullRequests:imagesDismissed",
  pullRequestsAccount: "maestri:pullRequests:account",
  pullRequestsCheckoutIsRemote: "maestri:pullRequests:checkoutIsRemote",
  pullRequestsLookForExisting: "maestri:pullRequests:lookForExisting",
  pullRequestsOpen: "maestri:pullRequests:open",
  pullRequestsOpenOnWebsite: "maestri:pullRequests:openOnWebsite",
  pullRequestsCheck: "maestri:pullRequests:check",
  pullRequestsMarkSeen: "maestri:pullRequests:markSeen",
  pullRequestsPush: "maestri:pullRequests:push",
  pullRequestsMerge: "maestri:pullRequests:merge",
  pullRequestsForget: "maestri:pullRequests:forget",
  pullRequestsRemoveMerged: "maestri:pullRequests:removeMerged",
  pullRequestsHandOff: "maestri:pullRequests:handOff",
  pullRequestFoldersOpen: "maestri:pullRequests:folders:openFromTree",
  pullRequestFoldersBranches: "maestri:pullRequests:folders:branches",
  pullRequestFoldersPrepare: "maestri:pullRequests:folders:prepare",
  pullRequestFoldersAccount: "maestri:pullRequests:folders:account",
  pullRequestFoldersDiff: "maestri:pullRequests:folders:diff",
  pullRequestFoldersFileDiff: "maestri:pullRequests:folders:fileDiff",
  pullRequestFoldersOpenPullRequest: "maestri:pullRequests:folders:open",
  pullRequestFoldersOpenOnWebsite: "maestri:pullRequests:folders:openOnWebsite",
  pullRequestFoldersImagePrefix: "maestri:pullRequests:folders:imagePrefix",
  pullRequestFoldersKeepImage: "maestri:pullRequests:folders:keepImage",
  pullRequestFoldersImagesExist: "maestri:pullRequests:folders:imagesExist",
  pullRequestFoldersShowImages: "maestri:pullRequests:folders:showImages",
  pullRequestFoldersClose: "maestri:pullRequests:folders:close",
  chatAskNames: "maestri:chat:askNames",
  chatCaptureArchives: "maestri:chat:captureArchives",
  chatCopyChats: "maestri:chat:copyChats",
  chatDiscardCopiedChats: "maestri:chat:discardCopiedChats",
  chatSendComposedPrompt: "maestri:chat:sendComposedPrompt",
  chatSearchConversations: "maestri:chat:searchConversations",
  chatReleaseConversationSearch: "maestri:chat:releaseConversationSearch",
  sidebarLayoutGet: "maestri:sidebarLayout:get",
  sidebarLayoutSet: "maestri:sidebarLayout:set",
  sidebarLayoutOnChanged: "maestri:sidebarLayout:onChanged",
  dataStorageLocation: "maestri:data:storageLocation",
  dataRevealStorageLocation: "maestri:data:revealStorageLocation",
  dataRevealBackupsLocation: "maestri:data:revealBackupsLocation",
  dataMoveStorage: "maestri:data:moveStorage",
  dataUsage: "maestri:data:usage",
  dataDeleteAll: "maestri:data:deleteAll",
  dataListBackups: "maestri:data:listBackups",
  dataLastBackupAt: "maestri:data:lastBackupAt",
  dataLastSaveAt: "maestri:data:lastSaveAt",
  dataBackupNow: "maestri:data:backupNow",
  dataDeleteBackup: "maestri:data:deleteBackup",
  dataExportBackup: "maestri:data:exportBackup",
  dataPickBackupToImport: "maestri:data:pickBackupToImport",
  dataImportBackup: "maestri:data:importBackup",
  dataClearGlobalPortalStorage: "maestri:data:clearGlobalPortalStorage",
  dataOnStoreReloaded: "maestri:data:onStoreReloaded",
  licenseGet: "maestri:license:get",
  licenseActivate: "maestri:license:activate",
  licenseDeactivate: "maestri:license:deactivate",
  licenseSelectFreeWorkspace: "maestri:license:selectFreeWorkspace",
  licenseClearFreeWorkspace: "maestri:license:clearFreeWorkspace",
  licenseSetDevOverride: "maestri:license:setDevOverride",
  licenseOnChanged: "maestri:license:onChanged",
  routineList: "maestri:routine:list",
  routineCreate: "maestri:routine:create",
  routineUpdate: "maestri:routine:update",
  routineDelete: "maestri:routine:delete",
  routineSetEnabled: "maestri:routine:setEnabled",
  routineRunNow: "maestri:routine:runNow",
  routineOnChanged: "maestri:routine:onChanged",
  routineHistory: "maestri:routine:history",
  routineHistoryRemove: "maestri:routine:historyRemove",
  routineHistoryClear: "maestri:routine:historyClear",
  routineOnHistoryChanged: "maestri:routine:onHistoryChanged",
  remoteGetState: "maestri:remote:getState",
  remoteOnStateChanged: "maestri:remote:onStateChanged",
  remoteBeginPairingWindow: "maestri:remote:beginPairingWindow",
  remoteEndPairingWindow: "maestri:remote:endPairingWindow",
  remoteSetEnabled: "maestri:remote:setEnabled",
  remoteSetPort: "maestri:remote:setPort",
  remoteSetTailnetOnly: "maestri:remote:setTailnetOnly",
  remoteSetPassword: "maestri:remote:setPassword",
  remoteRevokeDevice: "maestri:remote:revokeDevice",
  remoteSetDeviceRole: "maestri:remote:setDeviceRole",
  remoteRenameDevice: "maestri:remote:renameDevice",
  remoteOnPresence: "maestri:remote:onPresence",
  remotePresenceResend: "maestri:remote:presenceResend",
  remoteOnCameraFrame: "maestri:remote:onCameraFrame",
  remotePartituraPreviewRequest: "maestri:remote:partituraPreviewRequest",
  remotePartituraPreviewResult: "maestri:remote:partituraPreviewResult",
  remotePortalReloadRequest: "maestri:remote:portalReloadRequest",
  remotePortalReloadResult: "maestri:remote:portalReloadResult"
};
function subscribe(channel, handler) {
  const wrapped = (_event, payload) => handler(payload);
  electron.ipcRenderer.on(channel, wrapped);
  return () => electron.ipcRenderer.removeListener(channel, wrapped);
}
function subscribeSignal(channel, handler) {
  const wrapped = () => handler();
  electron.ipcRenderer.on(channel, wrapped);
  return () => electron.ipcRenderer.removeListener(channel, wrapped);
}
let preferenceSubscriberCount = 0;
function subscribePreferences(handler) {
  const unsubscribe = subscribe(C.preferencesOnChanged, handler);
  if (preferenceSubscriberCount === 0) electron.ipcRenderer.send(C.preferencesSubscribe);
  preferenceSubscriberCount += 1;
  let active = true;
  return () => {
    if (!active) return;
    active = false;
    unsubscribe();
    preferenceSubscriberCount -= 1;
    if (preferenceSubscriberCount === 0) electron.ipcRenderer.send(C.preferencesUnsubscribe);
  };
}
function invokeLicenseCommand(channel, ...args) {
  return electron.ipcRenderer.invoke(channel, ...args).then((result) => {
    if (!result.ok) return Promise.reject(result.error);
  });
}
function invokeWithLicenseFailure(channel, ...args) {
  return electron.ipcRenderer.invoke(channel, ...args).catch((error) => {
    const kind = licenseFailureKind(error);
    if (!kind) throw error;
    return Promise.reject({ kind });
  });
}
window.addEventListener("message", (event) => {
  const data = event.data;
  const port = event.ports[0];
  if (event.source !== window || !port || event.ports.length !== 1) return;
  if (typeof data !== "object" || data === null || !("type" in data) || !("request" in data)) return;
  if (data.type !== DEVICE_STREAM_WINDOW_MESSAGE) return;
  electron.ipcRenderer.postMessage(C.deviceStreamTransfer, data.request, [port]);
});
const api = {
  app: {
    info() {
      return electron.ipcRenderer.invoke(C.appInfo);
    },
    diagnosticReport() {
      return electron.ipcRenderer.invoke(C.appDiagnosticReport);
    },
    saveDiagnosticReport() {
      return electron.ipcRenderer.invoke(C.appSaveDiagnosticReport);
    },
    setLocale(locale) {
      return electron.ipcRenderer.invoke(C.appSetLocale, locale);
    },
    localDirectorySuggestions(partialPath, limit) {
      return electron.ipcRenderer.invoke(C.appLocalDirectorySuggestions, partialPath, limit);
    },
    directoryState(workspaceId, environment, path) {
      return electron.ipcRenderer.invoke(C.appDirectoryState, workspaceId, environment, path);
    },
    createDirectory(workspaceId, environment, path) {
      return electron.ipcRenderer.invoke(C.appCreateDirectory, workspaceId, environment, path);
    },
    pickDirectory() {
      return electron.ipcRenderer.invoke(C.appPickDirectory);
    },
    quit() {
      return electron.ipcRenderer.invoke(C.appQuit);
    },
    hideToTray() {
      return electron.ipcRenderer.invoke(C.appHideToTray);
    },
    listIdes() {
      return electron.ipcRenderer.invoke(C.appListIdes);
    },
    openInIde(workspaceId, ideId) {
      return electron.ipcRenderer.invoke(C.appOpenInIde, workspaceId, ideId);
    },
    openExternal(url) {
      return electron.ipcRenderer.invoke(C.appOpenExternal, url);
    },
    openPath(path) {
      return electron.ipcRenderer.invoke(C.appOpenPath, path);
    },
    showEmojiPanel() {
      return electron.ipcRenderer.invoke(C.appShowEmojiPanel);
    },
    // Both are `send`, not `invoke`: the caller is a crash reporter running in a
    // page that may be seconds from death, so it must not await anything and
    // must not create a promise nobody is left alive to reject.
    rendererBooted() {
      electron.ipcRenderer.send(C.appRendererBooted);
    },
    reportRendererFault(fault) {
      electron.ipcRenderer.send(C.appRendererFault, fault);
    },
    onShutdown(handler) {
      return subscribe(C.appShutdown, handler);
    },
    // `send`, not `invoke`: this runs from a paint callback during teardown and
    // must not create a promise nobody will be alive to settle.
    shutdownPainted() {
      electron.ipcRenderer.send(C.appShutdownPainted);
    }
  },
  windowControls: {
    state() {
      return electron.ipcRenderer.invoke(C.windowControlsState);
    },
    minimize() {
      return electron.ipcRenderer.invoke(C.windowControlsMinimize);
    },
    toggleMaximize() {
      return electron.ipcRenderer.invoke(C.windowControlsToggleMaximize);
    },
    close() {
      return electron.ipcRenderer.invoke(C.windowControlsClose);
    },
    onChanged(handler) {
      return subscribe(C.windowControlsOnChanged, handler);
    }
  },
  appState: {
    get() {
      return electron.ipcRenderer.invoke(C.appStateGet);
    },
    setOnboardingCompleted(completed) {
      return electron.ipcRenderer.invoke(C.appStateSetOnboardingCompleted, completed);
    },
    setHasSeenFloorOnboarding(seen) {
      return electron.ipcRenderer.invoke(C.appStateSetHasSeenFloorOnboarding, seen);
    }
  },
  updates: {
    state() {
      return electron.ipcRenderer.invoke(C.updatesState);
    },
    check() {
      return electron.ipcRenderer.invoke(C.updatesCheck);
    },
    onProgress(handler) {
      return subscribe(C.updatesOnProgress, handler);
    },
    restartAndInstall() {
      return electron.ipcRenderer.invoke(C.updatesRestartAndInstall);
    }
  },
  preferences: {
    get() {
      return electron.ipcRenderer.invoke(C.preferencesGet);
    },
    set(patch) {
      return electron.ipcRenderer.invoke(C.preferencesSet, patch);
    },
    onChanged(handler) {
      return subscribePreferences(handler);
    }
  },
  partitura: {
    list() {
      return electron.ipcRenderer.invoke(C.partituraList);
    },
    async save(partitura) {
      const result = await electron.ipcRenderer.invoke(C.partituraSave, partitura);
      if (!result.ok) return Promise.reject(result.failure);
      return result.partitura;
    },
    delete(id) {
      return electron.ipcRenderer.invoke(C.partituraDelete, id);
    },
    async exportOne(id) {
      const result = await electron.ipcRenderer.invoke(C.partituraExportOne, id);
      if (!result.ok) return Promise.reject(result.failure);
      return result.exported;
    },
    async exportAll() {
      const result = await electron.ipcRenderer.invoke(C.partituraExportAll);
      if (!result.ok) return Promise.reject(result.failure);
      return result.exported;
    },
    pickFiles() {
      return electron.ipcRenderer.invoke(C.partituraPickFiles);
    },
    readFiles(files) {
      const paths = files.map((file) => electron.webUtils.getPathForFile(file));
      if (paths.some((path) => path === "")) {
        return Promise.resolve({ ok: false, failure: { kind: "unreadableFile" } });
      }
      return electron.ipcRenderer.invoke(C.partituraReadFiles, paths);
    },
    readOpenedFiles() {
      return electron.ipcRenderer.invoke(C.partituraReadOpenedFiles);
    },
    onChanged(handler) {
      return subscribeSignal(C.partituraChanged, handler);
    },
    onOpenRequested(handler) {
      return subscribeSignal(C.partituraOpenRequested, handler);
    }
  },
  workspace: {
    list() {
      return electron.ipcRenderer.invoke(C.workspaceList);
    },
    create(input) {
      return invokeWithLicenseFailure(C.workspaceCreate, input);
    },
    patch(id, patch) {
      return electron.ipcRenderer.invoke(C.workspacePatch, id, patch);
    },
    delete(id) {
      return electron.ipcRenderer.invoke(C.workspaceDelete, id);
    },
    duplicate(id) {
      return electron.ipcRenderer.invoke(C.workspaceDuplicate, id);
    },
    export(id) {
      return electron.ipcRenderer.invoke(C.workspaceExport, id);
    },
    prepareImport(file) {
      if (file === void 0) return electron.ipcRenderer.invoke(C.workspaceImport);
      const path = electron.webUtils.getPathForFile(file);
      if (path === "") return Promise.resolve(null);
      return electron.ipcRenderer.invoke(C.workspaceImport, [path]);
    },
    prepareOpenedImport() {
      return electron.ipcRenderer.invoke(C.workspaceImportOpened);
    },
    completeImport(sourcePath, destination) {
      return electron.ipcRenderer.invoke(C.workspaceImportComplete, sourcePath, destination);
    },
    onOpenRequested(handler) {
      return subscribeSignal(C.workspaceOpenRequested, handler);
    },
    unload(id, scope) {
      return electron.ipcRenderer.invoke(C.workspaceUnload, id, scope);
    },
    getActiveId() {
      return electron.ipcRenderer.invoke(C.workspaceGetActiveId);
    },
    setFloorStatus(workspaceId, floorId, status) {
      return electron.ipcRenderer.invoke(C.workspaceSetFloorStatus, workspaceId, floorId, status);
    },
    reorderFloor(workspaceId, floorId, topDownIndex) {
      return electron.ipcRenderer.invoke(C.workspaceReorderFloor, workspaceId, floorId, topDownIndex);
    },
    reveal(id) {
      return electron.ipcRenderer.invoke(C.workspaceReveal, id);
    },
    switch(id) {
      return electron.ipcRenderer.invoke(C.workspaceSwitch, id);
    },
    setPreferredIde(id, ideId) {
      return electron.ipcRenderer.invoke(C.workspaceSetPreferredIde, id, ideId);
    },
    onChanged(handler) {
      return subscribe(C.workspaceOnChanged, handler);
    },
    onDeleted(handler) {
      return subscribe(C.workspaceOnDeleted, handler);
    },
    undo(id) {
      return electron.ipcRenderer.invoke(C.workspaceUndo, id);
    },
    beginUndoGroup() {
      return electron.ipcRenderer.invoke(C.workspaceBeginUndoGroup);
    },
    endUndoGroup() {
      return electron.ipcRenderer.invoke(C.workspaceEndUndoGroup);
    },
    onLevelsUnloaded(handler) {
      return subscribe(C.workspaceOnLevelsUnloaded, handler);
    },
    redo(id) {
      return electron.ipcRenderer.invoke(C.workspaceRedo, id);
    },
    configFiles: {
      status(id) {
        return electron.ipcRenderer.invoke(C.workspaceConfigFilesStatus, id);
      },
      read(id, kind) {
        return electron.ipcRenderer.invoke(C.workspaceConfigFilesRead, id, kind);
      },
      write(id, kind, text) {
        return electron.ipcRenderer.invoke(C.workspaceConfigFilesWrite, id, kind, text);
      },
      remove(id, kind) {
        return electron.ipcRenderer.invoke(C.workspaceConfigFilesRemove, id, kind);
      },
      sync(id, winner, expect) {
        return electron.ipcRenderer.invoke(C.workspaceConfigFilesSync, id, winner, expect);
      }
    }
  },
  floor: {
    createKind: (workspaceId, input) => electron.ipcRenderer.invoke(C.floorCreateKind, workspaceId, input),
    canCopyIndependently: (workspaceId) => electron.ipcRenderer.invoke(C.floorCanCopy, workspaceId),
    isolationAvailable() {
      return electron.ipcRenderer.invoke(C.floorIsolationAvailable);
    },
    create(workspaceId, input) {
      return electron.ipcRenderer.invoke(C.floorCreate, workspaceId, input);
    },
    reviewSource: (workspaceId) => electron.ipcRenderer.invoke(C.floorReviewSource, workspaceId),
    reviewNumber: (workspaceId, text) => electron.ipcRenderer.invoke(C.floorReviewNumber, workspaceId, text),
    reviewList: (workspaceId, query) => electron.ipcRenderer.invoke(C.floorReviewList, workspaceId, query),
    reviewFloorName: (workspaceId, number, title) => electron.ipcRenderer.invoke(C.floorReviewName, workspaceId, number, title),
    createReview: (workspaceId, input, requestId) => electron.ipcRenderer.invoke(C.floorReviewCreate, workspaceId, input, requestId),
    createIsolated(workspaceId, input, requestId) {
      return electron.ipcRenderer.invoke(C.floorCreateIsolated, workspaceId, input, requestId);
    },
    listBranches(workspaceId) {
      return electron.ipcRenderer.invoke(C.floorListBranches, workspaceId);
    },
    cancelIsolated(requestId) {
      return electron.ipcRenderer.invoke(C.floorCancelIsolated, requestId);
    },
    onSeedProgress(handler) {
      return subscribe(C.floorSeedProgress, handler);
    },
    rename(workspaceId, floorId, name) {
      return electron.ipcRenderer.invoke(C.floorRename, workspaceId, floorId, name);
    },
    switch(workspaceId, floorId, outgoingCamera, outgoingDock) {
      return electron.ipcRenderer.invoke(
        C.floorSwitch,
        workspaceId,
        floorId,
        outgoingCamera,
        outgoingDock
      );
    },
    delete(workspaceId, floorId, removeBranch, options) {
      return electron.ipcRenderer.invoke(
        C.floorDelete,
        workspaceId,
        floorId,
        removeBranch === true,
        options ?? null
      );
    },
    removeBranch(workspaceId, branch, force) {
      return electron.ipcRenderer.invoke(C.floorRemoveBranch, workspaceId, branch, force);
    },
    landingPreflight(workspaceId, floorId) {
      return electron.ipcRenderer.invoke(C.floorLandingPreflight, workspaceId, floorId);
    },
    landingPreview(workspaceId, floorId, target) {
      return electron.ipcRenderer.invoke(C.floorLandingPreview, workspaceId, floorId, target);
    },
    landingFileDiff(workspaceId, floorId, target, path, oldPath, conflict) {
      return electron.ipcRenderer.invoke(
        C.floorLandingFileDiff,
        workspaceId,
        floorId,
        target,
        path,
        oldPath,
        conflict
      );
    },
    land(workspaceId, floorId, target) {
      return electron.ipcRenderer.invoke(C.floorLand, workspaceId, floorId, target);
    },
    landingRemoveBranch(workspaceId, branch, target) {
      return electron.ipcRenderer.invoke(C.floorLandingRemoveBranch, workspaceId, branch, target);
    },
    onLanding(handler) {
      return subscribe(C.floorOnLanding, handler);
    },
    onRemovingChanged(handler) {
      return subscribe(C.floorOnRemovingChanged, handler);
    },
    removing() {
      return electron.ipcRenderer.invoke(C.floorRemoving);
    },
    testLanding(workspaceId, floorId) {
      return electron.ipcRenderer.invoke(C.floorTestLanding, workspaceId, floorId);
    }
  },
  floorSnapshot: {
    capture(workspaceId, rect, maxWidth) {
      return electron.ipcRenderer.invoke(C.floorSnapshotCapture, workspaceId, rect, maxWidth);
    }
  },
  floorHooks: {
    get(workspaceId) {
      return electron.ipcRenderer.invoke(C.floorHooksGet, workspaceId);
    },
    replace(workspaceId, hooks) {
      return electron.ipcRenderer.invoke(C.floorHooksReplace, workspaceId, hooks);
    },
    run(workspaceId, floorId, commandId) {
      return electron.ipcRenderer.invoke(C.floorHooksRun, workspaceId, floorId, commandId);
    },
    stop(commandId) {
      return electron.ipcRenderer.invoke(C.floorHooksStop, commandId);
    },
    runSection(workspaceId, floorId, section) {
      return electron.ipcRenderer.invoke(C.floorHooksRunSection, workspaceId, floorId, section);
    },
    clearResult(commandId) {
      return electron.ipcRenderer.invoke(C.floorHooksClearResult, commandId);
    },
    clearAllResults(workspaceId) {
      return electron.ipcRenderer.invoke(C.floorHooksClearAllResults, workspaceId);
    },
    runs() {
      return electron.ipcRenderer.invoke(C.floorHooksRuns);
    },
    onRunsChanged(handler) {
      return subscribe(C.floorHooksOnRunsChanged, handler);
    },
    readOutput(commandId) {
      return electron.ipcRenderer.invoke(C.floorHooksReadOutput, commandId);
    },
    onOutput(handler) {
      return subscribe(C.floorHooksOnOutput, handler);
    },
    write(commandId, data) {
      return electron.ipcRenderer.invoke(C.floorHooksWrite, commandId, data);
    },
    resize(commandId, cols, rows) {
      return electron.ipcRenderer.invoke(C.floorHooksResize, commandId, cols, rows);
    }
  },
  node: {
    create(workspaceId, node) {
      return electron.ipcRenderer.invoke(C.nodeCreate, workspaceId, node);
    },
    patch(workspaceId, nodeId, patch) {
      return electron.ipcRenderer.invoke(C.nodePatch, workspaceId, nodeId, patch);
    },
    patchFrames(workspaceId, patches) {
      return electron.ipcRenderer.invoke(C.nodePatchFrames, workspaceId, patches);
    },
    delete(workspaceId, nodeId) {
      return electron.ipcRenderer.invoke(C.nodeDelete, workspaceId, nodeId);
    },
    deleteMany(workspaceId, nodeIds) {
      return electron.ipcRenderer.invoke(C.nodeDeleteMany, workspaceId, nodeIds);
    },
    unload(workspaceId, nodeIds) {
      return electron.ipcRenderer.invoke(C.nodeUnload, workspaceId, nodeIds);
    },
    setNodesRedacted(workspaceId, nodeIds, isRedacted) {
      return electron.ipcRenderer.invoke(C.nodeSetRedacted, workspaceId, nodeIds, isRedacted);
    }
  },
  group: {
    create(workspaceId, nodeIds) {
      return electron.ipcRenderer.invoke(C.groupCreate, workspaceId, nodeIds);
    },
    ungroup(workspaceId, nodeIds) {
      return electron.ipcRenderer.invoke(C.groupUngroup, workspaceId, nodeIds);
    },
    rename(workspaceId, groupId, name) {
      return electron.ipcRenderer.invoke(C.groupRename, workspaceId, groupId, name);
    },
    setColor(workspaceId, groupId, colorHex) {
      return electron.ipcRenderer.invoke(C.groupSetColor, workspaceId, groupId, colorHex);
    }
  },
  // Fichários. ONE call per operation and ONE undo step each: filing a note is
  // four edits (membership, rope promotion, frame tuck, uniform colour) that mac
  // runs inside a single undoable mutation, so the transaction lives in main
  // rather than as a sequence of `node.patch` calls from the renderer.
  noteStack: {
    /** From loose notes, in canvas reading order. Null when nothing was fileable. */
    create(workspaceId, noteNodeIds, name, defaultName) {
      return electron.ipcRenderer.invoke(C.noteStackCreate, workspaceId, noteNodeIds, name, defaultName);
    },
    /** The mixed-selection verb: notes create one, a selected fichário receives, further ones merge in. */
    fileSelection(workspaceId, nodeIds, defaultName) {
      return electron.ipcRenderer.invoke(C.noteStackFileSelection, workspaceId, nodeIds, defaultName);
    },
    addNotes(workspaceId, stackNodeId, noteNodeIds) {
      return electron.ipcRenderer.invoke(C.noteStackAddNotes, workspaceId, stackNodeId, noteNodeIds);
    },
    /**
     * Inserts a page the caller has already built, so the `.md` naming stays in
     * the note-file layer while the insert, the front flip, the tuck and the
     * uniform stamp remain one undo step. Returns the stored node.
     */
    addPage(workspaceId, stackNodeId, pageNode, afterNoteNodeId) {
      return electron.ipcRenderer.invoke(C.noteStackAddPage, workspaceId, stackNodeId, pageNode, afterNoteNodeId);
    },
    /** One page back onto the canvas. Reports whether an unnamed stack dissolved behind it. */
    spill(workspaceId, stackNodeId, noteNodeId, origin) {
      return electron.ipcRenderer.invoke(C.noteStackSpill, workspaceId, stackNodeId, noteNodeId, origin);
    },
    unstack(workspaceId, stackNodeId) {
      return electron.ipcRenderer.invoke(C.noteStackUnstack, workspaceId, stackNodeId);
    },
    /** The "Keep Notes" branch of the delete prompt: the folder goes, the pages fan out. */
    deleteKeepingNotes(workspaceId, stackNodeId) {
      return electron.ipcRenderer.invoke(C.noteStackDeleteKeepingNotes, workspaceId, stackNodeId);
    },
    moveMember(workspaceId, stackNodeId, fromIndex, toIndex) {
      return electron.ipcRenderer.invoke(C.noteStackMoveMember, workspaceId, stackNodeId, fromIndex, toIndex);
    },
    setFront(workspaceId, stackNodeId, noteNodeId) {
      return electron.ipcRenderer.invoke(C.noteStackSetFront, workspaceId, stackNodeId, noteNodeId);
    },
    rename(workspaceId, stackNodeId, name) {
      return electron.ipcRenderer.invoke(C.noteStackRename, workspaceId, stackNodeId, name);
    },
    clearCustomName(workspaceId, stackNodeId) {
      return electron.ipcRenderer.invoke(C.noteStackClearCustomName, workspaceId, stackNodeId);
    },
    /** The drop-to-file commit. The note never moves to the release point. */
    fileDroppedNote(workspaceId, noteNodeId, stackNodeId) {
      return electron.ipcRenderer.invoke(C.noteStackFileDroppedNote, workspaceId, noteNodeId, stackNodeId);
    },
    /** Lane to lane, without touching the canvas in between. Does not inherit the source's ropes. */
    moveBetween(workspaceId, fromStackNodeId, toStackNodeId, noteNodeId) {
      return electron.ipcRenderer.invoke(
        C.noteStackMoveBetween,
        workspaceId,
        fromStackNodeId,
        toStackNodeId,
        noteNodeId
      );
    },
    toggleUniformColor(workspaceId, stackNodeId) {
      return electron.ipcRenderer.invoke(C.noteStackToggleUniformColor, workspaceId, stackNodeId);
    },
    /**
     * THE single write path for a note's colour. A note inside a Uniform Color
     * fichário retunes the whole stack in the same undo step, so every colour
     * control routes here rather than through `node.patch`.
     */
    setNoteColor(workspaceId, noteNodeId, color, customColor) {
      return electron.ipcRenderer.invoke(C.noteStackSetNoteColor, workspaceId, noteNodeId, color, customColor);
    },
    setEngaged(nodeIds) {
      electron.ipcRenderer.send(C.noteStackSetEngaged, nodeIds);
    }
  },
  band: {
    create(workspaceId, nodeIds, name, defaultName, focusedNodeId) {
      return electron.ipcRenderer.invoke(C.bandCreate, workspaceId, nodeIds, name, defaultName, focusedNodeId);
    },
    addTerminals(workspaceId, bandNodeId, memberNodeIds, focusedNodeId) {
      return electron.ipcRenderer.invoke(C.bandAddTerminals, workspaceId, bandNodeId, memberNodeIds, focusedNodeId);
    },
    removeMember(workspaceId, bandNodeId, memberNodeId, origin) {
      return electron.ipcRenderer.invoke(C.bandRemoveMember, workspaceId, bandNodeId, memberNodeId, origin);
    },
    moveMemberBetween(workspaceId, fromBandNodeId, toBandNodeId, memberNodeId) {
      return electron.ipcRenderer.invoke(C.bandMoveMemberBetween, workspaceId, fromBandNodeId, toBandNodeId, memberNodeId);
    },
    dissolve(workspaceId, bandNodeId) {
      return electron.ipcRenderer.invoke(C.bandDissolve, workspaceId, bandNodeId);
    },
    moveMember(workspaceId, bandNodeId, memberNodeId, move) {
      return electron.ipcRenderer.invoke(C.bandMoveMember, workspaceId, bandNodeId, memberNodeId, move);
    },
    setOrder(workspaceId, bandNodeId, memberNodeIds) {
      return electron.ipcRenderer.invoke(C.bandSetOrder, workspaceId, bandNodeId, memberNodeIds);
    },
    select(workspaceId, bandNodeId, memberNodeId) {
      return electron.ipcRenderer.invoke(C.bandSelect, workspaceId, bandNodeId, memberNodeId);
    },
    update(workspaceId, bandNodeId, patch, recordsUndo) {
      return electron.ipcRenderer.invoke(C.bandUpdate, workspaceId, bandNodeId, patch, recordsUndo);
    },
    rename(workspaceId, bandNodeId, name) {
      return electron.ipcRenderer.invoke(C.bandRename, workspaceId, bandNodeId, name);
    },
    setSidebarWidth(workspaceId, bandNodeId, width) {
      return electron.ipcRenderer.invoke(C.bandSetSidebarWidth, workspaceId, bandNodeId, width);
    },
    addNewMember(workspaceId, bandNodeId, node) {
      return electron.ipcRenderer.invoke(C.bandAddNewMember, workspaceId, bandNodeId, node);
    },
    onAsksInFlight(handler) {
      return subscribe(C.bandAsksInFlight, handler);
    }
  },
  agent: {
    assignRole(terminalId, roleId) {
      return electron.ipcRenderer.invoke(C.agentAssignRole, terminalId, roleId);
    },
    listWslDistros() {
      return electron.ipcRenderer.invoke(C.agentListWslDistros);
    },
    listShells() {
      return electron.ipcRenderer.invoke(C.agentListShells);
    },
    locateLocalTmux() {
      return electron.ipcRenderer.invoke(C.agentLocateLocalTmux);
    },
    discoverRoles(input) {
      return electron.ipcRenderer.invoke(C.agentDiscoverRoles, input);
    },
    validateWslDirectory(distro, path, user) {
      return electron.ipcRenderer.invoke(C.agentValidateWslDirectory, distro, path, user);
    },
    directorySuggestions(workspaceId, connection, partialPath, limit) {
      return electron.ipcRenderer.invoke(C.agentDirectorySuggestions, workspaceId, connection, partialPath, limit);
    },
    listDockerContainers(workspaceId, context) {
      return electron.ipcRenderer.invoke(C.agentListDockerContainers, workspaceId, context);
    },
    testDockerConnection(workspaceId, config) {
      return electron.ipcRenderer.invoke(C.agentTestDockerConnection, workspaceId, config);
    },
    listSandboxes(workspaceId, workspacePath) {
      return electron.ipcRenderer.invoke(C.agentListSandboxes, workspaceId, workspacePath);
    },
    listSandboxAgents(workspaceId) {
      return electron.ipcRenderer.invoke(C.agentListSandboxAgents, workspaceId);
    },
    createSandbox(workspaceId, request) {
      return electron.ipcRenderer.invoke(C.agentCreateSandbox, workspaceId, request);
    },
    testSandboxConnection(workspaceId, config) {
      return electron.ipcRenderer.invoke(C.agentTestSandboxConnection, workspaceId, config);
    }
  },
  drawing: {
    recognize(workspaceId, points) {
      return invokeWithLicenseFailure(C.drawingRecognize, workspaceId, points);
    },
    create(workspaceId, drawing) {
      return electron.ipcRenderer.invoke(C.drawingCreate, workspaceId, drawing);
    },
    patch(workspaceId, drawingId, patch) {
      return electron.ipcRenderer.invoke(C.drawingPatch, workspaceId, drawingId, patch);
    },
    delete(workspaceId, drawingId) {
      return electron.ipcRenderer.invoke(C.drawingDelete, workspaceId, drawingId);
    },
    group(workspaceId, drawingIds) {
      return electron.ipcRenderer.invoke(C.drawingGroup, workspaceId, drawingIds);
    },
    ungroup(workspaceId, drawingIds) {
      return electron.ipcRenderer.invoke(C.drawingUngroup, workspaceId, drawingIds);
    }
  },
  terminal: {
    spawn(input) {
      return electron.ipcRenderer.invoke(C.terminalSpawn, input);
    },
    write(terminalId, data) {
      electron.ipcRenderer.send(C.terminalWrite, terminalId, data);
      return Promise.resolve();
    },
    deliverPrompt(terminalId, text) {
      return electron.ipcRenderer.invoke(C.terminalDeliverPrompt, terminalId, text);
    },
    dims(terminalId) {
      return electron.ipcRenderer.invoke(C.terminalDims, terminalId);
    },
    resize(terminalId, cols, rows, options) {
      return electron.ipcRenderer.invoke(C.terminalResize, terminalId, cols, rows, options);
    },
    resolvePath(query) {
      return electron.ipcRenderer.invoke(C.terminalResolvePath, query);
    },
    kill(terminalId) {
      return electron.ipcRenderer.invoke(C.terminalKill, terminalId);
    },
    restart(terminalId) {
      return electron.ipcRenderer.invoke(C.terminalRestart, terminalId);
    },
    attach(terminalId) {
      return electron.ipcRenderer.invoke(C.terminalAttach, terminalId);
    },
    getScrollback(terminalId) {
      return electron.ipcRenderer.invoke(C.terminalGetScrollback, terminalId);
    },
    markSeen(terminalId) {
      electron.ipcRenderer.send(C.terminalMarkSeen, terminalId);
    },
    discardResume(workspaceId, nodeId) {
      return electron.ipcRenderer.invoke(C.terminalDiscardResume, workspaceId, nodeId);
    },
    setFocused(terminalId) {
      electron.ipcRenderer.send(C.terminalSetFocused, terminalId);
    },
    onData(handler) {
      return subscribe(C.terminalOnData, handler);
    },
    onExit(handler) {
      return subscribe(C.terminalOnExit, handler);
    },
    onStatus(handler) {
      return subscribe(C.terminalOnStatus, handler);
    },
    onActivity(handler) {
      return subscribe(C.terminalActivity, handler);
    },
    memory() {
      return electron.ipcRenderer.invoke(C.terminalMemory);
    },
    onMemory(handler) {
      return subscribe(C.terminalOnMemory, handler);
    },
    processList(terminalId) {
      return electron.ipcRenderer.invoke(C.terminalProcessList, terminalId);
    },
    stopProcess(terminalId, pid, startTime) {
      return electron.ipcRenderer.invoke(C.terminalProcessStop, terminalId, pid, startTime);
    },
    tmuxSession(terminalId) {
      return electron.ipcRenderer.invoke(C.terminalTmuxSession, terminalId);
    },
    endTmuxSession(terminalId) {
      return electron.ipcRenderer.invoke(C.terminalEndTmuxSession, terminalId);
    },
    remoteSessionProcesses(terminalId) {
      return electron.ipcRenderer.invoke(C.terminalRemoteSessionProcesses, terminalId);
    },
    stopRemoteSessionProcess(terminalId, pid) {
      return electron.ipcRenderer.invoke(C.terminalStopRemoteSessionProcess, terminalId, pid);
    },
    roleInstallFailures() {
      return electron.ipcRenderer.invoke(C.terminalRoleInstallFailures);
    },
    onRoleInstallFailures(handler) {
      return subscribe(C.terminalOnRoleInstallFailures, handler);
    },
    onFocusRequested(handler) {
      return subscribe(C.terminalFocusRequested, handler);
    },
    onGeometryPinned(handler) {
      return subscribe(C.terminalOnGeometryPinned, handler);
    },
    publishLiveColors(terminals) {
      return electron.ipcRenderer.invoke(C.terminalPublishLiveColors, terminals);
    }
  },
  note: {
    read(workspaceId, nodeId) {
      return electron.ipcRenderer.invoke(C.noteRead, workspaceId, nodeId);
    },
    write(workspaceId, nodeId, text) {
      return electron.ipcRenderer.invoke(C.noteWrite, workspaceId, nodeId, text);
    },
    edit(workspaceId, nodeId, oldText, newText) {
      return electron.ipcRenderer.invoke(C.noteEdit, workspaceId, nodeId, oldText, newText);
    },
    rename(workspaceId, nodeId, newFileName) {
      return electron.ipcRenderer.invoke(C.noteRename, workspaceId, nodeId, newFileName);
    },
    reveal(workspaceId, nodeId) {
      return electron.ipcRenderer.invoke(C.noteReveal, workspaceId, nodeId);
    },
    moveToExternal(workspaceId, nodeId) {
      return electron.ipcRenderer.invoke(C.noteMoveToExternal, workspaceId, nodeId);
    },
    moveToManaged(workspaceId, nodeId) {
      return electron.ipcRenderer.invoke(C.noteMoveToManaged, workspaceId, nodeId);
    },
    createFromFile(workspaceId, node, sourcePath) {
      return electron.ipcRenderer.invoke(C.noteCreateFromFile, workspaceId, node, sourcePath);
    },
    createFromRemoteFile(workspaceId, node, connection, path, floorId) {
      return electron.ipcRenderer.invoke(
        C.noteCreateFromRemoteFile,
        workspaceId,
        node,
        connection,
        path,
        floorId
      );
    },
    refreshFromRemoteFile(workspaceId, nodeId) {
      return electron.ipcRenderer.invoke(C.noteRefreshFromRemoteFile, workspaceId, nodeId);
    },
    onChange(handler) {
      return subscribe(C.noteOnChange, handler);
    },
    attachImage(workspaceId, image) {
      return electron.ipcRenderer.invoke(C.noteAttachImage, workspaceId, image.dataBase64, image.ext);
    },
    notesDir(workspaceId) {
      return electron.ipcRenderer.invoke(C.noteNotesDir, workspaceId);
    },
    mediaDir(workspaceId) {
      return electron.ipcRenderer.invoke(C.noteMediaDir, workspaceId);
    }
  },
  fileTree: {
    list(nodeId, directoryPath) {
      return electron.ipcRenderer.invoke(C.fileTreeList, nodeId, directoryPath);
    },
    watch(nodeId, directoryPath) {
      return electron.ipcRenderer.invoke(C.fileTreeWatch, nodeId, directoryPath);
    },
    unwatch(nodeId) {
      return electron.ipcRenderer.invoke(C.fileTreeUnwatch, nodeId);
    },
    attachCheckout(path) {
      return electron.ipcRenderer.invoke(C.fileTreeAttachCheckout, path);
    },
    onDidChange(handler) {
      return subscribe(C.fileTreeOnDidChange, handler);
    },
    reveal(nodeId) {
      return electron.ipcRenderer.invoke(C.fileTreeReveal, nodeId);
    },
    gitState(nodeId) {
      return electron.ipcRenderer.invoke(C.fileTreeGitState, nodeId);
    },
    gitAction(nodeId, action) {
      return electron.ipcRenderer.invoke(C.fileTreeGitAction, nodeId, action);
    },
    gitChanges(nodeId) {
      return electron.ipcRenderer.invoke(C.fileTreeGitChanges, nodeId);
    },
    gitCancel(nodeId) {
      return electron.ipcRenderer.invoke(C.fileTreeGitCancel, nodeId);
    },
    gitIndexLock(nodeId) {
      return electron.ipcRenderer.invoke(C.fileTreeGitIndexLock, nodeId);
    },
    searchContents(nodeId, query, showHidden) {
      return electron.ipcRenderer.invoke(C.fileTreeSearchContents, nodeId, query, showHidden);
    },
    searchFilenames(nodeId) {
      return electron.ipcRenderer.invoke(C.fileTreeSearchFilenames, nodeId);
    },
    cancelSearch(nodeId) {
      return electron.ipcRenderer.invoke(C.fileTreeCancelSearch, nodeId);
    },
    onSearchResults(handler) {
      return subscribe(C.fileTreeOnSearchResults, handler);
    },
    gitDiffFiles(nodeId, scope) {
      return electron.ipcRenderer.invoke(C.fileTreeGitDiffFiles, nodeId, scope);
    },
    gitFileDiff(nodeId, scope, path, oldPath) {
      return electron.ipcRenderer.invoke(C.fileTreeGitFileDiff, nodeId, scope, path, oldPath ?? null);
    },
    gitHistory(nodeId, limit) {
      return electron.ipcRenderer.invoke(C.fileTreeGitHistory, nodeId, limit);
    },
    gitCommitBody(nodeId, hash) {
      return electron.ipcRenderer.invoke(C.fileTreeGitCommitBody, nodeId, hash);
    },
    gitBranches(nodeId) {
      return electron.ipcRenderer.invoke(C.fileTreeGitBranches, nodeId);
    },
    gitStashes(nodeId) {
      return electron.ipcRenderer.invoke(C.fileTreeGitStashes, nodeId);
    },
    gitMergePreview(nodeId, source, target) {
      return electron.ipcRenderer.invoke(C.fileTreeGitMergePreview, nodeId, source, target);
    },
    readFile(nodeId, path) {
      return electron.ipcRenderer.invoke(C.fileTreeReadFile, nodeId, path);
    },
    writeFile(nodeId, path, text) {
      return electron.ipcRenderer.invoke(C.fileTreeWriteFile, nodeId, path, text);
    },
    probeMedia(nodeId, path) {
      return electron.ipcRenderer.invoke(C.fileTreeProbeMedia, nodeId, path);
    },
    onFileChanged(handler) {
      return subscribe(C.fileTreeOnFileChanged, handler);
    },
    copyPath(nodeId, path) {
      return electron.ipcRenderer.invoke(C.fileTreeCopyPath, nodeId, path);
    },
    revealFile(nodeId, path) {
      return electron.ipcRenderer.invoke(C.fileTreeRevealFile, nodeId, path);
    },
    onGitActionProgress(handler) {
      return subscribe(C.fileTreeOnGitActionProgress, handler);
    },
    onGitState(handler) {
      return subscribe(C.fileTreeOnGitState, handler);
    },
    watchState(nodeId) {
      return electron.ipcRenderer.invoke(C.fileTreeWatchState, nodeId);
    },
    retryWatch(nodeId) {
      return electron.ipcRenderer.invoke(C.fileTreeRetryWatch, nodeId);
    },
    onWatchState(handler) {
      return subscribe(
        C.fileTreeOnWatchState,
        handler
      );
    },
    fileOperation(nodeId, operation) {
      return electron.ipcRenderer.invoke(C.fileTreeFileOperation, nodeId, operation);
    },
    fileClipboard() {
      return electron.ipcRenderer.invoke(C.fileTreeFileClipboard);
    }
  },
  files: {
    storeAttachment(workspaceId, input) {
      return electron.ipcRenderer.invoke(C.filesStoreAttachment, workspaceId, input);
    },
    openAttachment(workspaceId, nodeId) {
      return electron.ipcRenderer.invoke(C.filesOpenAttachment, workspaceId, nodeId);
    },
    revealAttachment(workspaceId, nodeId) {
      return electron.ipcRenderer.invoke(C.filesRevealAttachment, workspaceId, nodeId);
    },
    revealPath(path) {
      return electron.ipcRenderer.invoke(C.filesRevealPath, path);
    },
    linkPaths(paths) {
      return electron.ipcRenderer.invoke(C.filesLinkPaths, paths);
    },
    resolveLocalPath(path, bases) {
      return electron.ipcRenderer.invoke(C.filesResolveLocalPath, path, bases);
    },
    stagePastedImage(dataBase64, ext) {
      return electron.ipcRenderer.invoke(C.filesStagePastedImage, dataBase64, ext);
    },
    clipboardFilePaths() {
      return electron.ipcRenderer.invoke(C.filesClipboardFilePaths);
    }
  },
  clipboard: {
    // Plain `invoke`, not the licence-failure wrapper: this answers a boolean,
    // and a copy the user just clicked must not reject mid-gesture.
    writeImage(png) {
      return electron.ipcRenderer.invoke(C.clipboardWriteImage, png);
    }
  },
  connection: {
    createTerminalConnection(workspaceId, terminalIdA, terminalIdB, fromWorkspaceId) {
      return electron.ipcRenderer.invoke(
        C.connectionCreateTerminal,
        workspaceId,
        terminalIdA,
        terminalIdB,
        fromWorkspaceId
      );
    },
    createNoteConnection(workspaceId, terminalId, noteNodeId) {
      return electron.ipcRenderer.invoke(C.connectionCreateNote, workspaceId, terminalId, noteNodeId);
    },
    turnFileIntoNote(workspaceId, sourceNodeId, fileNodeId) {
      return electron.ipcRenderer.invoke(C.connectionTurnFileIntoNote, workspaceId, sourceNodeId, fileNodeId);
    },
    createNoteToNoteConnection(workspaceId, noteNodeIdA, noteNodeIdB) {
      return electron.ipcRenderer.invoke(
        C.connectionCreateNoteToNote,
        workspaceId,
        noteNodeIdA,
        noteNodeIdB
      );
    },
    createPortalConnection(workspaceId, terminalId, portalNodeId) {
      return electron.ipcRenderer.invoke(C.connectionCreatePortal, workspaceId, terminalId, portalNodeId);
    },
    createPortalToPortalConnection(workspaceId, portalNodeIdA, portalNodeIdB) {
      return electron.ipcRenderer.invoke(
        C.connectionCreatePortalToPortal,
        workspaceId,
        portalNodeIdA,
        portalNodeIdB
      );
    },
    createCrossFloorConnection(workspaceId, sourceTerminalId, targetTerminalId) {
      return electron.ipcRenderer.invoke(
        C.connectionCreateCrossFloor,
        workspaceId,
        sourceTerminalId,
        targetTerminalId
      );
    },
    connectNodes(workspaceId, fromNodeId, toNodeId, fromWorkspaceId) {
      return electron.ipcRenderer.invoke(C.connectionConnectNodes, workspaceId, fromNodeId, toNodeId, fromWorkspaceId);
    },
    updateRopePoints(workspaceId, connectionId, ropePoints) {
      return electron.ipcRenderer.invoke(C.connectionUpdateRopePoints, workspaceId, connectionId, ropePoints);
    },
    updateRopePointsMany(workspaceId, snapshot) {
      return electron.ipcRenderer.invoke(C.connectionUpdateRopePointsMany, workspaceId, snapshot);
    },
    delete(workspaceId, connectionId) {
      return electron.ipcRenderer.invoke(C.connectionDelete, workspaceId, connectionId);
    },
    deleteMany(workspaceId, connectionIds) {
      return electron.ipcRenderer.invoke(C.connectionDeleteMany, workspaceId, connectionIds);
    },
    disconnectNodes(workspaceId, fromNodeId, toNodeId) {
      return electron.ipcRenderer.invoke(C.connectionDisconnectNodes, workspaceId, fromNodeId, toNodeId);
    },
    removeAllFor(workspaceId, nodeId) {
      return electron.ipcRenderer.invoke(C.connectionRemoveAllFor, workspaceId, nodeId);
    },
    onTransferActive(handler) {
      return subscribe(C.connectionTransferActive, handler);
    }
  },
  cableTie: {
    create(workspaceId, tie) {
      return electron.ipcRenderer.invoke(C.cableTieCreate, workspaceId, tie);
    },
    move(workspaceId, tieId, position) {
      return electron.ipcRenderer.invoke(C.cableTieMove, workspaceId, tieId, position);
    },
    delete(workspaceId, tieId) {
      return electron.ipcRenderer.invoke(C.cableTieDelete, workspaceId, tieId);
    },
    prune(workspaceId) {
      return electron.ipcRenderer.invoke(C.cableTiePrune, workspaceId);
    }
  },
  portal: {
    register(portalId, webContentsId) {
      return electron.ipcRenderer.invoke(C.portalRegister, portalId, webContentsId);
    },
    unregister(portalId) {
      return electron.ipcRenderer.invoke(C.portalUnregister, portalId);
    },
    resolveSource(path) {
      return electron.ipcRenderer.invoke(C.portalResolveSource, path);
    },
    directoryIndex(directory) {
      return electron.ipcRenderer.invoke(C.portalDirectoryIndex, directory);
    },
    watchFile(portalId, file) {
      return electron.ipcRenderer.invoke(C.portalWatchFile, portalId, file);
    },
    unwatchFile(portalId) {
      return electron.ipcRenderer.invoke(C.portalUnwatchFile, portalId);
    },
    onFileChanged(handler) {
      return subscribe(C.portalFileChanged, handler);
    },
    onWakeRequested(handler) {
      return subscribe(C.portalWake, handler);
    }
  },
  // A key crosses addApiKey and replaceKey; nothing here logs an argument.
  accounts: {
    view() {
      return electron.ipcRenderer.invoke(C.accountsView);
    },
    add(name, cli, connection, host) {
      return electron.ipcRenderer.invoke(C.accountsAdd, name, cli, connection, host);
    },
    addApiKey(name, cli, key, endpoint, connection) {
      return electron.ipcRenderer.invoke(C.accountsAddApiKey, name, cli, key, endpoint, connection);
    },
    replaceKey(accountId, key) {
      return electron.ipcRenderer.invoke(C.accountsReplaceKey, accountId, key);
    },
    setEndpoint(accountId, endpoint) {
      return electron.ipcRenderer.invoke(C.accountsSetEndpoint, accountId, endpoint);
    },
    signOut(accountId) {
      return electron.ipcRenderer.invoke(C.accountsSignOut, accountId);
    },
    rename(accountId, cli, name) {
      return electron.ipcRenderer.invoke(C.accountsRename, accountId, cli, name);
    },
    remove(accountId) {
      return electron.ipcRenderer.invoke(C.accountsRemove, accountId);
    },
    moveTerminalsToDefault(accountId) {
      return electron.ipcRenderer.invoke(C.accountsMoveToDefault, accountId);
    },
    watchSignIn(accountId, terminalId) {
      return electron.ipcRenderer.invoke(C.accountsWatchSignIn, accountId, terminalId);
    },
    watchSignOut(accountId, terminalId) {
      return electron.ipcRenderer.invoke(C.accountsWatchSignOut, accountId, terminalId);
    },
    refresh() {
      return electron.ipcRenderer.invoke(C.accountsRefresh);
    },
    refreshPlace(connection) {
      return electron.ipcRenderer.invoke(C.accountsRefreshPlace, connection);
    },
    signOutAll() {
      return electron.ipcRenderer.invoke(C.accountsSignOutAll);
    },
    keepsSessionAlive(terminalId) {
      return electron.ipcRenderer.invoke(C.accountsKeepsSessionAlive, terminalId);
    },
    setTerminalAccount(workspaceId, terminalId, accountId, restartNow) {
      return electron.ipcRenderer.invoke(C.accountsSetTerminal, workspaceId, terminalId, accountId, restartNow);
    },
    describe(request) {
      return electron.ipcRenderer.invoke(C.accountsDescribe, request);
    },
    onChanged(handler) {
      return subscribe(C.accountsOnChanged, handler);
    },
    onSignedIn(handler) {
      return subscribe(C.accountsOnSignedIn, handler);
    },
    providers() {
      return electron.ipcRenderer.invoke(C.accountsProviders);
    },
    setProvidersViewer(viewerId, isShowing) {
      electron.ipcRenderer.send(C.accountsSetProvidersViewer, viewerId, isShowing);
    },
    onProvidersChanged(handler) {
      return subscribe(C.accountsOnProvidersChanged, handler);
    },
    approveProvider(providerId, digest) {
      return electron.ipcRenderer.invoke(C.accountsApproveProvider, providerId, digest);
    },
    restoreBuiltInProviders() {
      return electron.ipcRenderer.invoke(C.accountsRestoreBuiltInProviders);
    },
    restoreProvider(providerId, expectedDigest) {
      return electron.ipcRenderer.invoke(C.accountsRestoreProvider, providerId, expectedDigest);
    },
    revealProvidersFolder() {
      return electron.ipcRenderer.invoke(C.accountsRevealProvidersFolder);
    },
    revealProviderFile(providerId) {
      return electron.ipcRenderer.invoke(C.accountsRevealProviderFile, providerId);
    }
  },
  // Portal Design. Plain `invoke` on all four, never invokeWithLicenseFailure:
  // this surface answers null for every unhappy path — dead daemon, hidden
  // guest, malformed reply, license denial — and the renderer degrades to the
  // plain padded crop rather than handling a rejection mid-gesture.
  portalDesign: {
    capture(portalId) {
      return electron.ipcRenderer.invoke(C.portalDesignCapture, portalId);
    },
    resolveScript(workspaceId, stroke, imageSize) {
      return electron.ipcRenderer.invoke(C.portalDesignResolveScript, workspaceId, stroke, imageSize);
    },
    region(workspaceId, strokeBounds, candidates, displaySize) {
      return electron.ipcRenderer.invoke(
        C.portalDesignRegion,
        workspaceId,
        strokeBounds,
        candidates,
        displaySize
      );
    },
    pick(workspaceId, point, candidates) {
      return electron.ipcRenderer.invoke(C.portalDesignPick, workspaceId, point, candidates);
    }
  },
  device: {
    contract(workspaceId) {
      return electron.ipcRenderer.invoke(C.deviceContract, workspaceId);
    },
    discover(workspaceId) {
      return electron.ipcRenderer.invoke(C.deviceDiscover, workspaceId);
    },
    automation(request) {
      return electron.ipcRenderer.invoke(C.deviceAutomation, request);
    },
    onFrameCaptureRequested(handler) {
      return subscribe(C.deviceFrameCaptureRequest, handler);
    },
    completeFrameCapture(requestId, result) {
      return electron.ipcRenderer.invoke(C.deviceFrameCaptureResult, requestId, result);
    },
    publishSessions(sessions) {
      return electron.ipcRenderer.invoke(C.deviceSessionsPublish, sessions);
    }
  },
  interAgent: {
    listPeers(terminalId) {
      return electron.ipcRenderer.invoke(C.interAgentListPeers, terminalId);
    }
  },
  sidebarLayout: {
    get() {
      return electron.ipcRenderer.invoke(C.sidebarLayoutGet);
    },
    set(layout) {
      return electron.ipcRenderer.invoke(C.sidebarLayoutSet, layout);
    },
    onChanged(handler) {
      return subscribe(C.sidebarLayoutOnChanged, handler);
    }
  },
  data: {
    storageLocation() {
      return electron.ipcRenderer.invoke(C.dataStorageLocation);
    },
    revealStorageLocation() {
      return electron.ipcRenderer.invoke(C.dataRevealStorageLocation);
    },
    revealBackupsLocation() {
      return electron.ipcRenderer.invoke(C.dataRevealBackupsLocation);
    },
    moveStorage() {
      return electron.ipcRenderer.invoke(C.dataMoveStorage);
    },
    usage() {
      return electron.ipcRenderer.invoke(C.dataUsage);
    },
    deleteAll() {
      return electron.ipcRenderer.invoke(C.dataDeleteAll);
    },
    listBackups() {
      return electron.ipcRenderer.invoke(C.dataListBackups);
    },
    lastBackupAt() {
      return electron.ipcRenderer.invoke(C.dataLastBackupAt);
    },
    lastSaveAt() {
      return electron.ipcRenderer.invoke(C.dataLastSaveAt);
    },
    backupNow() {
      return electron.ipcRenderer.invoke(C.dataBackupNow);
    },
    deleteBackup(path) {
      return electron.ipcRenderer.invoke(C.dataDeleteBackup, path);
    },
    exportBackup() {
      return electron.ipcRenderer.invoke(C.dataExportBackup);
    },
    pickBackupToImport() {
      return electron.ipcRenderer.invoke(C.dataPickBackupToImport);
    },
    importBackup(path, kind) {
      return electron.ipcRenderer.invoke(C.dataImportBackup, path, kind);
    },
    clearGlobalPortalStorage() {
      return electron.ipcRenderer.invoke(C.dataClearGlobalPortalStorage);
    },
    onStoreReloaded(handler) {
      return subscribe(C.dataOnStoreReloaded, handler);
    }
  },
  palette: {
    rank(workspaceId, query, candidates) {
      return electron.ipcRenderer.invoke(C.paletteRank, workspaceId, query, candidates);
    }
  },
  prompter: {
    serialize(workspaceId, segments) {
      return electron.ipcRenderer.invoke(C.prompterSerialize, workspaceId, segments);
    },
    deliver(terminalId, prompt, segments) {
      return electron.ipcRenderer.invoke(C.prompterDeliver, terminalId, prompt, segments);
    },
    materialize(terminalId, prompt, segments, files) {
      return electron.ipcRenderer.invoke(C.prompterMaterialize, terminalId, prompt, segments, files);
    },
    mentionTargets(terminalId) {
      return electron.ipcRenderer.invoke(C.prompterMentionTargets, terminalId);
    },
    fileIndex(terminalId) {
      return electron.ipcRenderer.invoke(C.prompterFileIndex, terminalId);
    },
    cancelFileIndex(terminalId) {
      return electron.ipcRenderer.invoke(C.prompterCancelFileIndex, terminalId);
    },
    fileIcon(path) {
      return electron.ipcRenderer.invoke(C.prompterFileIcon, path);
    }
  },
  agentUsage: {
    getState() {
      return electron.ipcRenderer.invoke(C.agentUsageGetState);
    },
    refresh(providerID) {
      return electron.ipcRenderer.invoke(C.agentUsageRefresh, providerID);
    },
    refreshAll() {
      return electron.ipcRenderer.invoke(C.agentUsageRefreshAll);
    },
    restoreDefaults(targets) {
      return electron.ipcRenderer.invoke(C.agentUsageRestoreDefaults, targets);
    },
    revealProvidersFolder() {
      return electron.ipcRenderer.invoke(C.agentUsageRevealProvidersFolder);
    },
    setViewer(viewerId, isShowing) {
      electron.ipcRenderer.send(C.agentUsageSetViewer, viewerId, isShowing);
    },
    onStateChanged(listener) {
      return subscribe(C.agentUsageOnStateChanged, listener);
    }
  },
  gitHosts: {
    configure() {
      return electron.ipcRenderer.invoke(C.gitHostsConfigure);
    },
    restoreDefault(id, expectedDigest) {
      return electron.ipcRenderer.invoke(C.gitHostsRestoreDefault, id, expectedDigest);
    },
    restoreMissingDefaults() {
      return electron.ipcRenderer.invoke(C.gitHostsRestoreMissingDefaults);
    },
    checkAccount(providerId) {
      return electron.ipcRenderer.invoke(C.gitHostsCheckAccount, providerId);
    },
    revealProvidersFolder() {
      return electron.ipcRenderer.invoke(C.gitHostsRevealProvidersFolder);
    }
  },
  pullRequests: {
    imagePrefix: (workspaceId, floorId) => electron.ipcRenderer.invoke(C.pullRequestsImagePrefix, workspaceId, floorId),
    keepImage: (workspaceId, floorId, dataBase64, format) => electron.ipcRenderer.invoke(C.pullRequestsKeepImage, workspaceId, floorId, dataBase64, format),
    imagesExist: (workspaceId, floorId) => electron.ipcRenderer.invoke(C.pullRequestsImagesExist, workspaceId, floorId),
    showImages: (workspaceId, floorId) => electron.ipcRenderer.invoke(C.pullRequestsShowImages, workspaceId, floorId),
    closeImages: (workspaceId, floorId) => electron.ipcRenderer.invoke(C.pullRequestsCloseImages, workspaceId, floorId),
    imagesDismissed: (workspaceId, floorId, recordId) => electron.ipcRenderer.invoke(C.pullRequestsImagesDismissed, workspaceId, floorId, recordId),
    getState() {
      return electron.ipcRenderer.invoke(C.pullRequestsGetState);
    },
    onStateChanged(listener) {
      return subscribe(C.pullRequestsOnStateChanged, listener);
    },
    onOpenSheet(listener) {
      return subscribe(C.pullRequestsOnOpenSheet, listener);
    },
    setPresented(floor) {
      electron.ipcRenderer.send(C.pullRequestsSetPresented, floor);
    },
    prepare(workspaceId, floorId, base) {
      return electron.ipcRenderer.invoke(C.pullRequestsPrepare, workspaceId, floorId, base);
    },
    account(workspaceId, floorId, base) {
      return electron.ipcRenderer.invoke(C.pullRequestsAccount, workspaceId, floorId, base);
    },
    checkoutIsRemote(workspaceId, floorId) {
      return electron.ipcRenderer.invoke(C.pullRequestsCheckoutIsRemote, workspaceId, floorId);
    },
    lookForExisting(workspaceId, floorId) {
      return electron.ipcRenderer.invoke(C.pullRequestsLookForExisting, workspaceId, floorId);
    },
    open(workspaceId, floorId, request) {
      return electron.ipcRenderer.invoke(C.pullRequestsOpen, workspaceId, floorId, request);
    },
    openOnWebsite(workspaceId, floorId, request) {
      return electron.ipcRenderer.invoke(C.pullRequestsOpenOnWebsite, workspaceId, floorId, request);
    },
    check(workspaceId, floorId) {
      return electron.ipcRenderer.invoke(C.pullRequestsCheck, workspaceId, floorId);
    },
    markSeen(workspaceId, floorId) {
      return electron.ipcRenderer.invoke(C.pullRequestsMarkSeen, workspaceId, floorId);
    },
    push(workspaceId, floorId, recordId) {
      return electron.ipcRenderer.invoke(C.pullRequestsPush, workspaceId, floorId, recordId);
    },
    merge(workspaceId, floorId, recordId, method) {
      return electron.ipcRenderer.invoke(C.pullRequestsMerge, workspaceId, floorId, recordId, method);
    },
    forget(workspaceId, floorId, recordId) {
      return electron.ipcRenderer.invoke(C.pullRequestsForget, workspaceId, floorId, recordId);
    },
    removeMerged(workspaceId, floorId, recordId, confirmExtraWork) {
      return electron.ipcRenderer.invoke(C.pullRequestsRemoveMerged, workspaceId, floorId, recordId, confirmExtraWork);
    },
    handOff(workspaceId, floorId, request) {
      return electron.ipcRenderer.invoke(C.pullRequestsHandOff, workspaceId, floorId, request);
    },
    folders: {
      openFromTree: (workspaceId, nodeId) => electron.ipcRenderer.invoke(C.pullRequestFoldersOpen, workspaceId, nodeId),
      branches: (folderId) => electron.ipcRenderer.invoke(C.pullRequestFoldersBranches, folderId),
      prepare: (folderId, base) => electron.ipcRenderer.invoke(C.pullRequestFoldersPrepare, folderId, base),
      account: (folderId, base) => electron.ipcRenderer.invoke(C.pullRequestFoldersAccount, folderId, base),
      diff: (folderId, base) => electron.ipcRenderer.invoke(C.pullRequestFoldersDiff, folderId, base),
      fileDiff: (folderId, base, path, oldPath) => electron.ipcRenderer.invoke(C.pullRequestFoldersFileDiff, folderId, base, path, oldPath),
      open: (folderId, request) => electron.ipcRenderer.invoke(C.pullRequestFoldersOpenPullRequest, folderId, request),
      openOnWebsite: (folderId, request) => electron.ipcRenderer.invoke(C.pullRequestFoldersOpenOnWebsite, folderId, request),
      imagePrefix: (folderId) => electron.ipcRenderer.invoke(C.pullRequestFoldersImagePrefix, folderId),
      keepImage: (folderId, dataBase64, format) => electron.ipcRenderer.invoke(C.pullRequestFoldersKeepImage, folderId, dataBase64, format),
      imagesExist: (folderId) => electron.ipcRenderer.invoke(C.pullRequestFoldersImagesExist, folderId),
      showImages: (folderId) => electron.ipcRenderer.invoke(C.pullRequestFoldersShowImages, folderId),
      close: (folderId) => electron.ipcRenderer.invoke(C.pullRequestFoldersClose, folderId)
    }
  },
  chat: {
    conversation(terminalId, slot) {
      return electron.ipcRenderer.invoke(C.chatConversation, terminalId, slot);
    },
    loadOlderHistory(terminalId, conversationId) {
      return electron.ipcRenderer.invoke(C.chatLoadOlderHistory, terminalId, conversationId);
    },
    loadHistoryBackTo(terminalId, conversationId, entryId) {
      return electron.ipcRenderer.invoke(C.chatLoadHistoryBackTo, terminalId, conversationId, entryId);
    },
    searchHistory(terminalId, conversationId, query, requestId) {
      return electron.ipcRenderer.invoke(C.chatSearchHistory, terminalId, conversationId, query, requestId);
    },
    cancelSearchHistory(requestId) {
      return electron.ipcRenderer.invoke(C.chatCancelSearchHistory, requestId);
    },
    threads(terminalId) {
      return electron.ipcRenderer.invoke(C.chatThreads, terminalId);
    },
    enter(terminalId) {
      return electron.ipcRenderer.invoke(C.chatEnter, terminalId);
    },
    exit(terminalId) {
      return electron.ipcRenderer.invoke(C.chatExit, terminalId);
    },
    setShowsShellWindowDuringTurns(terminalId, shows) {
      return electron.ipcRenderer.invoke(C.chatSetShowsShellWindowDuringTurns, terminalId, shows);
    },
    send(terminalId, segments, text, entryId) {
      return electron.ipcRenderer.invoke(C.chatSend, terminalId, segments, text, entryId);
    },
    interrupt(terminalId) {
      return electron.ipcRenderer.invoke(C.chatInterrupt, terminalId);
    },
    acknowledgeAttention(terminalId) {
      return electron.ipcRenderer.invoke(C.chatAcknowledgeAttention, terminalId);
    },
    markRead(terminalId) {
      return electron.ipcRenderer.invoke(C.chatMarkRead, terminalId);
    },
    switchThread(terminalId, slot) {
      return electron.ipcRenderer.invoke(C.chatSwitchThread, terminalId, slot);
    },
    clearThread(terminalId, slot) {
      return electron.ipcRenderer.invoke(C.chatClearThread, terminalId, slot);
    },
    deleteEntry(terminalId, entryId) {
      return electron.ipcRenderer.invoke(C.chatDeleteEntry, terminalId, entryId);
    },
    deleteAttachment(terminalId, attachmentId) {
      return electron.ipcRenderer.invoke(C.chatDeleteAttachment, terminalId, attachmentId);
    },
    onConversationEvent(handler) {
      return subscribe(C.chatOnConversationEvent, handler);
    },
    attachmentFacts(path) {
      return electron.ipcRenderer.invoke(C.chatAttachmentFacts, path);
    },
    openAttachment(path) {
      return electron.ipcRenderer.invoke(C.chatOpenAttachment, path);
    },
    startAttachmentDrag(path) {
      electron.ipcRenderer.send(C.chatStartAttachmentDrag, path);
    },
    askNames(terminalId) {
      return electron.ipcRenderer.invoke(C.chatAskNames, terminalId);
    },
    captureChatArchives(terminalIds) {
      return electron.ipcRenderer.invoke(C.chatCaptureArchives, terminalIds);
    },
    copyChats(copies, archives) {
      return electron.ipcRenderer.invoke(C.chatCopyChats, copies, archives);
    },
    discardCopiedChats(conversationIds) {
      return electron.ipcRenderer.invoke(C.chatDiscardCopiedChats, conversationIds);
    },
    sendComposedPrompt(terminalId, text, content) {
      return electron.ipcRenderer.invoke(C.chatSendComposedPrompt, terminalId, text, content);
    },
    searchConversations(query, limit, labels) {
      return electron.ipcRenderer.invoke(C.chatSearchConversations, query, limit, labels);
    },
    releaseConversationSearch() {
      return electron.ipcRenderer.invoke(C.chatReleaseConversationSearch);
    }
  },
  pathForFile(file) {
    try {
      return electron.webUtils.getPathForFile(file);
    } catch {
      return "";
    }
  },
  license: {
    get() {
      return electron.ipcRenderer.invoke(C.licenseGet);
    },
    activate(key) {
      return invokeLicenseCommand(C.licenseActivate, key);
    },
    deactivate() {
      return invokeLicenseCommand(C.licenseDeactivate);
    },
    selectFreeWorkspace(workspaceId) {
      return invokeLicenseCommand(C.licenseSelectFreeWorkspace, workspaceId);
    },
    clearFreeWorkspaceSelection() {
      return invokeLicenseCommand(C.licenseClearFreeWorkspace);
    },
    onChanged(handler) {
      return subscribe(C.licenseOnChanged, handler);
    },
    setDevOverride(status) {
      return electron.ipcRenderer.invoke(C.licenseSetDevOverride, status);
    }
  },
  codex: {
    /**
     * The terminal sheets' warning: core's answer for whether this command
     * launches the Codex TUI without its `--no-daemon` flag. Strictly
     * boolean: false is also a non-Codex command or a core that cannot
     * answer, and the call never rejects.
     */
    isMissingFlag(command, target) {
      return electron.ipcRenderer.invoke(C.codexIsMissingFlag, command, target);
    }
  },
  routines: {
    list() {
      return electron.ipcRenderer.invoke(C.routineList);
    },
    create(input) {
      return electron.ipcRenderer.invoke(C.routineCreate, input);
    },
    update(id, patch) {
      return electron.ipcRenderer.invoke(C.routineUpdate, id, patch);
    },
    delete(id) {
      return electron.ipcRenderer.invoke(C.routineDelete, id);
    },
    setEnabled(id, enabled) {
      return electron.ipcRenderer.invoke(C.routineSetEnabled, id, enabled);
    },
    runNow(id) {
      return electron.ipcRenderer.invoke(C.routineRunNow, id);
    },
    onChanged(handler) {
      return subscribe(C.routineOnChanged, handler);
    },
    history() {
      return electron.ipcRenderer.invoke(C.routineHistory);
    },
    historyRemove(id) {
      return electron.ipcRenderer.invoke(C.routineHistoryRemove, id);
    },
    historyClear() {
      return electron.ipcRenderer.invoke(C.routineHistoryClear);
    },
    onHistoryChanged(handler) {
      return subscribe(C.routineOnHistoryChanged, handler);
    }
  },
  remote: {
    getState() {
      return electron.ipcRenderer.invoke(C.remoteGetState);
    },
    onStateChanged(handler) {
      return subscribe(C.remoteOnStateChanged, handler);
    },
    beginPairingWindow() {
      return electron.ipcRenderer.invoke(C.remoteBeginPairingWindow);
    },
    endPairingWindow() {
      return electron.ipcRenderer.invoke(C.remoteEndPairingWindow);
    },
    setEnabled(enabled) {
      return electron.ipcRenderer.invoke(C.remoteSetEnabled, enabled);
    },
    setPort(port) {
      return electron.ipcRenderer.invoke(C.remoteSetPort, port);
    },
    setTailnetOnly(tailnetOnly) {
      return electron.ipcRenderer.invoke(C.remoteSetTailnetOnly, tailnetOnly);
    },
    setPassword(password) {
      return electron.ipcRenderer.invoke(C.remoteSetPassword, password);
    },
    revokeDevice(id) {
      return electron.ipcRenderer.invoke(C.remoteRevokeDevice, id);
    },
    setDeviceRole(id, role) {
      return electron.ipcRenderer.invoke(C.remoteSetDeviceRole, id, role);
    },
    renameDevice(id, name) {
      return electron.ipcRenderer.invoke(C.remoteRenameDevice, id, name);
    },
    onPresence(handler) {
      const unsubscribe = subscribe(C.remoteOnPresence, handler);
      electron.ipcRenderer.send(C.remotePresenceResend);
      return unsubscribe;
    },
    onCameraFrame(handler) {
      return subscribe(C.remoteOnCameraFrame, handler);
    },
    onPartituraPreviewRequested(handler) {
      return subscribe(C.remotePartituraPreviewRequest, handler);
    },
    completePartituraPreview(requestId, result) {
      return electron.ipcRenderer.invoke(C.remotePartituraPreviewResult, requestId, result);
    },
    onPortalReloadRequested(handler) {
      return subscribe(C.remotePortalReloadRequest, handler);
    },
    completePortalReload(requestId, result) {
      return electron.ipcRenderer.invoke(C.remotePortalReloadResult, requestId, result);
    }
  },
  snapNode(context) {
    return invokeWithLicenseFailure(C.snapNode, context);
  },
  tidyNode(request) {
    return invokeWithLicenseFailure(C.tidyNode, request);
  }
};
electron.contextBridge.exposeInMainWorld("maestri", api);
