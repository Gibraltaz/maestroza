/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";

import { MtzErrorCode, MtzTranslatableError, MtzErrorEnum } from '../src/TranslatableError.js';

describe("Error type", () => {

  it("Should have a internal error when error type is not specified", () => {
    const err = new MtzTranslatableError('customError1' as MtzErrorCode, {});
    expect(err.errorType).to.equal(MtzErrorEnum.INTERNAL_ERROR);
  });

  it("Should have a specific error type when error type is specified", () => {
    const err = new MtzTranslatableError('customError2' as MtzErrorCode, {}, MtzErrorEnum.NOT_FOUND);
    expect(err.errorType).to.equal(MtzErrorEnum.NOT_FOUND);
  });


});
