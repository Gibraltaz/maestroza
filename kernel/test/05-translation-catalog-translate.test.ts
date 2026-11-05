/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect, beforeAll } from "vitest";

import { mergeTranslationCatalog, translate } from '../src/translation.js';

describe("Translation catalog", () => {

  beforeAll(() => {
    mergeTranslationCatalog({
      en: {
        hello: 'Hello',
        greetings: 'Hello {{firstname}} {{lastname}}'
      },
      fr: {
        hello: 'Bonjour',
        greetings: 'Hello {{firstname}} {{lastname}}'
      }
    });
  });

  it("Translate simple word in english", () => {
    expect(translate('en', 'hello')).to.equal('Hello');
  });

  it("Translate simple word in french", () => {
    expect(translate('fr', 'hello')).to.equal('Bonjour');
  });

  it("Translate parametrable message in english", () => {
    expect(translate('en', 'greetings', { firstname:'John', lastname:'Doe' })).to.equal('Hello John Doe');
  });

  it("Translate parametrable message in french", () => {
    expect(translate('fr', 'greetings', { firstname:'Jean', lastname:'Dupont' })).to.equal('Hello Jean Dupont');
  });

});
