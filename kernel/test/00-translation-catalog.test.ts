/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";

import { GbzTranslationCatalog, mergeTranslationCatalog, globalTranslationCatalog } from '../src/translation.js';

describe("Translation catalog", () => {


  it("should merge a first catalog", () => {

    const catalog: GbzTranslationCatalog = {
      en: {
        lang: 'English',
        hello: 'Hello'
      },
      fr: {
        lang: 'Français',
        hello: 'Bonjour'
      }
    };
    mergeTranslationCatalog(catalog);

    expect(globalTranslationCatalog).not.to.equal(undefined);
    expect(globalTranslationCatalog).to.be.instanceOf(Object);

    expect(globalTranslationCatalog).to.have.property('en');
    expect(globalTranslationCatalog.en).to.be.instanceOf(Object);
    expect(globalTranslationCatalog.en).to.have.property('lang', 'English');
    expect(globalTranslationCatalog.en).to.have.property('hello', 'Hello');

    expect(globalTranslationCatalog).to.have.property('fr');
    expect(globalTranslationCatalog.fr).to.be.instanceOf(Object);
    expect(globalTranslationCatalog.fr).to.have.property('lang', 'Français');
    expect(globalTranslationCatalog.fr).to.have.property('hello', 'Bonjour');

  });

  it("should merge a second catalog", () => {

    const catalog: GbzTranslationCatalog = {
      en: {
        bye: 'Good bye',
      },
      fr: {
        bye: 'Au revoir',
      }
    };
    mergeTranslationCatalog(catalog);

    expect(globalTranslationCatalog).not.to.equal(undefined);
    expect(globalTranslationCatalog).to.be.instanceOf(Object);

    expect(globalTranslationCatalog).to.have.property('en');
    expect(globalTranslationCatalog.en).to.be.instanceOf(Object);
    expect(globalTranslationCatalog.en).to.have.property('lang', 'English');
    expect(globalTranslationCatalog.en).to.have.property('hello', 'Hello');
    expect(globalTranslationCatalog.en).to.have.property('bye', 'Good bye');

    expect(globalTranslationCatalog).to.have.property('fr');
    expect(globalTranslationCatalog.fr).to.be.instanceOf(Object);
    expect(globalTranslationCatalog.fr).to.have.property('lang', 'Français');
    expect(globalTranslationCatalog.fr).to.have.property('hello', 'Bonjour');
    expect(globalTranslationCatalog.fr).to.have.property('bye', 'Au revoir');

  });

  it("should merge a third catalog with translation replacement", () => {

    const catalog: GbzTranslationCatalog = {
      en: {
        hello: 'Hello you',
      },
      fr: {
        hello: 'Bonjour vous',
      }
    };
    mergeTranslationCatalog(catalog);

    expect(globalTranslationCatalog).not.to.equal(undefined);
    expect(globalTranslationCatalog).to.be.instanceOf(Object);

    expect(globalTranslationCatalog).to.have.property('en');
    expect(globalTranslationCatalog.en).to.be.instanceOf(Object);
    expect(globalTranslationCatalog.en).to.have.property('lang', 'English');
    expect(globalTranslationCatalog.en).to.have.property('hello', 'Hello you');
    expect(globalTranslationCatalog.en).to.have.property('bye', 'Good bye');

    expect(globalTranslationCatalog).to.have.property('fr');
    expect(globalTranslationCatalog.fr).to.be.instanceOf(Object);
    expect(globalTranslationCatalog.fr).to.have.property('lang', 'Français');
    expect(globalTranslationCatalog.fr).to.have.property('hello', 'Bonjour vous');
    expect(globalTranslationCatalog.fr).to.have.property('bye', 'Au revoir');

  });

  it("should merge a new lang", () => {

    const catalog: GbzTranslationCatalog = {
      de: {
        lang: 'Deutsch',
        hello: 'Guten tag',
      },
    };
    mergeTranslationCatalog(catalog);

    console.log("dOm globalTranslationCatalog", globalTranslationCatalog);
    expect(globalTranslationCatalog).not.to.equal(undefined);
    expect(globalTranslationCatalog).to.be.instanceOf(Object);

    expect(globalTranslationCatalog).to.have.property('en');
    expect(globalTranslationCatalog.en).to.be.instanceOf(Object);
    expect(globalTranslationCatalog.en).to.have.property('lang', 'English');
    expect(globalTranslationCatalog.en).to.have.property('hello', 'Hello you');
    expect(globalTranslationCatalog.en).to.have.property('bye', 'Good bye');

    expect(globalTranslationCatalog).to.have.property('fr');
    expect(globalTranslationCatalog.fr).to.be.instanceOf(Object);
    expect(globalTranslationCatalog.fr).to.have.property('lang', 'Français');
    expect(globalTranslationCatalog.fr).to.have.property('hello', 'Bonjour vous');
    expect(globalTranslationCatalog.fr).to.have.property('bye', 'Au revoir');

    expect(globalTranslationCatalog).to.have.property('de');
    expect(globalTranslationCatalog.de).to.be.instanceOf(Object);
    expect(globalTranslationCatalog.de).to.have.property('lang', 'Deutsch');
    expect(globalTranslationCatalog.de).to.have.property('hello', 'Guten tag');
  });



});
