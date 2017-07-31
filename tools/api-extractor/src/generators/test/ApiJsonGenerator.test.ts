// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

/// <reference types="mocha" />

import * as ts from 'typescript';
import * as path from 'path';
import Extractor from '../../Extractor';
import ApiJsonGenerator from '../../generators/ApiJsonGenerator';
import TestFileComparer from '../../TestFileComparer';
/* tslint:disable:no-function-expression - Mocha uses a poorly scoped "this" pointer */

const capturedErrors: {
  message: string;
  fileName: string;
  lineNumber: number;
}[] = [];

function testErrorHandler(message: string, fileName: string, lineNumber: number): void {
  capturedErrors.push({ message, fileName, lineNumber });
}

describe('ApiJsonGenerator tests', function (): void {
  this.timeout(10000);

  describe('Basic Tests', function (): void {
    it('Example 1', function (): void {
      const inputFolder: string = './testInputs/example1';
      const outputFile: string = './lib/example1-output.json';
      const expectedFile: string = path.join(inputFolder, 'example1-output.json');

      const compilerOptions: ts.CompilerOptions = {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        rootDir: inputFolder,
        typeRoots: ['./'] // We need to ignore @types in these tests
      };
      const extractor: Extractor = new Extractor({
        compilerOptions: compilerOptions,
        errorHandler: testErrorHandler
      });

      extractor.loadExternalPackages('./testInputs/external-api-json');
      extractor.analyze({
        entryPointFile: path.join(inputFolder, 'index.ts')
      });

      const apiJsonGenerator: ApiJsonGenerator = new ApiJsonGenerator();
      apiJsonGenerator.writeJsonFile(outputFile, extractor);

      TestFileComparer.assertFileMatchesExpected(outputFile, expectedFile);
    });

    it('Example 2', function (): void {
      const inputFolder: string = './testInputs/example2';
      const outputFile: string = './lib/example2-output.json';
      const expectedFile: string = path.join(inputFolder, 'example2-output.json');

      const compilerOptions: ts.CompilerOptions = {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        rootDir: inputFolder,
        typeRoots: ['./'] // We need to ignore @types in these tests
      };
      const extractor: Extractor = new Extractor({
        compilerOptions: compilerOptions,
        errorHandler: testErrorHandler
      });

      extractor.loadExternalPackages('./testInputs/external-api-json');
      extractor.analyze({
        entryPointFile: path.join(inputFolder, 'src/index.ts')
      });

      const apiJsonGenerator: ApiJsonGenerator = new ApiJsonGenerator();
      apiJsonGenerator.writeJsonFile(outputFile, extractor);

      TestFileComparer.assertFileMatchesExpected(outputFile, expectedFile);
    });

    it('Example 4', function (): void {
      const inputFolder: string = './testInputs/example4';
      const outputFile: string = './lib/example4-output.json';
      const expectedFile: string = path.join(inputFolder, 'example4-output.json');

      const compilerOptions: ts.CompilerOptions = {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        rootDir: inputFolder,
        typeRoots: ['./'] // We need to ignore @types in these tests
      };
      const extractor: Extractor = new Extractor({
        compilerOptions: compilerOptions,
        errorHandler: testErrorHandler
      });

      extractor.loadExternalPackages('./testInputs/external-api-json');
      extractor.analyze({
        entryPointFile: path.join(inputFolder, 'src/index.ts')
      });

      const apiJsonGenerator: ApiJsonGenerator = new ApiJsonGenerator();
      apiJsonGenerator.writeJsonFile(outputFile, extractor);

      TestFileComparer.assertFileMatchesExpected(outputFile, expectedFile);
    });
  });
});
