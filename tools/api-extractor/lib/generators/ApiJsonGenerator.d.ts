import Extractor from '../Extractor';
import ApiStructuredType from '../definitions/ApiStructuredType';
import ApiEnum from '../definitions/ApiEnum';
import ApiEnumValue from '../definitions/ApiEnumValue';
import ApiFunction from '../definitions/ApiFunction';
import ApiItem from '../definitions/ApiItem';
import ApiItemVisitor from '../ApiItemVisitor';
import ApiPackage from '../definitions/ApiPackage';
import ApiParameter from '../definitions/ApiParameter';
import ApiProperty from '../definitions/ApiProperty';
import ApiMember from '../definitions/ApiMember';
import ApiNamespace from '../definitions/ApiNamespace';
import ApiModuleVariable from '../definitions/ApiModuleVariable';
import ApiMethod from '../definitions/ApiMethod';
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
export default class ApiJsonGenerator extends ApiItemVisitor {
    private static _methodCounter;
    private static _MEMBERS_KEY;
    private static _EXPORTS_KEY;
    protected jsonOutput: Object;
    protected visit(apiItem: ApiItem, refObject?: Object): void;
    writeJsonFile(reportFilename: string, extractor: Extractor): void;
    protected visitApiStructuredType(apiStructuredType: ApiStructuredType, refObject?: Object): void;
    protected visitApiEnum(apiEnum: ApiEnum, refObject?: Object): void;
    protected visitApiEnumValue(apiEnumValue: ApiEnumValue, refObject?: Object): void;
    protected visitApiFunction(apiFunction: ApiFunction, refObject?: Object): void;
    protected visitApiPackage(apiPackage: ApiPackage, refObject?: Object): void;
    protected visitApiNamespace(apiNamespace: ApiNamespace, refObject?: Object): void;
    protected visitApiMember(apiMember: ApiMember, refObject?: Object): void;
    protected visitApiProperty(apiProperty: ApiProperty, refObject?: Object): void;
    protected visitApiModuleVariable(apiModuleVariable: ApiModuleVariable, refObject?: Object): void;
    protected visitApiMethod(apiMethod: ApiMethod, refObject?: Object): void;
    protected visitApiParam(apiParam: ApiParameter, refObject?: Object): void;
}
