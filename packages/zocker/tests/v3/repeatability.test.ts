import { describe, it, expect } from "vitest";
import { z } from "zod/v3";
import { zocker } from "../../src";

const schema = z.object({
	name: z.string(),
	age: z.number(),
	email: z.string().email(),
	isAwesome: z.boolean(),
	addresses: z.array(
		z.object({
			street: z.string(),
			city: z.string(),
			country: z.string().regex(/^[A-Z]{2}$/)
		})
	),
	id: z.string().uuid(),
	cuid: z.string().cuid(),
	cuid2: z.string().cuid2(),
	ulid: z.string().ulid(),
	date: z.string().date(),
	datetime: z.string().datetime()
});

const refDate = new Date("2025-09-01T10:00:00");

describe("repeatability", () => {
	it("should generate identcal values for the same seed", () => {
		const seed = 0;
		const first = zocker(schema).setSeed(seed).setRefDate(refDate).generate();

		for (let i = 0; i < 10; i++) {
			const second = zocker(schema)
				.setSeed(seed)
				.setRefDate(refDate)
				.generate();
			expect(second).toEqual(first);
		}
	});

	it("should generate different values for different seeds", () => {
		const first = zocker(schema).setSeed(0).setRefDate(refDate).generate();
		const second = zocker(schema).setSeed(1).setRefDate(refDate).generate();

		expect(first).not.toEqual(second);
	});

	it("should generate different values if the seed is not specified", () => {
		const first = zocker(schema).setRefDate(refDate).generate();
		const second = zocker(schema).setRefDate(refDate).generate();

		expect(first).not.toEqual(second);
	});
});
