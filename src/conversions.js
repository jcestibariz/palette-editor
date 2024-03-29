const {atan2, cbrt, cos, hypot, pow, round, sin, PI} = Math;

const epsilon = 216 / 24389; // appr. .008856
const kappa = 24389 / 27; // appr. 903.296

// The D65 standard illuminant
const refX = 0.95047;
const refY = 1.0;
const refZ = 1.08883;
const refU = (4 * refX) / (refX + 15 * refY + 3 * refZ);
const refV = (9 * refY) / (refX + 15 * refY + 3 * refZ);

export const isClipped = (rgb) => rgb.map(round).some((c) => c < 0 || c > 255);

export const rgb2hex = (rgb) => {
	const [r, g, b] = rgb.map((c) => (c < 0 ? 0 : c > 255 ? 255 : round(c)));
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
	const rl = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
	const gl = x * -0.969266 + y * 1.8760108 + z * 0.041556;
	const bl = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

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

	const x = rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375;
	const y = rl * 0.2126729 + gl * 0.7151522 + bl * 0.072175;
	const z = rl * 0.0193339 + gl * 0.119192 + bl * 0.9503041;

	return [x, y, z];
};

export const xyz2lab = ([x, y, z]) => {
	if (x === 0 && y === 0 && z === 0) {
		return [0, 0, 0];
	}

	const xn = x / refX;
	const yn = y / refY;
	const zn = z / refZ;
	const xf = xn > epsilon ? cbrt(xn) : (kappa * xn + 16) / 116;
	const yf = yn > epsilon ? cbrt(yn) : (kappa * yn + 16) / 116;
	const zf = zn > epsilon ? cbrt(zn) : (kappa * zn + 16) / 116;
	const l = 116 * yf - 16;
	const a = 500 * (xf - yf);
	const b = 200 * (yf - zf);
	return [l, a, b];
};

export const lab2xyz = ([l, a, b]) => {
	if (l === 0) {
		return [0, 0, 0];
	}

	const yf = (l + 16) / 116;
	const xf = a / 500 + yf;
	const zf = yf - b / 200;
	const y = refY * (l > 8 ? pow(yf, 3) : l / kappa);
	const xp = pow(xf, 3);
	const zp = pow(zf, 3);
	const x = refX * (xp > epsilon ? xp : (116 * xf - 16) / kappa);
	const z = refZ * (zp > epsilon ? zp : (116 * zf - 16) / kappa);
	return [x, y, z];
};

export const lab2lch = ([l, a, b]) => {
	const c = hypot(a, b);
	const h = ((atan2(b, a) * 180) / PI + 360) % 360;
	return [l, c, h];
};

export const lch2lab = ([l, c, h]) => {
	const a = c * cos((h * PI) / 180);
	const b = c * sin((h * PI) / 180);
	return [l, a, b];
};

export const xyz2luv = ([x, y, z]) => {
	if (x === 0 && y === 0 && z === 0) {
		return [0, 0, 0];
	}

	const yn = y / refY;
	const l = yn > epsilon ? 116 * cbrt(yn) - 16 : kappa * yn;
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

	const y = refY * (l > 8 ? pow((l + 16) / 116, 3) : l / kappa);
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
