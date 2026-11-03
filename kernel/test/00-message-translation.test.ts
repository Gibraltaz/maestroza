/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";

import { translateMessage} from '../src/message.js';

const translationCatalog = {
  en: {
    'abc' : 'Aen-Ben-Cen',
    'def' : 'en P1:{{p1}} P2:{{p2}}'
  },
  fr: {
    'abc' : 'Afr-Bfr-Cfr',
    'def' : 'fr P1:{{p1}} P2:{{p2}}'
  }
}

describe("Message translation", () => {


  describe("Translation of single message", () => {

    it("should translate in english", () => {
      expect(
        translateMessage(translationCatalog, 'en', 'abc' )
      ).to.equal("Aen-Ben-Cen");
    });

    it("should translate in french", () => {
      expect(
        translateMessage(translationCatalog, 'fr', 'abc' )
      ).to.equal("Afr-Bfr-Cfr");
    });

    it("should translate unknown lang in english", () => {
      expect(
        translateMessage(translationCatalog, 'de', 'abc' )
      ).to.equal("Aen-Ben-Cen");
    });

    it("should not translate unknown message ID", () => {
      expect(
        translateMessage(translationCatalog, 'en', 'zzz' )
      ).to.equal("zzz");
    });

  });

  describe("Translation of message with parameters", () => {

    it("should translate in english", () => {
      expect(
        translateMessage(translationCatalog, 'en', 'def', { p1:'A', p2:'B' } )
      ).to.equal("en P1:A P2:B");
    });

    it("should translate in french", () => {
      expect(
        translateMessage(translationCatalog, 'fr', 'def', { p1:'A', p2:'B' } )
      ).to.equal("fr P1:A P2:B");
    });

    it("should translate unknown lang in english", () => {
      expect(
        translateMessage(translationCatalog, 'zz', 'def', { p1:'A', p2:'B' } )
      ).to.equal("en P1:A P2:B");
    });

    it("should accept all missing arguments", () => {
      expect(
        translateMessage(translationCatalog, 'en', 'def' )
      ).to.equal("en P1:{{p1}} P2:{{p2}}");
    });

    it("should accept one missing argument", () => {
      expect(
        translateMessage(translationCatalog, 'en', 'def', { p1:'A' } )
      ).to.equal("en P1:A P2:{{p2}}");
      expect(
        translateMessage(translationCatalog, 'en', 'def', { p2:'B' } )
      ).to.equal("en P1:{{p1}} P2:B");
    });

  });

});
