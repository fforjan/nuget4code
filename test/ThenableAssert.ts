"use strict";

import * as vscode from "vscode";

export function shouldBeRejected<T>(thenable: Thenable<T>, done: MochaDone): void {
	"use strict";

	thenable.then ( () => { done(new Error("thenable was expected to be rejected")); } ,
					() => { done(); });
}

export function shouldBeResolved<T>(thenable: Thenable<T>, done: MochaDone): void {
	"use strict";

	thenable.then ( () => { done(); } ,
					() => { done(new Error("thenable was expected to be rejected")); });
}

