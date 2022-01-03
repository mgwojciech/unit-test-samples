///<reference types="jest" />

import { assert } from "chai";
import { Constants } from "../../src/model/Constants";
import { BooleanFieldValueMapper } from "../../src/utils/mappers/BooleanFieldValueMapper"
import { ComposedFieldValueMapper } from "../../src/utils/mappers/ComposedFieldValueMapper";
import { DateTimeFieldValueMapper } from "../../src/utils/mappers/DateTimeFieldValueMapper";
import { LookupFieldValueMapper } from "../../src/utils/mappers/LookupFieldValueMapper";
import { MultiUserFieldValueMapper } from "../../src/utils/mappers/UserFieldValueMapper";

describe("Mappers", () => {
    test("BooleanFieldValueMapper", () => {
        let mapper = new BooleanFieldValueMapper();
        let value = mapper.mapFieldValue({
            Test: true
        }, {
            Title: "Test",
            InternalName: "Test",
            TypeAsString: Constants.fieldTypeBoolean
        });

        assert.deepEqual(value, {
            name: "Test",
            type: Constants.fieldTypeBoolean,
            value: "Yes"
        });
    });
    test("DateTimeFieldValueMapper", () => {
        let date = new Date();
        let mapper = new DateTimeFieldValueMapper();
        let value = mapper.mapFieldValue({
            Test: date.toISOString()
        }, {
            Title: "Test",
            InternalName: "Test",
            TypeAsString: Constants.fieldTypeDateTime
        });

        assert.deepEqual(value, {
            name: "Test",
            type: Constants.fieldTypeDateTime,
            value: date.toLocaleDateString()
        });
    });
    test("LookupFieldValueMapper", () => {
        let mapper = new LookupFieldValueMapper();
        let value = mapper.mapFieldValue({
            Test: [{
                lookupId: 1,
                lookupValue: "Test Lookup"
            }]
        }, {
            Title: "Test",
            InternalName: "Test",
            TypeAsString: Constants.fieldTypeLookup
        });

        assert.deepEqual(value, {
            name: "Test",
            type: Constants.fieldTypeLookup,
            value: "1;#Test Lookup"
        });
    });
    test("MultiUserFieldValueMapper", () => {
        let mapper = new MultiUserFieldValueMapper();
        let value = mapper.mapFieldValue({
            Test: [{
                email: "test.user@test.domain.com"
            }]
        }, {
            Title: "Test",
            InternalName: "Test",
            TypeAsString: Constants.fieldTypeUser
        });

        assert.deepEqual(value, {
            name: "Test",
            type: Constants.fieldTypeUser,
            value: "[{\"key\":\"test.user@test.domain.com\"}]"
        });
    });
    test.each([
        [
            Constants.fieldTypeText,
            "TestTextValue",
            "TestTextValue"
        ],
        [
            Constants.fieldTypeUser,
            [{
                email: "test.user@test.domain.com"
            }],
            "[{\"key\":\"test.user@test.domain.com\"}]"
        ],
        [
            Constants.fieldTypeBoolean,
            false,
            "No"
        ],
        [
            Constants.fieldTypeLookup, [{
                lookupId: 1,
                lookupValue: "Test Lookup"
            }],
            "1;#Test Lookup"
        ],
        [
            Constants.fieldTypeChoiceMulti,
            ["TestChoiceValue", "TestChoiceValue2"],
            ";#TestChoiceValue;#TestChoiceValue2;#"
        ]
    ])("ComposedFieldValueMapper %j", (fieldType: any, itemValue: any, expectedValue: any) => {
        let mapper = new ComposedFieldValueMapper();
        let value = mapper.mapFieldValue({
            Test: itemValue
        }, {
            Title: "Test",
            InternalName: "Test",
            TypeAsString: fieldType
        });

        assert.deepEqual(value, {
            name: "Test",
            type: fieldType,
            value: expectedValue
        });
    })
});