/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";

import { interpolateMessage } from '../src/message.js';

describe("Message interpolation", () => {

  it("should accept no params", () => {
    expect(
      interpolateMessage("abc")
    ).to.equal("abc");
  });

  it("should replace a single parameter", () => {
    expect(
      interpolateMessage("Hello {{name}}", { name: "ABC" })
    ).to.equal("Hello ABC");
  });

  it("should replace a two parameters", () => {
    expect(
      interpolateMessage("Hello {{firstname}} {{lastname}}", { firstname: "ABC", lastname: "DEF" })
    ).to.equal("Hello ABC DEF");
  });

  it("should accept not used parameter", () => {
    expect(
      interpolateMessage("Hello {{lastname}}", { firstname: "ABC", lastname: "DEF" })
    ).to.equal("Hello DEF");
  });

  it("should not replace non defined parameter", () => {
    expect(
      interpolateMessage("Hello {{firstname}} {{lastname}}", {lastname: "DEF" })
    ).to.equal("Hello {{firstname}} DEF");
  });

  it("should replace multiple time used parameter", () => {
    expect(
      interpolateMessage("Hello {{lastname}} {{firstname}} {{lastname}}", { firstname: "ABC", lastname: "DEF" })
    ).to.equal("Hello DEF ABC DEF");
  });

  it("should replace an undefined value with a question mark", () => {
    expect(
      interpolateMessage("Hello {{firstname}} {{lastname}}", { firstname: undefined, lastname: "DEF" })
    ).to.equal("Hello ? DEF");
  });

  it("should replace an null value with a question mark", () => {
    expect(
      interpolateMessage("Hello {{firstname}} {{lastname}}", { firstname: null, lastname: "DEF" })
    ).to.equal("Hello ? DEF");
  });

});
