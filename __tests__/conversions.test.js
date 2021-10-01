import {
	isClipped,
	rgb2hex,
	hex2rgb,
	xyz2rgb,
	rgb2xyz,
	xyz2lab,
	lab2xyz,
	lab2lch,
	lch2lab,
	xyz2luv,
	luv2xyz,
	luv2lch,
	lch2luv,
} from '../src/conversions';

describe('conversions', () => {
	describe('isClipped', () => {
		it('returns true when clipped', () => {
			expect(isClipped([-0.8, 0, 0])).toBe(true);
			expect(isClipped([0, 0, 255.8])).toBe(true);
		});

		it('returns false when not clipped', () => {
			expect(isClipped([-0.2, 0, 0])).toBe(false);
			expect(isClipped([0, 0, 255.2])).toBe(false);
		});
	});
	describe('rgb2hex', () => {
		it('returns expected result', () => {
			expect(rgb2hex([0, 0, 0])).toBe('#000000');
			expect(rgb2hex([255, 255, 255])).toBe('#ffffff');
			expect(rgb2hex([160, 176, 208])).toBe('#a0b0d0');
		});

		it('returns expected result when values must be clipped', () => {
			expect(rgb2hex([-5, 127.3, 280])).toBe('#007fff');
		});
	});

	describe('hex2rgb', () => {
		it('returns expected result for 6 digit colors', () => {
			expect(hex2rgb('#000000')).toEqual([0, 0, 0]);
			expect(hex2rgb('#ffffff')).toEqual([255, 255, 255]);
			expect(hex2rgb('#a0b0d0')).toEqual([160, 176, 208]);
			expect(hex2rgb('#A0B0D0')).toEqual([160, 176, 208]);
		});

		it('returns expected result for 3 digit colors', () => {
			expect(hex2rgb('#000')).toEqual([0, 0, 0]);
			expect(hex2rgb('#fff')).toEqual([255, 255, 255]);
			expect(hex2rgb('#abd')).toEqual([170, 187, 221]);
			expect(hex2rgb('#ABD')).toEqual([170, 187, 221]);
		});

		it('returns null for invalid colors', () => {
			expect(hex2rgb('#fOO')).toBeNull();
		});
	});

	describe('xyz2rgb', () => {
		it('return expected result for values above threshold', () => {
			const [r, g, b] = xyz2rgb([0.414047, 0.430772, 0.657955]);
			expect(r).toBeCloseTo(160, 2);
			expect(g).toBeCloseTo(176, 2);
			expect(b).toBeCloseTo(208, 2);
		});

		it('return expected result for values below threshold', () => {
			const [r, g, b] = xyz2rgb([0.001013, 0.001129, 0.001887]);
			expect(r).toBeCloseTo(2, 2);
			expect(g).toBeCloseTo(4, 2);
			expect(b).toBeCloseTo(6, 2);
		});

		it('return expected result for black', () => {
			const [r, g, b] = xyz2rgb([0, 0, 0]);
			expect(r).toBeCloseTo(0, 2);
			expect(g).toBeCloseTo(0, 2);
			expect(b).toBeCloseTo(0, 2);
		});

		it('return expected result for white', () => {
			const [r, g, b] = xyz2rgb([0.95047, 1.0, 1.08883]);
			expect(r).toBeCloseTo(255, 2);
			expect(g).toBeCloseTo(255, 2);
			expect(b).toBeCloseTo(255, 2);
		});
	});

	describe('rgb2xyz', () => {
		it('return expected result for values above threshold', () => {
			const [x, y, z] = rgb2xyz([160, 176, 208]);
			expect(x).toBeCloseTo(0.414047, 6);
			expect(y).toBeCloseTo(0.430772, 6);
			expect(z).toBeCloseTo(0.657955, 6);
		});

		it('return expected result for values be below threshold', () => {
			const [x, y, z] = rgb2xyz([2, 4, 6]);
			expect(x).toBeCloseTo(0.001013, 6);
			expect(y).toBeCloseTo(0.001129, 6);
			expect(z).toBeCloseTo(0.001887, 6);
		});

		it('return expected result for black', () => {
			const [x, y, z] = rgb2xyz([0, 0, 0]);
			expect(x).toBeCloseTo(0, 6);
			expect(y).toBeCloseTo(0, 6);
			expect(z).toBeCloseTo(0, 6);
		});

		it('return expected result for white', () => {
			const [x, y, z] = rgb2xyz([255, 255, 255]);
			expect(x).toBeCloseTo(0.95047, 6);
			expect(y).toBeCloseTo(1.0, 6);
			expect(z).toBeCloseTo(1.08883, 6);
		});
	});

	describe('xyz2lab', () => {
		it('returns expected result for * > epsilon', () => {
			const [l, a, b] = xyz2lab([0.116368, 0.062359, 0.028396]);
			expect(l).toBeCloseTo(30, 3);
			expect(a).toBeCloseTo(50, 3);
			expect(b).toBeCloseTo(20, 3);
		});

		it('returns expected result for * <= epsilon', () => {
			const [l, a, b] = xyz2lab([0.006877, 0.007749, 0.000048]);
			expect(l).toBeCloseTo(7, 3);
			expect(a).toBeCloseTo(-2, 3);
			expect(b).toBeCloseTo(12, 3);
		});

		it('returns expected result for black', () => {
			const [l, a, b] = xyz2lab([0, 0, 0]);
			expect(l).toBeCloseTo(0, 3);
			expect(a).toBeCloseTo(0, 3);
			expect(b).toBeCloseTo(0, 3);
		});

		it('returns expected result for white', () => {
			const [l, a, b] = xyz2lab([0.95047, 1.0, 1.08883]);
			expect(l).toBeCloseTo(100, 3);
			expect(a).toBeCloseTo(0, 3);
			expect(b).toBeCloseTo(0, 3);
		});
	});

	describe('lab2xyz', () => {
		it('returns expected result for * > epsilon', () => {
			const [x, y, z] = lab2xyz([30, 50, 20]);
			expect(x).toBeCloseTo(0.116368, 6);
			expect(y).toBeCloseTo(0.062359, 6);
			expect(z).toBeCloseTo(0.028396, 6);
		});

		it('returns expected result for l <= epsilon', () => {
			const [x, y, z] = lab2xyz([7, -2, 12]);
			expect(x).toBeCloseTo(0.006877, 6);
			expect(y).toBeCloseTo(0.007749, 6);
			expect(z).toBeCloseTo(0.000048, 6);
		});

		it('returns expected result for black', () => {
			const [x, y, z] = lab2xyz([0, 0, 0]);
			expect(x).toBeCloseTo(0, 6);
			expect(y).toBeCloseTo(0, 6);
			expect(z).toBeCloseTo(0, 6);
		});

		it('returns expected result for white', () => {
			const [x, y, z] = lab2xyz([100, 0, 0]);
			expect(x).toBeCloseTo(0.95047, 6);
			expect(y).toBeCloseTo(1.0, 6);
			expect(z).toBeCloseTo(1.08883, 6);
		});
	});

	describe('lab2lch', () => {
		it('returns expected result', () => {
			const [l, c, h] = lab2lch([71.607, -9.951, -28.148]);
			expect(l).toBeCloseTo(71.607, 3);
			expect(c).toBeCloseTo(29.855, 3);
			expect(h).toBeCloseTo(250.53, 3);
		});

		it('returns expected result for black', () => {
			const [l, c, h] = lab2lch([0, 0, 0]);
			expect(l).toBeCloseTo(0, 3);
			expect(c).toBeCloseTo(0, 3);
			expect(h).toBeCloseTo(0, 3);
		});

		it('returns expected result for white', () => {
			const [l, c, h] = lab2lch([100, 0, 0]);
			expect(l).toBeCloseTo(100, 3);
			expect(c).toBeCloseTo(0, 3);
			expect(h).toBeCloseTo(0, 3);
		});
	});

	describe('lch2lab', () => {
		it('returns expected result', () => {
			const [l, a, b] = lch2lab([71.607, 29.855, 250.531]);
			expect(l).toBeCloseTo(71.607, 3);
			expect(a).toBeCloseTo(-9.951, 3);
			expect(b).toBeCloseTo(-28.148, 3);
		});

		it('returns expected result for black', () => {
			const [l, a, b] = lch2lab([0, 0, 0]);
			expect(l).toBeCloseTo(0, 3);
			expect(a).toBeCloseTo(0, 3);
			expect(b).toBeCloseTo(0, 3);
		});

		it('returns expected result for white', () => {
			const [l, a, b] = lch2lab([100, 0, 0]);
			expect(l).toBeCloseTo(100, 3);
			expect(a).toBeCloseTo(0, 3);
			expect(b).toBeCloseTo(0, 3);
		});
	});

	describe('xyz2luv', () => {
		it('returns expected result for y > 8', () => {
			const [l, u, v] = xyz2luv([0.06897, 0.062359, 0.03435]);
			expect(l).toBeCloseTo(30, 3);
			expect(u).toBeCloseTo(20, 3);
			expect(v).toBeCloseTo(15, 3);
		});

		it('returns expected result for y <= 8', () => {
			const [l, u, v] = xyz2luv([0.007482, 0.007749, 0.00414]);
			expect(l).toBeCloseTo(7, 2);
			expect(u).toBeCloseTo(2, 2);
			expect(v).toBeCloseTo(4, 2);
		});

		it('returns expected result for black', () => {
			const [l, u, v] = xyz2luv([0, 0, 0]);
			expect(l).toBeCloseTo(0, 3);
			expect(u).toBeCloseTo(0, 3);
			expect(v).toBeCloseTo(0, 3);
		});

		it('returns expected result for white', () => {
			const [l, u, v] = xyz2luv([0.95047, 1.0, 1.08883]);
			expect(l).toBeCloseTo(100, 3);
			expect(u).toBeCloseTo(0, 3);
			expect(v).toBeCloseTo(0, 3);
		});
	});

	describe('luv2xyz', () => {
		it('returns expected result for l > 8', () => {
			const [x, y, z] = luv2xyz([30, 20, 15]);
			expect(x).toBeCloseTo(0.06897, 6);
			expect(y).toBeCloseTo(0.062359, 6);
			expect(z).toBeCloseTo(0.03435, 6);
		});

		it('returns expected result for l <= 8', () => {
			const [x, y, z] = luv2xyz([7, 2, 4]);
			expect(x).toBeCloseTo(0.007482, 6);
			expect(y).toBeCloseTo(0.007749, 6);
			expect(z).toBeCloseTo(0.00414, 6);
		});

		it('returns expected result for black', () => {
			const [x, y, z] = luv2xyz([0, 0, 0]);
			expect(x).toBeCloseTo(0, 6);
			expect(y).toBeCloseTo(0, 6);
			expect(z).toBeCloseTo(0, 6);
		});

		it('returns expected result for white', () => {
			const [x, y, z] = luv2xyz([100, 0, 0]);
			expect(x).toBeCloseTo(0.95047, 6);
			expect(y).toBeCloseTo(1.0, 6);
			expect(z).toBeCloseTo(1.08883, 6);
		});
	});

	describe('luv2lch', () => {
		it('returns expected result', () => {
			const [l, c, h] = luv2lch([71.607, -9.951, -28.148]);
			expect(l).toBeCloseTo(71.607, 3);
			expect(c).toBeCloseTo(29.855, 3);
			expect(h).toBeCloseTo(250.53, 3);
		});

		it('returns expected result for black', () => {
			const [l, c, h] = luv2lch([0, 0, 0]);
			expect(l).toBeCloseTo(0, 3);
			expect(c).toBeCloseTo(0, 3);
			expect(h).toBeCloseTo(0, 3);
		});

		it('returns expected result for white', () => {
			const [l, c, h] = luv2lch([100, 0, 0]);
			expect(l).toBeCloseTo(100, 3);
			expect(c).toBeCloseTo(0, 3);
			expect(h).toBeCloseTo(0, 3);
		});
	});

	describe('lch2luv', () => {
		it('returns expected result', () => {
			const [l, u, v] = lch2luv([71.607, 29.855, 250.531]);
			expect(l).toBeCloseTo(71.607, 3);
			expect(u).toBeCloseTo(-9.951, 3);
			expect(v).toBeCloseTo(-28.148, 3);
		});

		it('returns expected result for black', () => {
			const [l, u, v] = lch2luv([0, 0, 0]);
			expect(l).toBeCloseTo(0, 3);
			expect(u).toBeCloseTo(0, 3);
			expect(v).toBeCloseTo(0, 3);
		});

		it('returns expected result for white', () => {
			const [l, u, v] = lch2luv([100, 0, 0]);
			expect(l).toBeCloseTo(100, 3);
			expect(u).toBeCloseTo(0, 3);
			expect(v).toBeCloseTo(0, 3);
		});
	});
});
