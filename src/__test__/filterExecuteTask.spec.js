import { executeTask } from "../client/js/app";

describe('Test, the function "handleSubmit()" should exist', () => {
	test("It should return true", async () => {
		expect(executeTask).toBeDefined();
	});
});
