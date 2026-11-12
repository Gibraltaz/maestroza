/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import {
  startMaestrozaBackend, stopMaestrozaBackend, isBackendRunning,
  backendJsonGet, testConfig
} from './helpers/backend.js';

describe("Maestroza backend", () => {

  it("should detect non existent configuration file", async () => {
    await expect(
      startMaestrozaBackend('xxx')
    ).rejects.toThrow("Can not read config file «xxx»");
  }, 10000);

  it("should start with valid Configuration file", async () => {
      await startMaestrozaBackend('config-test.json');
  }, 10000);

  it("should request root API", async () => {
    const res = await backendJsonGet('', {});
    expect(res).not.to.equal(null);
    expect(res).to.be.instanceOf(Object);
    expect(res).to.have.property('name', testConfig?.general.name);
    expect(res).to.have.property('description', testConfig?.general.description);
  });

  it("should stop backend", async ({skip}) => {
    skip(isBackendRunning() === false, "Backend is not running");
    await stopMaestrozaBackend();
  });

});
