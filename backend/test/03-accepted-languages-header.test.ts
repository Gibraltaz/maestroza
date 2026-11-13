/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { backendJsonGet, startMaestrozaBackend, stopMaestrozaBackend } from './helpers/backend.js';


describe("Maestroza backend", () => {

  beforeAll(async () => {
    await startMaestrozaBackend();
  }, 10000);

  afterAll(async () => {
    await stopMaestrozaBackend();
  });

  it("should use english translations when language is not specified", async () => {
    const res = await backendJsonGet('api/v1/lang', { lang: 'fr'});
    expect(res).not.to.equal(null);
    expect(res).to.be.instanceOf(Object);
    expect(res).to.have.property('data');
    expect(res.data).to.have.property('lang', 'Français');
  });

  it("should use french translation when fr lang is specified", async () => {
    const res = await backendJsonGet('api/v1/lang', { lang: 'fr'});
    expect(res).not.to.equal(null);
    expect(res).to.be.instanceOf(Object);
    expect(res).to.have.property('data');
    expect(res.data).to.have.property('lang', 'Français');
  });

  it("should use english translation when unsupported language is specified", async () => {
    const res = await backendJsonGet('api/v1/lang', { lang: 'zz'});
    expect(res).not.to.equal(null);
    expect(res).to.be.instanceOf(Object);
    expect(res).to.have.property('data');
    expect(res.data).to.have.property('lang', 'English');
  });


  it("should use first language translation when two supported languages are specified", async () => {
    const res = await backendJsonGet('api/v1/lang', { lang: 'fr, en'});
    expect(res).not.to.equal(null);
    expect(res).to.be.instanceOf(Object);
    expect(res).to.have.property('data');
    expect(res.data).to.have.property('lang', 'Français');
  });

  it("should use second translation when first language is not supported", async () => {
    const res = await backendJsonGet('api/v1/lang', { lang: 'zz, en'});
    expect(res).not.to.equal(null);
    expect(res).to.be.instanceOf(Object);
    expect(res).to.have.property('data');
    expect(res.data).to.have.property('lang', 'English');
  });

});
