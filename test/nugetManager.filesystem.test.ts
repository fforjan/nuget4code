"use strict";

// 
// note: This test is leveraging the Mocha test framework.
// please refer to their documentation on https://mochajs.org/ for help.
//

// the module 'assert' provides assertion methods from node
import * as assert from "assert"; 

import * as vscode from "vscode";

import * as mockfs from "mock-fs";

import * as fs from "fs";

import "should";

import * as ThenableAssert from "./ThenableAssert";

// you can import and use all API from the 'vscode' module
// as well as import your extension to test it
import NugetManager from "../src/nugetManager";

suite("Nuget4Code filesystem-related tests", () => {
	setup(() => {
		mockfs(
			{
				"invalid.json": "random",
				"withTestPackage.json": '{ "dependencies" : { "testPackage": "1.0.0" } }'
			});
		});

	teardown(mockfs.restore);
	
	test("removePackage is not working on invalid file", (done: MochaDone) => {
		// arrange
		var nugetManager: NugetManager = new NugetManager(false);

		var nugetManagerPrivate: any = nugetManager;
		nugetManagerPrivate.getCurrentProjectFile = () => Promise.resolve( vscode.Uri.file("invalid.json"));

		// act
		var thenable: Thenable<void>  = nugetManager.removePackage({ id: "MySql.Data.Entity", version: ""});

		// assert
		ThenableAssert.shouldBeRejected(thenable, done);
	});

	test("removePackage is not working on valid file / missing package", (done: MochaDone) => {
		// arrange
		var nugetManager: NugetManager = new NugetManager(false);

		var nugetManagerPrivate: any = nugetManager;
		nugetManagerPrivate.getCurrentProjectFile = () => Promise.resolve( vscode.Uri.file("withTestPackage.json"));

		// act
		var thenable: Thenable<void>  = nugetManager.removePackage({ id: "MySql.Data.Entity", version: ""});

		// assert
		ThenableAssert.shouldBeRejected(thenable, done);
	});

	test("removePackage is working as expected", (done: MochaDone) => {
		// arrange
		var nugetManager: NugetManager = new NugetManager(false);

		var nugetManagerPrivate: any = nugetManager;
		nugetManagerPrivate.getCurrentProjectFile = () => Promise.resolve( vscode.Uri.file("withTestPackage.json"));

		// act
		var thenable: Thenable<void>  = nugetManager.removePackage({ id: "testPackage", version: ""});

		// assert
		ThenableAssert.shouldBeResolved(thenable, done);

		// fs.readFileSync("withTestPackage.json", "utf8").should.not.containEql("testPackage");
	});

	test("removePackage after removePackage is working as expected", (done: MochaDone) => {
		// arrange
		var nugetManager: NugetManager = new NugetManager(false);

		var nugetManagerPrivate: any = nugetManager;
		nugetManagerPrivate.getCurrentProjectFile = () => Promise.resolve( vscode.Uri.file("withTestPackage.json"));

		// act
		var thenable: Thenable<void> = nugetManager
			.removePackage({ id: "testPackage", version: ""})
			.then ( () => nugetManager.removePackage({ id: "testPackage", version: ""}));

	 	// assert
		ThenableAssert.shouldBeRejected(thenable, done);
	});

});
