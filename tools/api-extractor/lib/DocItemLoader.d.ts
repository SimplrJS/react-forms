import { IDocPackage } from './IDocItem';
import ApiDefinitionReference from './ApiDefinitionReference';
import ApiPackage from './definitions/ApiPackage';
import ResolvedApiItem from './ResolvedApiItem';
/**
 * Used to describe a parsed package name in the form of
 * scopedName/packageName. Ex: @microsoft/sp-core-library.
 */
export interface IParsedScopeName {
    /**
     * The scope prefix. Ex: @microsoft.
     */
    scope: string;
    /**
     * The specific package name. Ex: sp-core-library.
     */
    name: string;
}
/**
 * A loader for locating the IDocItem associated with a given project and API item, or
 * for locating an ApiItem  locally.
 * No processing on the IDocItem orApiItem  should be done in this class, this class is only
 * concerned with communicating state.
 * The IDocItem can then be used to enforce correct API usage, like enforcing internal.
 * To use DocItemLoader: provide a projectFolder to construct a instance of the DocItemLoader,
 * then use DocItemLoader.getItem to retrieve the IDocItem of a particular API item.
 */
export default class DocItemLoader {
    private _cache;
    private _projectFolder;
    /**
     * The projectFolder is the top-level folder containing package.json for a project
     * that we are compiling.
     */
    constructor(projectFolder: string);
    /**
     * {@inheritdoc IReferenceResolver.resolve}
     */
    resolve(apiDefinitionRef: ApiDefinitionReference, apiPackage: ApiPackage, warnings: string[]): ResolvedApiItem;
    /**
     * Resolution of API definition references in the scenario that the reference given indicates
     * that we should search within the current ApiPackage to resolve.
     * No processing on the ApiItem should be done here, this class is only concerned
     * with communicating state.
     */
    resolveLocalReferences(apiDefinitionRef: ApiDefinitionReference, apiPackage: ApiPackage, warnings: string[]): ResolvedApiItem;
    /**
     * Resolution of API definition references in the scenario that the reference given indicates
     * that we should search outside of this ApiPackage and instead search within the JSON API file
     * that is associated with the apiDefinitionRef.
     */
    resolveJsonReferences(apiDefinitionRef: ApiDefinitionReference, warnings: string[]): ResolvedApiItem;
    /**
     * Attempts to locate and load the IDocPackage object from the project folder's
     * node modules. If the package already exists in the cache, nothing is done.
     *
     * @param apiDefinitionRef - interface with propropties pertaining to the API definition reference
     */
    getPackage(apiDefinitionRef: ApiDefinitionReference): IDocPackage;
    /**
     * Loads the API documentation json file and validates that it conforms to our schema. If it does,
     * then the json file is saved in the cache and returned.
     */
    loadPackageIntoCache(apiJsonFilePath: string, cachePackageName: string): IDocPackage;
}
