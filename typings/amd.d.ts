/// <reference path="basic-types.d.ts" />

declare var module: Module;
declare function amdCompat_Module_Create(id: string, fileName: string): Module;
declare function define(deps?: Array<any>, callback?: Function): any;
declare function define(moduleId?: string, deps?: Array<any>, callback?: Function): any;
declare function require(deps?: Array<any>, callback?: Function): any;
declare function require(moduleid: string): any;
interface Module {
    requireUrl: string;
    url: string;
    library: string;
    id: string;
    deps: Array<string>;
    factory: Function;
    error: boolean;
    instance: any;
    loading: boolean;
    done: boolean;
    bundleid: string;
}
