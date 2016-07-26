/// <reference path="typings/com.ibm.domino.d.ts" />
/// <reference path="typings/apache-commons-codec.d.ts" />
/// "use amd"

import * as log from "log";
import * as std from "std";

//var _cache: { [key: string]: Summary} = {};

export enum CounterType {
	SUM,
	UNIQUE
}

interface IUniqueEntry {
	key: string;
	label: string;
}

class SummaryCounter extends std._Object {
	private
	uniques: { [key: string]: IUniqueEntry} = {};
	value: number = 0;

	constructor(public key:string, public label: string = key, public type: CounterType = CounterType.SUM) {
		super();
	}

	go(keyOrValue: any, uniueLabel = keyOrValue) {
		if(this.type == CounterType.UNIQUE) {
			if(!this.uniques.hasOwnProperty(keyOrValue)) {
				return (this.uniques[keyOrValue] = {key: keyOrValue, label: uniueLabel})
			} else {
				return this.uniques[keyOrValue]
			}
		} else if (this.type == CounterType.SUM) {
			return (this.value += keyOrValue)
		}
	}

	getValue(): number {
		return this.value;
	}

	getUniquesArray(sort?: boolean): string[] {
		var tArr = [];
		for(var key in this.uniques) {
			tArr.push(this.uniques[key]);
		}

		if(sort) {
			let tArr2 = tArr.sort(function(x, y) {
				return x.label.compareToIgnoreCase(y.label)
			})

			tArr = [];
			for(var i = 0; i < tArr2.length; i++) {
				tArr.push(tArr2[i].key)
			}
		}
		return tArr;
	}

	getUniques():{ [key: string]: IUniqueEntry} {
		return this.uniques;
	}

	getUniquesCount(): number {
		return this.getUniquesArray().length;
	}
}

export class Summary extends std._Object {
	private
	uniques: { [key: string]: SummaryCounter} = {};
	sums: { [key: string]: SummaryCounter} = {};
	summaries: { [key: string]: Summary} = {};

	public
	ready: boolean = false;

	constructor(public key: string = "", public label: string = key) {
		super();
	}

	addUnique(key: string, label: string = key) {
		this.ready = true;
		if(!this.uniques.hasOwnProperty(key)) {
			this.uniques[key] = new SummaryCounter(key, label, CounterType.UNIQUE);
		}
	}

	addSum(key: string, label: string = key) {
		this.ready = true;
		if(!this.sums.hasOwnProperty(key)) {
			this.sums[key] = new SummaryCounter(key, label, CounterType.SUM)
		}
	}

	addSummary(key: string, label: string = key) {
		this.ready = true;
		if(!this.summaries.hasOwnProperty(key)) {
			return (this.summaries[key] = new Summary(this.key + "/" + key, label))
		} else {
			return this.summaries[key]
		}
	}

	getItemLabel(key:string): string {
		if(key === undefined) return "";

		var keys = key.split("/");
		var key0 = keys.shift();

		if(this.sums.hasOwnProperty(key0)) {
			return this.sums[key0].label;
		} else if(this.uniques.hasOwnProperty(key0)) {
			return this.uniques[key0].label;
		} else if(this.summaries.hasOwnProperty(key0)) {
			if(keys.length > 0)
				return this.summaries[key0].getItemLabel(keys.join("/"))
			else
				return this.summaries[key0].label;
		}
	}

	getRawItem(key:string): SummaryCounter | Summary {
		if(key === undefined) return null;

		var keys = key.split("/");
		var key0 = keys.shift();

		if(this.sums.hasOwnProperty(key0)) {
			return this.sums[key0];
		} else if(this.uniques.hasOwnProperty(key0)) {
			return this.uniques[key0];
		} else if(this.summaries.hasOwnProperty(key0)) {
			if(keys.length > 0)
				return this.summaries[key0].getRawItem(keys.join("/"))
			else
				return this.summaries[key0];
		}
	}

	getItem(key) {
		if(key === undefined) return false;

		var keys = key.split("/");
		var key0 = keys.shift();

		if(this.sums.hasOwnProperty(key0)) {
			return this.sums[key0].getValue();
		} else if(this.uniques.hasOwnProperty(key0)) {
			return this.uniques[key0].getUniquesCount();
		} else if(this.summaries.hasOwnProperty(key0)) {
			if(keys.length > 0)
				return this.summaries[key0].getItem(keys.join("/"))
			else
				return this.summaries[key0];
		}
	}

	go(key: string, value: any, uniqueLabel = value) {
		if(key === undefined) return false;
		if(value === undefined) return false;

		var keys = key.split("/");
		var key0 = keys.shift();

		if(this.sums.hasOwnProperty(key0)) {
			this.sums[key0].go(value);
		} else if(this.uniques.hasOwnProperty(key0)) {
			this.uniques[key0].go(value, uniqueLabel);
		} else if(this.summaries.hasOwnProperty(key0)) {
			this.summaries[key0].go(keys.join("/"), value, uniqueLabel)
		}
	}
}
