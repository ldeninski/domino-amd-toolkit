/// <reference path="../typings/com.ibm.domino.d.ts" />
// added some notes fields - id: UNID;
"use amd";

export namespace Schema {
	export class Thing {
		id: UNID
		name: string;
		description: string;
	}

	export class Intangible extends Thing {constructor() {super()};}

	export class Action extends Thing {
		constructor() {super()};
		agent: Organization | Person | Organization[] | Person[];
		participant: Organization | Person | Organization[] | Person[];
		object: Thing;
	}

	export class Event extends Thing {
		constructor() {super()};


	}

	export class Organization extends Thing {
		constructor() {super()};

	}

	export class Person extends Thing {
		constructor() {super()};

	}

	export class Offer extends Intangible {
		constructor() {super()};


	}
}
