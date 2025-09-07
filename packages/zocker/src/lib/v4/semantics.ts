export type SemanticFlagStr =
	| "unspecified"
	| "key"
	| "fullname"
	| "firstname"
	| "lastname"
	| "street"
	| "city"
	| "country"
	| "paragraph"
	| "sentence"
	| "word"
	| "phoneNumber"
	| "age"
	| "zip"
	| "jobtitle"
	| "color"
	| "color-hex"
	| "age"
	| "year"
	| "month"
	| "day-of-the-month"
	| "hour"
	| "minute"
	| "second"
	| "millisecond"
	| "weekday"
	| "birthday"
	| "gender"
	| "municipality"
	| "unique-id";

export type SemanticFlag = SemanticFlagStr | (() => any);

export type SemanitcFlagMap = {
	[key: string | symbol]: SemanticFlag | SemanitcFlagMap;
};

const default_semantic_flag_map: SemanitcFlagMap = {
	name: {
		first: "firstname",
		last: "lastname",
		"": "fullname" // else
	},
	street: "street",
	city: "city",
	country: "country",
	// paragraph
	about: "paragraph",
	description: "paragraph",
	paragraph: "paragraph",
	text: "paragraph",
	body: "paragraph",
	content: "paragraph",
	// sentence
	sentence: "sentence",
	line: "sentence",
	headline: "sentence",
	heading: "sentence",
	word: "word",
	// jobtitle
	job: "jobtitle",
	title: "jobtitle",
	position: "jobtitle",
	role: "jobtitle",
	occupation: "jobtitle",
	profession: "jobtitle",
	career: "jobtitle",
	phone: "phoneNumber",
	age: "age",
	hex: "color-hex",
	color: "color",
	zip: "zip",
	week: {
		day: "weekday"
	},
	birthday: "birthday",
	year: "year",
	month: "month",
	day: "day-of-the-month",
	hour: "hour",
	minute: "minute",
	second: "second",
	millisecond: "millisecond",
	// gender
	gender: "gender",
	sex: "gender",
	// municipality
	municipality: "municipality",
	// city: "municipality",
	town: "municipality",
	place: "municipality",
	region: "municipality",
	state: "municipality",
	id: "unique-id"
};

function select_semantic_flag(
	str: string,
	semantic_flag_map: SemanitcFlagMap
): SemanticFlag | undefined {
	for (const key in Object.keys(semantic_flag_map)) {
		if (!str.includes(key)) continue;
		const val = semantic_flag_map[key]!;
		const res = typeof val === "object" ? select_semantic_flag(str, val) : val;
		if (res === undefined) continue;
		return res;
	}
}

export function get_semantic_flag(
	str: string,
	semantic_flag_map?: SemanitcFlagMap
): SemanticFlag {
	str = str.toLowerCase().trim();
	return (
		(semantic_flag_map && select_semantic_flag(str, semantic_flag_map)) ||
		select_semantic_flag(str, default_semantic_flag_map) ||
		"unspecified"
	);
}
