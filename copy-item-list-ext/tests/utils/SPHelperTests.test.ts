///<reference types="jest" />

import { assert } from "chai";
import { Constants } from "../../src/model/Constants";
import { SPHelper } from "../../src/utils/SPHelper";

describe("SPHelper", () => {
    test("should map multi choice from object", () => {
        let value = SPHelper.mapFieldValueToSPFormat({
            TypeAsString: Constants.fieldTypeChoiceMulti,
            Title: "Test",
            InternalName: "Test"
        }, [{
            text: "Test"
        }]);

        assert.deepEqual(value, ";#Test;#");
    });
    test("should map multi choice from string array", () => {
        let value = SPHelper.mapFieldValueToSPFormat({
            TypeAsString: Constants.fieldTypeChoiceMulti,
            Title: "Test",
            InternalName: "Test"
        }, ["Test"]);

        assert.deepEqual(value, ";#Test;#");
    });
})