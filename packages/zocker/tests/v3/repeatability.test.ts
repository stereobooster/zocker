import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
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
	ulid: z.string().ulid()
});

const schemaWithDate = z.object({
	date: z.string().date(),
	datetime: z.string().datetime()
});

describe("repeatability", () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it("should generate identcal values for the same seed", () => {
		const seed = 0;
		const first = zocker(schema).setSeed(seed).generate();

		for (let i = 0; i < 10; i++) {
			const second = zocker(schema).setSeed(seed).generate();
			expect(second).toEqual(first);
		}
	});

	it("should generate different values for different seeds", () => {
		const first = zocker(schema).setSeed(0).generate();
		const second = zocker(schema).setSeed(1).generate();

		expect(first).not.toEqual(second);
	});

	it("should generate different values if the seed is not specified", () => {
		const first = zocker(schema).generate();
		const second = zocker(schema).generate();

		expect(first).not.toEqual(second);
	});

	it("should generate identcal values for the same seed and refDate", () => {
		const seed = 0;
		const refDate = new Date("2025-09-01T10:00:00");
		const first = zocker(schemaWithDate)
			.setSeed(seed)
			.setRefDate(refDate)
			.generate();

		for (let i = 0; i < 10; i++) {
			const second = zocker(schemaWithDate)
				.setSeed(seed)
				.setRefDate(refDate)
				.generate();
			expect(second).toEqual(first);
		}
	});

	it("should use current date as refDate", () => {
		const firstDate = new Date("2000-01-01T00:00:00");
		const secondDate = new Date("2025-09-01T10:00:00");
		vi.setSystemTime(firstDate);
		const first = zocker(schemaWithDate).setSeed(0).generate();

		vi.setSystemTime(secondDate);
		const second = zocker(schemaWithDate)
			.setSeed(0)
			.setRefDate(firstDate)
			.generate();

		expect(first).toEqual(second);
	});

	it("should generate different values for different refDate", () => {
		const first = zocker(schemaWithDate)
			.setSeed(0)
			.setRefDate(new Date("2000-01-01T00:00:00"))
			.generate();
		const second = zocker(schemaWithDate)
			.setSeed(0)
			.setRefDate(new Date("2025-09-01T10:00:00"))
			.generate();

		expect(first).not.toEqual(second);
	});
});
