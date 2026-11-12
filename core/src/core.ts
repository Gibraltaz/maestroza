/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import {
  maestrozaKernel, MtzStore, MtzElement, RawMemoryStore,
  TypeDeclaration, ContainerDeclaration, ElementPath,
  ElementName
} from '@maestroza/kernel';
import { MtzEngine } from './Engine.js';

const VERSION = '0.0.1';

type MaestrozaCoreInitializeFunction = (store: MtzStore) => Promise<void>;
type MaestrozaCoreIsInitializedFunction = () => boolean;
type MaestrozaCoreGetElementFunction = (elementPath: ElementPath) => Promise<MtzElement|null>;
type MaestrozaCoreDeclareType = (typeDeclaration: TypeDeclaration) => Promise<MtzElement>;
type MaestrozaCoreDeclareContainerFunction = (containerDeclaration: ContainerDeclaration) => Promise<MtzElement>;
type MaestrozaCoreCreateElementFunction =
  (elementName:ElementName, parentPath:ElementPath, typePath:ElementPath, params: Record<string,any>) => Promise<MtzElement>;
type MaestrozaCoreModifyElementFunction = (element: MtzElement) => Promise<void>;

type MaestrozaCore = {
  version: string,
  initialize: MaestrozaCoreInitializeFunction,
  isInitialized: MaestrozaCoreIsInitializedFunction,
  getElement: MaestrozaCoreGetElementFunction,
  createElement: MaestrozaCoreCreateElementFunction,
  modifyElement: MaestrozaCoreModifyElementFunction,
  runOnce: () => Promise<void>,
  declareType: MaestrozaCoreDeclareType ,
  declareContainer: MaestrozaCoreDeclareContainerFunction,
};

const maestrozaCore = async (store?: MtzStore) : Promise<MaestrozaCore> => {

  if (store === undefined)
    store = new RawMemoryStore();
  const kernel = await maestrozaKernel(store);

  const engine = new MtzEngine(kernel);
  await engine.initialize();

  const runOnce = async () : Promise<void> => {
    await engine.runOnce();
  };

  return {
    version: VERSION,
    runOnce,
    initialize: (store: MtzStore) => kernel.initialize(store),
    isInitialized: () => kernel.isInitialized(),
    getElement: async (elementPath: ElementPath) => kernel.getStoredElement(elementPath),
    createElement: async (elementName:ElementName, parentPath:ElementPath, typePath:ElementPath, params: Record<string,any>) =>
      kernel.createElement(elementName, parentPath, typePath, params),
    modifyElement: async (element:MtzElement) => kernel.modifyElement(element),
    declareType: (typeDeclaration: TypeDeclaration) => kernel.declareType(typeDeclaration),
    declareContainer: (containerDeclaration: ContainerDeclaration) => kernel.declareContainer(containerDeclaration)
  };
};


export { maestrozaCore };
export type { MaestrozaCore };
