/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { backendJsonGet, startMaestrozaBackend, stopMaestrozaBackend } from './helpers/backend.js';


describe("Route parameters", () => {

  beforeAll(async () => {
    await startMaestrozaBackend();
  }, 10000);

  afterAll(async () => {
    await stopMaestrozaBackend();
  });

  it("sould be transfert to route via search params", async () => {
    const res = await backendJsonGet(
      'api/v1/util/echo', 
      { lang: 'fr'}, {
        message1:"test message 1",
        message2:"test message 2"
      }
    );
    expect(res).not.to.equal(null);
    expect(res).to.be.instanceOf(Object);
    expect(res).to.have.property('data');
    expect(res.data).to.have.property('received');
    expect(res.data.received).to.deep.equal({
      message1:"test message 1",
      message2:"test message 2"
    });
  });


});
