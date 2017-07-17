import ApiPackage from './definitions/ApiPackage';
import ApiItem from './definitions/ApiItem';
import ApiEnum from './definitions/ApiEnum';
import ApiEnumValue from './definitions/ApiEnumValue';
import ApiFunction from './definitions/ApiFunction';
import ApiStructuredType from './definitions/ApiStructuredType';
import ApiMember from './definitions/ApiMember';
import ApiMethod from './definitions/ApiMethod';
import ApiNamespace from './definitions/ApiNamespace';
import ApiParameter from './definitions/ApiParameter';
import ApiProperty from './definitions/ApiProperty';
import ApiModuleVariable from './definitions/ApiModuleVariable';
/**
  * This is a helper class that provides a standard way to walk the ApiItem
  * abstract syntax tree.
  */
declare abstract class ApiItemVisitor {
    protected visit(apiItem: ApiItem, refObject?: Object): void;
    protected abstract visitApiStructuredType(apiStructuredType: ApiStructuredType, refObject?: Object): void;
    protected abstract visitApiEnum(apiEnum: ApiEnum, refObject?: Object): void;
    protected abstract visitApiEnumValue(apiEnumValue: ApiEnumValue, refObject?: Object): void;
    protected abstract visitApiFunction(apiFunction: ApiFunction, refObject?: Object): void;
    protected abstract visitApiPackage(apiPackage: ApiPackage, refObject?: Object): void;
    protected abstract visitApiMember(apiMember: ApiMember, refObject?: Object): void;
    protected abstract visitApiNamespace(apiNamespace: ApiNamespace, refObject?: Object): void;
    protected abstract visitApiModuleVariable(apiModuleVariable: ApiModuleVariable, refObject?: Object): void;
    protected visitApiMethod(apiMethod: ApiMethod, refObject?: Object): void;
    protected visitApiProperty(apiProperty: ApiProperty, refObject?: Object): void;
    protected abstract visitApiParam(apiParam: ApiParameter, refObject?: Object): void;
}
export default ApiItemVisitor;
