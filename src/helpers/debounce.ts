import debounce from "lodash.debounce";

export const debouncedSet = debounce((setState, val) => {
	setState(val);
}, 500);

export const debouncedSearch = debounce((val, fn) => {
	fn(val);
}, 500);
