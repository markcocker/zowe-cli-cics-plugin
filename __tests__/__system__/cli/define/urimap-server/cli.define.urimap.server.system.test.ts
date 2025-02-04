/*
* This program and the accompanying materials are made available under the terms of the *
* Eclipse Public License v2.0 which accompanies this distribution, and is available at *
* https://www.eclipse.org/legal/epl-v20.html                                      *
*                                                                                 *
* SPDX-License-Identifier: EPL-2.0                                                *
*                                                                                 *
* Copyright Contributors to the Zowe Project.                                     *
*                                                                                 *
*/

import { TestEnvironment } from "../../../../__src__/environment/TestEnvironment";
import { ITestEnvironment } from "../../../../__src__/environment/doc/response/ITestEnvironment";
import { runCliScript } from "../../../../__src__/TestUtils";
import { Session } from "@zowe/imperative";

let TEST_ENVIRONMENT: ITestEnvironment;
let regionName: string;
let csdGroup: string;
let host: string;
let port: number;
let user: string;
let password: string;
let protocol: string;
let rejectUnauthorized: boolean;
let session: Session;

describe("CICS define urimap-server command", () => {

    beforeAll(async () => {
        TEST_ENVIRONMENT = await TestEnvironment.setUp({
            testName: "define_urimap_server",
            installPlugin: true,
            tempProfileTypes: ["cics"]
        });
        const cmciProperties = TEST_ENVIRONMENT.systemTestProperties.cmci;
        csdGroup = TEST_ENVIRONMENT.systemTestProperties.cmci.csdGroup;
        regionName = TEST_ENVIRONMENT.systemTestProperties.cmci.regionName;
        host = TEST_ENVIRONMENT.systemTestProperties.cmci.host;
        port = TEST_ENVIRONMENT.systemTestProperties.cmci.port;
        user = TEST_ENVIRONMENT.systemTestProperties.cmci.user;
        password = TEST_ENVIRONMENT.systemTestProperties.cmci.password;
        protocol = TEST_ENVIRONMENT.systemTestProperties.cmci.protocol;
        rejectUnauthorized = TEST_ENVIRONMENT.systemTestProperties.cmci.rejectUnauthorized;
        session = new Session({
            type: "basic",
            hostname: cmciProperties.host,
            port: cmciProperties.port,
            user: cmciProperties.user,
            password: cmciProperties.password,
            rejectUnauthorized: cmciProperties.rejectUnauthorized || false,
            protocol: cmciProperties.protocol as any || "https",
        });
    });

    afterAll(async () => {
        await TestEnvironment.cleanUp(TEST_ENVIRONMENT);
    });

    it("should be able to display the help", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_urimap_server_help.sh", TEST_ENVIRONMENT, []);
        expect(output.stderr.toString()).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toMatchSnapshot();
    });

    it("should get a syntax error if urimap name is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_urimap_server.sh", TEST_ENVIRONMENT,
            ["", "FAKEGRP", "FAKEPATH", "FAKEHOST", "FAKEPGM", "FAKERGN", "false", "TESTSVC"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("urimap");
        expect(stderr).toContain("name");
        expect(output.status).toEqual(1);
    });

    it("should get a syntax error if CSD group is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_urimap_server.sh", TEST_ENVIRONMENT,
            ["FAKESRV", "", "FAKEPATH", "FAKEHOST", "FAKEPGM", "FAKERGN", "false", "TESTSVC"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("csdGroup");
        expect(output.status).toEqual(1);
    });

    it("should get a syntax error if urimap path is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_urimap_server.sh", TEST_ENVIRONMENT,
            ["FAKESRV", "FAKEGRP", "", "FAKEHOST", "FAKEPGM", "FAKERGN", "false", "TESTSVC"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("urimap-path");
        expect(output.status).toEqual(1);
    });

    it("should get a syntax error if urimap host is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_urimap_server.sh", TEST_ENVIRONMENT,
            ["FAKESRV", "FAKEGRP", "FAKEPATH", "", "FAKEPGM", "FAKERGN", "false", "TESTSVC"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("urimap-host");
        expect(output.status).toEqual(1);
    });

    it("should get a syntax error if program name is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_urimap_server.sh", TEST_ENVIRONMENT,
            ["FAKESRV", "FAKEGRP", "FAKEPATH", "FAKEHOST", "", "FAKERGN", "false", "TESTSVC"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("program-name");
        expect(output.status).toEqual(1);
    });

    it("should get a syntax error if region name is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_urimap_server.sh", TEST_ENVIRONMENT,
            ["FAKESRV", "FAKEGRP", "FAKEPATH", "FAKEHOST", "FAKEPGM", "", "false", "TESTSVC"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("region-name");
        expect(output.status).toEqual(1);
    });

});
