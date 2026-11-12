import { MaestrozaCore, maestrozaCore } from '@maestroza/core';
import { MtzStore, rootName, ElementPath, ElementName, MtzElement } from '@maestroza/kernel';

import { MtzPlatformManager } from './PlatformManager.js';
import { execute as executeOp, MtzOperation } from "./execution.js";
import { 
  registryContainerName, userRegistryContainerName, registryContainerPath,
  platformContainerName, authenticatorContainerName, platformContainerPath,
  pluginContainerName
} from './global.js';
import { userTypeDeclaration } from './typeHandlers/userTypeHandler.js';
import { pluginTypeDeclaration } from './typeHandlers/pluginTypeHandler.js';
import { loadPlugin as loadPluginUtil } from './plugin.js';

class MtzPlatformManagerImpl extends MtzPlatformManager  {

  private _initialized = false;
  private _core: MaestrozaCore;

  constructor (core: MaestrozaCore) {
    super();
    this._core = core;
  }

  public async initialize (store?: MtzStore) {
    if (this._core === null)
      throw new Error("Core not initialized");
    if (this._initialized)
      throw new Error("Maestroza Plantform already initialized");

    // cas des auto-tests qui n'ont pas passé de kernel
    if (store !== undefined) {
      if (this._core !== null)
        throw new Error("Maestroza Plantform already initialized");
      this._core = await maestrozaCore(store);
    }


    // type declaration «#/types/plugin»
    await this._core.declareType(pluginTypeDeclaration);

    // type declaration «#/types/user»
    await this._core.declareType(userTypeDeclaration);

    // mise en place de «#/registry»
    await this._core.declareContainer({
        elementName: registryContainerName,
        parentPath: [rootName] as ElementPath,
        isVolatile: false
      }
    );

    // mise en place de «#/registry/users»
    await this._core.declareContainer({
        elementName: userRegistryContainerName,
        parentPath: registryContainerPath,
        isVolatile: false
      }
    );

    // mise en place de «#/platform»
    await this._core.declareContainer({
        elementName: platformContainerName,
        parentPath: [rootName] as ElementPath,
        isVolatile: true
      }
    );

    // mise en place de «#/platform/plugins»
    await this._core.declareContainer({
        elementName: pluginContainerName,
        parentPath: platformContainerPath ,
        isVolatile: true
      }
    );

    // mise en place de «#/platform/authenticators»
    await this._core.declareContainer({
        elementName: authenticatorContainerName ,
        parentPath: platformContainerPath ,
        isVolatile: true
      }
    );

  }

  public get core(): MaestrozaCore {
    return this._core;
  }

  public async execute(what: MtzOperation|MtzOperation[]) {
    executeOp(this, what);
  }

  public async createElement(
    elementName: ElementName,
    parentPath: ElementPath,
    typePath: ElementPath,
    params: Record<string, any>
  ) {
    return await this._core.createElement(elementName, parentPath, typePath, params);
  }

  public async modifyElement(element: MtzElement) {
    return await this._core.modifyElement(element);
  }

  public async loadPlugin(name: ElementName, pluginPath: string): Promise<MtzElement> {
    return await loadPluginUtil(name, pluginPath, this);
  }

}

export { MtzPlatformManagerImpl };
