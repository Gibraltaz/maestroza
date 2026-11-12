/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";

import { translateFromCatalog } from '../src/translation.js';

const translationCatalog = {
  en: {
    'abc': 'Aen-Ben-Cen',
    'def': 'en P1:{{p1}} P2:{{p2}}',
    'ghi': 'GHI:en',
    'jkf': 'JKF:en'
  },
  fr: {
    'abc': 'Afr-Bfr-Cfr',
    'def': 'fr P1:{{p1}} P2:{{p2}}',
    'ghi': 'GHI:fr'
  },
  de: {
    'abc': 'Ade-Bde-Cde',
    'def': 'de P1:{{p1}} P2:{{p2}}'
  }

}

describe("Message translation", () => {

  describe("Translation of single message", () => {

    it("should translate in english", () => {
      expect(
        translateFromCatalog(translationCatalog, 'en', 'abc' )
      ).to.equal("Aen-Ben-Cen");
    });

    it("should translate in french", () => {
      expect(
        translateFromCatalog(translationCatalog, 'fr', 'abc' )
      ).to.equal("Afr-Bfr-Cfr");
    });

    it("should translate unknown lang in english", () => {
      expect(
        translateFromCatalog(translationCatalog, 'it', 'abc' )
      ).to.equal("Aen-Ben-Cen");
    });

    it("should not translate unknown message ID", () => {
      expect(
        translateFromCatalog(translationCatalog, 'en', 'zzz' )
      ).to.equal("zzz");
    });

  });

  describe("Translation of message with parameters", () => {

    it("should translate in english", () => {
      expect(
        translateFromCatalog(translationCatalog, 'en', 'def', { p1:'A', p2:'B' } )
      ).to.equal("en P1:A P2:B");
    });

    it("should translate in french", () => {
      expect(
        translateFromCatalog(translationCatalog, 'fr', 'def', { p1:'A', p2:'B' } )
      ).to.equal("fr P1:A P2:B");
    });

    it("should translate unknown lang in english", () => {
      expect(
        translateFromCatalog(translationCatalog, 'zz', 'def', { p1:'A', p2:'B' } )
      ).to.equal("en P1:A P2:B");
    });

    it("should accept all missing arguments", () => {
      expect(
        translateFromCatalog(translationCatalog, 'en', 'def' )
      ).to.equal("en P1:{{p1}} P2:{{p2}}");
    });

    it("should accept one missing argument", () => {
      expect(
        translateFromCatalog(translationCatalog, 'en', 'def', { p1:'A' } )
      ).to.equal("en P1:A P2:{{p2}}");
      expect(
        translateFromCatalog(translationCatalog, 'en', 'def', { p2:'B' } )
      ).to.equal("en P1:{{p1}} P2:B");
    });

  });

});


describe("Message translation with multiple languages", () => {

  describe("Translation of single message", () => {

    it("should find deutsch translation when available", () => {
      expect(
        translateFromCatalog(translationCatalog, [ 'de', 'fr'] , 'abc' )
      ).to.equal("Ade-Bde-Cde");
    });

    it("should find french translation when deutsch translation is not available", () => {
      expect(
        translateFromCatalog(translationCatalog, [ 'fr', 'de'] , 'ghi' )
      ).to.equal("GHI:fr");
    });

    it("should find english translation when deutsch and french translation are not available", () => {
      expect(
        translateFromCatalog(translationCatalog, [ 'fr', 'de'] , 'jkf' )
      ).to.equal("JKF:en");
    });

  });

});

