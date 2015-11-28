"use strict";

// 
// note: This test is leveraging the Mocha test framework.
// please refer to their documentation on https://mochajs.org/ for help.
//

// the module 'assert' provides assertion methods from node
import * as assert from "assert"; 

import * as vscode from "vscode";

import * as mockfs from "mock-fs";

import "should";

// you can import and use all API from the 'vscode' module
// as well as import your extension to test it
import NugetManager from "../src/nugetManager";

import * as ThenableAssert from "./ThenableAssert";

suite("Nuget4Code endpoints-related tests", () => {

	test("getQueryUri is consuming the endoint", () => {
		// arrange
		var nugetManager: NugetManager = new NugetManager(false);
		var nugetManagerPrivate: any = nugetManager;

		nugetManagerPrivate.queryEndpoint = "htts://example:4242/";

		// act
		var value:Object = nugetManagerPrivate.getQueryUri("random");

		// assert
		value.should.startWith(nugetManagerPrivate.queryEndpoint);
		value.should.containEql("random");
	});

	test("queryPackage is working without internet", (done: MochaDone) => {
		// arrange
		var nugetManager: NugetManager = new NugetManager(false);
		var nugetManagerPrivate: any = nugetManager;

		nugetManagerPrivate.queryEndpoint = "htts://example:4242/";
		nugetManagerPrivate.endPointsInitialization = Promise.reject("unit rest");
		nugetManagerPrivate.getJsonResponse = () => { throw "should not be called"; };

		// act
		var thenable = nugetManager.queryPackage("random");

		// assert
		ThenableAssert.shouldBeResolved(thenable, done,
			(packages: INugetPackageInfo[] ) =>  { packages.length.should.be.equal(0); });
	});
});
