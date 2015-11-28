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

suite("Nuget4Code endpoints-related tests", () => {

	test("getQueryUri is consuming the endoint", () => {
		// arrange
		var nugetManager: any = new NugetManager(false);
		nugetManager.queryEndpoint = "htts://example:4242/";

		// act
		var value:Object = nugetManager.getQueryUri("random");

		// assert
		value.should.startWith(nugetManager.queryEndpoint);
		value.should.containEql("random");
	});

	test("queryPackage is working without internet", (done: MochaDone) => {
		// arrange
		var nugetManager: any = new NugetManager(false);
		nugetManager.queryEndpoint = "htts://example:4242/";
		nugetManager.endPointsInitialization = Promise.reject("unit rest");
		nugetManager.getJsonResponse = () => { throw "should not be called"; };

		// act
		nugetManager.queryPackage("random")
				.then ( (packages: any[]) => {
					try
					{
						packages.length.should.be.equal(0);
						done();
					} catch (e) { done(e); }
				}, (reason: any) => {
					done(new Error(reason.toString()));
				 });

		// assert
	});
});
