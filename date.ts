/// <reference path="typings/com.ibm.domino.d.ts" />
"use amd";

import * as util from "util";

export function add(date: Date): Date {
	throw "Not implemented";
}

export function format(date: Date, format: string): string {
	var [d,m,y] = [date.getDate(), date.getMonth()+1, date.getFullYear()];
	return util.map(format.split(""), function (el) {
		switch (el) {
			case "d":
				return d + "";
			case "D":
				return util.padleft(d, 2, "0");
			case "m":
				return m + "";
			case "M":
				return util.padleft(m, 2, "0");
			case "y":
				return y + "";
			case "Y":
				return util.padleft(y, 4, "0");
			default:
				return el + "";
		}
	}).join("")
}