const {atan2, cbrt, cos, hypot, pow, round, sin, PI} = Math;

// The D65 standard illuminant
const refX = 95.047;
const refY = 100.0;
const refZ = 108.883;
const refU = (4 * refX) / (refX + 15 * refY + 3 * refZ);
const refV = (9 * refY) / (refX + 15 * refY + 3 * refZ);

export const isClipped = (rgb) => rgb.map(round).some((c) => c < 0 || c > 255);

export const rgb2hex = (rgb) => {
	const [r, g, b] = rgb.map((c) => round(c < 0 ? 0 : c > 255 ? 255 : c));
	return '#' + ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');
};

export const hex2rgb = (hex) => {
	const m6 = /^\s*#?([0-9a-f]{6})\s*$/i.exec(hex);
	if (m6) {
		const n = parseInt(m6[1], 16);
		return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
	}
	const m3 = /^\s*#?([0-9a-f]{3})\s*$/i.exec(hex);
	if (m3) {
		const n = parseInt(m3[1], 16);
		return [(n >> 8) & 15, (n >> 4) & 15, n & 15].map((c) => (c << 4) + c);
	}
	return null;
};

export const xyz2rgb = ([x, y, z]) => {
	const xn = x / 100;
	const yn = y / 100;
	const zn = z / 100;

	const rl = xn * 3.2406 + yn * -1.5372 + zn * -0.4986;
	const gl = xn * -0.9689 + yn * 1.8758 + zn * 0.0415;
	const bl = xn * 0.0557 + yn * -0.204 + zn * 1.057;

	const rc = rl > 0.0031308 ? 1.055 * pow(rl, 1 / 2.4) - 0.055 : 12.92 * rl;
	const gc = gl > 0.0031308 ? 1.055 * pow(gl, 1 / 2.4) - 0.055 : 12.92 * gl;
	const bc = bl > 0.0031308 ? 1.055 * pow(bl, 1 / 2.4) - 0.055 : 12.92 * bl;

	return [rc * 255, gc * 255, bc * 255];
};

export const rgb2xyz = ([r, g, b]) => {
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;

	const rl = rn > 0.04045 ? pow((rn + 0.055) / 1.055, 2.4) : rn / 12.92;
	const gl = gn > 0.04045 ? pow((gn + 0.055) / 1.055, 2.4) : gn / 12.92;
	const bl = bn > 0.04045 ? pow((bn + 0.055) / 1.055, 2.4) : bn / 12.92;

	const x = rl * 0.4124 + gl * 0.3576 + bl * 0.1805;
	const y = rl * 0.2126 + gl * 0.7152 + bl * 0.0722;
	const z = rl * 0.0193 + gl * 0.1192 + bl * 0.9505;

	return [x * 100, y * 100, z * 100];
};

export const xyz2luv = ([x, y, z]) => {
	if (x === 0 && y === 0 && z === 0) {
		return [0, 0, 0];
	}

	const yn = y / refY;
	const l = yn > 0.008856 ? 116 * cbrt(yn) - 16 : 903.296296 * yn;
	const dp = x + 15 * y + 3 * z;
	const up = (4 * x) / dp;
	const vp = (9 * y) / dp;
	const lm = 13 * l;
	const u = lm * (up - refU);
	const v = lm * (vp - refV);
	return [l, u, v];
};

export const luv2xyz = ([l, u, v]) => {
	if (l === 0) {
		return [0, 0, 0];
	}

	const y = refY * (l > 8 ? pow((l + 16) / 116, 3) : 0.001107 * l);
	const lm = 13 * l;
	const up = u / lm + refU;
	const vp = v / lm + refV;
	const vm = 4 * vp;
	const x = (y * (9 * up)) / vm;
	const z = (y * (12 - 3 * up - 20 * vp)) / vm;
	return [x, y, z];
};

export const luv2lch = ([l, u, v]) => {
	const c = hypot(u, v);
	const h = ((atan2(v, u) * 180) / PI + 360) % 360;
	return [l, c, h];
};

export const lch2luv = ([l, c, h]) => {
	const u = c * cos((h * PI) / 180);
	const v = c * sin((h * PI) / 180);
	return [l, u, v];
};
