// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { ApiItemKind, IApiItemOptions } from './ApiItem';
import ApiMember from './ApiMember';

/**
 * This class is part of the ApiItem abstract syntax tree. It represents properties of classes or interfaces
 * (It does not represent member methods)
 */
class ApiProperty extends ApiMember {
  public type: string;
  public isStatic: boolean;
  public isReadOnly: boolean;

  constructor(options: IApiItemOptions) {
    super(options);
    this.kind = ApiItemKind.Property;

    if (this.documentation.hasReadOnlyTag) {
      this.isReadOnly = true;
    }

    const declaration: any = options.declaration as any; /* tslint:disable-line:no-any */
    if (declaration.type) {
      this.type = declaration.type.getText();
    } else {
      this.hasIncompleteTypes = true;
      this.type = 'any';
    }
}

  public getDeclarationLine(): string {
    return super.getDeclarationLine({
      type: this.type,
      readonly: this.isReadOnly
    });
  }
}

export default ApiProperty;
