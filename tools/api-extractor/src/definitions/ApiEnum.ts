// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as ts from 'typescript';
import { ApiItemKind } from './ApiItem';
import ApiItemContainer from './ApiItemContainer';
import { IApiItemOptions } from './ApiItem';
import ApiEnumValue from './ApiEnumValue';
import TypeScriptHelpers from '../TypeScriptHelpers';

/**
 * This class is part of the ApiItem abstract syntax tree. It represents a TypeScript enum definition.
 * The individual enum values are represented using ApiEnumValue.
 */
export default class ApiEnum extends ApiItemContainer {
  constructor(options: IApiItemOptions) {
    super(options);
    this.kind = ApiItemKind.Enum;

    for (const memberDeclaration of (options.declaration as ts.EnumDeclaration).members) {
      const memberSymbol: ts.Symbol = TypeScriptHelpers.getSymbolForDeclaration(memberDeclaration);

      const memberOptions: IApiItemOptions = {
        extractor: this.extractor,
        declaration: memberDeclaration,
        declarationSymbol: memberSymbol,
        jsdocNode: memberDeclaration
      };

      this.addMemberItem(new ApiEnumValue(memberOptions));
    }

  }
}
