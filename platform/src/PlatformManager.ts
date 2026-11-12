/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { MaestrozaCore } from '@maestroza/core';
import { ElementName, ElementPath, MtzStore, MtzElement } from '@maestroza/kernel'; // FIXME import direct de core
import { MtzOperation } from "./execution.js";

abstract class MtzPlatformManager {

  public abstract initialize (store?: MtzStore): void;

  public abstract get core(): MaestrozaCore;

  public abstract execute(what: MtzOperation|MtzOperation[]): Promise<void>;

  public abstract createElement(
    elementName: ElementName,
    parentPath: ElementPath,
    typePath: ElementPath,
    params: Record<string, any>): Promise<MtzElement>;

  public abstract modifyElement(element:MtzElement): Promise<void>;

  public abstract loadPlugin(name: ElementName, pluginPath: string): Promise<MtzElement>;

}

export { MtzPlatformManager };
