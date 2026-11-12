/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { maestrozaCore } from "@maestroza/core";
import { ElementName, ElementPath, MtzStore, MtzElement } from "@maestroza/kernel";

import { MtzPlatformManagerImpl } from "./PlatformManagerImpl.js";
import { MtzOperation } from "./execution.js";

const VERSION = '0.0.1';

type MaestrozaUserServiceRegisterFunction = (email: string) => Promise<MtzElement>;

type MeaestrozaUserService = {
  register: MaestrozaUserServiceRegisterFunction 
};

//type MeaestrozaTeamService = any;
//type MeaestrozaOrganizationService = any;
//type MeaestrozaOfferService = any;
//type MeaestrozaRequestService = any;
//type MeaestrozaFormService = any;


type MaestrozaPlatform = {
  version: string,
  getElement: (elementPath: ElementPath) => Promise<MtzElement|null>;
  execute: (what: MtzOperation|MtzOperation[]) => Promise<void>,
  loadPlugin: (name: ElementName, pluginPath: string) => Promise<MtzElement>,
  runOnce: () => Promise<void>, 
  user: MeaestrozaUserService,
  //organization: MeaestrozaOrganizationService,
  //team: MeaestrozaTeamService,
  //offer: MeaestrozaOfferService,
  //request: MaestrozaRequestService,
  //form: MaestrozaFormService
};

const maestrozaPlatform = async (store?: MtzStore) : Promise<MaestrozaPlatform> => {

  const core = await maestrozaCore(store);

  const platformManager = new MtzPlatformManagerImpl(core);
  await platformManager.initialize();

  return {
    version: VERSION,
    runOnce: async () => await core.runOnce(),
    getElement: async (elementPath: ElementPath) => await core.getElement(elementPath),
    loadPlugin: async (name: ElementName, pluginPath: string) => await platformManager.loadPlugin(name, pluginPath),
    execute: async (what: MtzOperation|MtzOperation[]) => await platformManager.execute(what),
    user: {
      register: async (_email: string) => {
        return {} as MtzElement;
      }
    },

    //organization: {
    //},
    //
    //team: {
    //},
    //
    //offer: {
    //},
    //
    //request: {
    //},
    //
    //form: {
    //},
  };
};


export { maestrozaPlatform };
export type { MaestrozaPlatform };
