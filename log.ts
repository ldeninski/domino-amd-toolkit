/// <reference path="typings/com.ibm.domino.d.ts" />
"use amd";

export enum LOG_LEVEL {
	DEBUG,
	INFO,
	WARNING,
	ERROR
}

var logLevel:LOG_LEVEL = LOG_LEVEL.ERROR;

export function setLevel(level:LOG_LEVEL) {
	logLevel = level
}

export function getLevel():LOG_LEVEL {
	return logLevel
}

export function info(text) {
	if (logLevel >= 3) {
		print("INFO: " + text)
	}
}

export function warn(text) {
	if (logLevel >= 2) {
		print("WARN: " + text)
	}
}

export function err(text) {
	if (logLevel >= 1) {
		print("ERR: " + text)
	}
}

export function log(text) {
	print(text)
}

export function dump(param:any):void {
	if(param === undefined){
		log("param: undefined")
		return;
	}
	for(var k in param) {
		if(param.hasOwnProperty(k)) log("param[" + k + "]: " + param[k])
	}
}