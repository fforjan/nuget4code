"use strict";

import * as vscode from "vscode";

export function shouldBeRejected<T>(thenable: Thenable<T>, done: MochaDone, continueWith: (reason: any) => void = () => {}): void {
	"use strict";

	thenable.then ( () => { done(new Error("thenable was expected to be rejected")); } ,
					(reason: any) => { try {
							continueWith(reason);
							done();
						} catch(e) {  done(e); }});
}

export function shouldBeResolved<T>(thenable: Thenable<T>, done: MochaDone, continueWith: (result:T) => void = () => {}): void  {
	"use strict";

	thenable.then ( (value: T ) => {
						try {
							continueWith(value);
							done();
						} catch(e) {  done(e); }
					},
					() => { done(new Error("thenable was expected to be rejected")); });
}

