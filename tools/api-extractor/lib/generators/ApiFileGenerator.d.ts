import Extractor from '../Extractor';
import ApiStructuredType from '../definitions/ApiStructuredType';
import ApiEnum from '../definitions/ApiEnum';
import ApiEnumValue from '../definitions/ApiEnumValue';
import ApiFunction from '../definitions/ApiFunction';
import ApiItemVisitor from '../ApiItemVisitor';
import ApiPackage from '../definitions/ApiPackage';
import ApiParameter from '../definitions/ApiParameter';
import ApiMember from '../definitions/ApiMember';
import ApiNamespace from '../definitions/ApiNamespace';
import ApiModuleVariable from '../definitions/ApiModuleVariable';
import IndentedWriter from '../IndentedWriter';
/**
 * For a library such as "example-package", ApiFileGenerator generates the "example-package.api.ts"
 * report which is used to detect API changes.  The output is pseudocode whose syntax is similar
 * but not identical to a "*.d.ts" typings file.  The output file is designed to be committed to
 * Git with a branch policy that will trigger an API review workflow whenever the file contents
 * have changed.  For example, the API file indicates *whether* a class has been documented,
 * but it does not include the documentation text (since minor text changes should not require
 * an API review).
 *
 * @public
 */
export default class ApiFileGenerator extends ApiItemVisitor {
    protected _indentedWriter: IndentedWriter;
    /**
     * We don't want to require documentation for any properties that occur
     * anywhere within a TypeLiteral. If this value is above 0, then we are
     * visiting something within a TypeLiteral.
     */
    private _insideTypeLiteral;
    /**
     * Compares the contents of two API files that were created using ApiFileGenerator,
     * and returns true if they are equivalent.  Note that these files are not normally edited
     * by a human; the "equivalence" comparison here is intended to ignore spurious changes that
     * might be introduced by a tool, e.g. Git newline normalization or an editor that strips
     * whitespace when saving.
     */
    static areEquivalentApiFileContents(actualFileContent: string, expectedFileContent: string): boolean;
    /**
     * Generates the report and writes it to disk.
     *
     * @param reportFilename - The output filename
     * @param analyzer       - An Analyzer object representing the input project.
     */
    writeApiFile(reportFilename: string, extractor: Extractor): void;
    generateApiFileContent(extractor: Extractor): string;
    protected visitApiStructuredType(apiStructuredType: ApiStructuredType): void;
    protected visitApiEnum(apiEnum: ApiEnum): void;
    protected visitApiEnumValue(apiEnumValue: ApiEnumValue): void;
    protected visitApiPackage(apiPackage: ApiPackage): void;
    protected visitApiNamespace(apiNamespace: ApiNamespace): void;
    protected visitApiModuleVariable(apiModuleVariable: ApiModuleVariable): void;
    protected visitApiMember(apiMember: ApiMember): void;
    protected visitApiFunction(apiFunction: ApiFunction): void;
    protected visitApiParam(apiParam: ApiParameter): void;
    /**
     * Writes a synopsis of the AEDoc comments, which indicates the release tag,
     * whether the item has been documented, and any warnings that were detected
     * by the analysis.
     */
    private _writeAedocSynopsis(apiItem);
    private _writeWarnings(apiItem);
    private _writeLinesAsComments(lines);
}
