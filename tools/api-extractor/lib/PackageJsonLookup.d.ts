/**
 * This class provides methods for finding the nearest "package.json" for a folder
 * and retrieving the name of the package.  The results are cached.
 */
export default class PackageJsonLookup {
    private _packageFolderCache;
    private _packageNameCache;
    constructor();
    /**
     * Finds the path to the package folder of a given currentPath, by probing
     * upwards from the currentPath until a package.json file is found.
     * If no package.json can be found, undefined is returned.
     *
     * @param currentPath - a path (relative or absolute) of the current location
     * @returns a relative path to the package folder
     */
    tryFindPackagePathUpwards(sourceFilePath: string): string | undefined;
    /**
     * Loads the package.json file and returns the name of the package.
     *
     * @param packageJsonPath - an absolute path to the folder containing the
     * package.json file, it does not include the 'package.json' suffix.
     * @returns the name of the package (E.g. @microsoft/api-extractor)
     */
    readPackageName(packageJsonPath: string): string;
}
