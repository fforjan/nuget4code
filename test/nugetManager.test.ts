// 
// note: This test is leveraging the Mocha test framework.
// please refer to their documentation on https://mochajs.org/ for help.
//

// the module 'assert' provides assertion methods from node
import * as assert from "assert";

import "should";

// you can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";

import NugetManager from "../src/nugetManager";

suite("Nuget4Code Tests", () => {

	test("NugetManager", () => {
		// arrange
		var nugetManager: any = new NugetManager(false);
		nugetManager.queryEndpoint = "htts://example:4242/";

		// act
		var value:Object = nugetManager.getQueryUri("random");

		// assert
		value.should.startWith(nugetManager.queryEndpoint);
		value.should.containEql("random");

	});
});
