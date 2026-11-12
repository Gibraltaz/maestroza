/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementName, ElementPath, MtzElement } from "./Element.js";
import { MtzTree } from "./Tree.js";
import { MtzStore } from "./store/Store.js";
import { RawMemoryStore } from "./store/RawMemoryStore.js";
import { ContainerDeclaration } from './Tree.js';
import { TypeDeclaration } from "./typeHandlers/TypeHandler.js";

/*
import enTranslationCatalog from './translations/en.json';
import frTranslationCatalog from './translations/fr.json';
import { mergeTranslationCatalog, translate } from "@maestroza/translation";
*/

const VERSION = '0.0.1';

type MaestrozaKernelInitializeFunction = (store: MtzStore) => Promise<void>;
type MaestrozaKernelIsInitializedFunction = () => boolean;
type MaestrozaKernelGetFunction = (elementPath: ElementPath) => Promise<MtzElement|null>;
type MaestrozaKernelDeclareContainerFunction = (containerDeclaration: ContainerDeclaration) => Promise<MtzElement>;
type MaestrozaKernelDeclareType = (typeDeclaration: TypeDeclaration) => Promise<MtzElement>;
type MaestrozaKernelModifiyElementFunction = (element: MtzElement) => Promise<void>;
type MaestrozaKernelStoreNewElement = (element: MtzElement) => Promise<void>;
type MaestrozaKernelCreateElementFunction =
  (elementName:ElementName, parentPath:ElementPath, typePath:ElementPath, params: Record<string,any>) => Promise<MtzElement>;



type MaestrozaKernel = {
  initialize: MaestrozaKernelInitializeFunction,
  isInitialized: MaestrozaKernelIsInitializedFunction,
  version: string,
  getStoredElement: MaestrozaKernelGetFunction,
  createElement: MaestrozaKernelCreateElementFunction,
  modifyElement: MaestrozaKernelModifiyElementFunction,
  storeNewElement: MaestrozaKernelStoreNewElement, // TODO migration kernel : à supprimer
  declareContainer: MaestrozaKernelDeclareContainerFunction,
  declareType: MaestrozaKernelDeclareType ,
};


const maestrozaKernel = async (runtimeStore?: MtzStore) : Promise<MaestrozaKernel> => {

  /*
  mergeTranslationCatalog({
    en: enTranslationCatalog,
    fr: frTranslationCatalog
  });
  */

  const tree = new MtzTree();
  if (runtimeStore === undefined)
    runtimeStore = new RawMemoryStore();
  await tree.initialize(runtimeStore);

  return {
    version: VERSION,
    initialize: (store: MtzStore) => tree.initialize(store),
    isInitialized: () => tree.initialized,
    getStoredElement: (elementPath: ElementPath) => tree.getStoredElement(elementPath),
    createElement: (elementName:ElementName, parentPath:ElementPath, typePath:ElementPath, params: Record<string,any>) =>
      tree.createElement(elementName, parentPath, typePath, params),
    modifyElement: (element: MtzElement) => tree.updateElementInStore(element),
    storeNewElement: (element: MtzElement) => tree.storeNewElement(element),
    declareContainer: (containerDeclaration: ContainerDeclaration) => tree.declareContainer(containerDeclaration),
    declareType: (typeDeclaration: TypeDeclaration) => tree.declareType(typeDeclaration)
  };
};


export { maestrozaKernel };
export type { MaestrozaKernel };
