"use strict";

import * as vscode from "vscode";

export function shouldBeRejected<T>(promise: Promise<T>, done: MochaDone, continueWith: (reason: any) => void = () => {}): void {
	"use strict";

	promise.then ( () => { done(new Error("thenable was expected to be rejected")); } ,
					(reason: any) => { try {
							continueWith(reason);
							done();
						} catch (e) {  done(e); }});
}

export function shouldBeResolved<T>(promise: Promise<T>, done: MochaDone, continueWith: (result: T) => void = () => {} ): void  {
	"use strict";

	promise.then ( (value: T ) => {
						try {
							continueWith(value);
							done();
						} catch (e) {  done(e); }
					},
					() => { done(new Error("thenable was expected to be rejected")); });
}

