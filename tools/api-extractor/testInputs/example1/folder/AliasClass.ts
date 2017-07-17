// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

/**
 * AEDoc for AliasClass
 * @public
 */
export class AliasClass {
  private readOnlyNumber: number;

  /**
   * AEDoc for aliasFunc()
   * @internal
   */
  public _aliasFunc(): void {
    console.log('this is an internal API');
  }

  public aliasField: number;

  public get shouldBeReadOnly(): number {
    return this.readOnlyNumber;
  }
}

class PrivateAliasClass {
  public test(): void {
  }
}
