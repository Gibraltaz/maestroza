/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";

import { mergeTranslationCatalog } from '../src/translation.js';
import { MtzErrorCode, MtzTranslatableError } from '../src/TranslatableError.js';

describe("Translation catalog", () => {

  it("Should generate a translatable error when no translation catalog is loaded", () => {
    expect( () => {
      throw new MtzTranslatableError('customError1' as MtzErrorCode, {});
    }).to.throw("customError1");
  });

  it("Should generate a parameterized translatable error when no translation catalog is loaded", () => {
    expect( () => {
      throw new MtzTranslatableError('customError2' as MtzErrorCode, {p1:'A', p2:'B'});
    }).to.throw("customError2 (p1=A, p2=B)");
  });



  it("should initialize translation", () => {
    mergeTranslationCatalog({
      en: {
        customError1: "Custom error n°1",
        customError2: "Custom error n°2 with parameters p1={{p1}} and p2={{p2}}"
      },
      fr: {
        customError1: "Erreur customisée n°1",
        customError2: "Erreur customisée n°2 avec les paramètres p1={{p1}} et p2={{p2}}"
      }
    });
  });

  it("should generate a translatable error in english by default", () => {
    expect( () => {
      throw new MtzTranslatableError('customError1' as MtzErrorCode, {});
    }).to.throw("Custom error n°1");
  });

  it("should translate a translatable error", () => {
    let error: any|undefined;
    try {
      throw new MtzTranslatableError('customError1' as MtzErrorCode, {});
    }
    catch (err: any) {
      error = err;
    }
    expect(error).not.to.equal(undefined);
    expect(error).to.be.instanceOf(MtzTranslatableError);
    const translatedMessage: MtzTranslatableError = error;
    expect(translatedMessage.translate('en')).to.equal("Custom error n°1");
    expect(translatedMessage.translate('fr')).to.equal("Erreur customisée n°1");
    expect(translatedMessage.translate('xx')).to.equal("Custom error n°1");
  });

});
