// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import ApiItem, { ApiItemKind, IApiItemOptions } from './ApiItem';
import PrettyPrinter from '../PrettyPrinter';

/**
 * This class is part of the ApiItem abstract syntax tree. It represents a TypeScript enum value.
 * The parent container will always be an ApiEnum instance.
 */
export default class ApiEnumValue extends ApiItem {
  constructor(options: IApiItemOptions) {
    super(options);
    this.kind = ApiItemKind.EnumValue;
  }

  /**
   * Returns a text string such as "MyValue = 123,"
   */
  public getDeclarationLine(): string {
    return PrettyPrinter.getDeclarationSummary(this.declaration);
  }
}
