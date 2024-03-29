import PropTypes from 'prop-types';
import {lch2luv, luv2xyz, rgb2hex, xyz2rgb} from './conversions';

const luv2hex = (luv) => rgb2hex(xyz2rgb(luv2xyz(luv)));

const getUVStyle = (color, current) => ({
	transform: `translate(${1.5 * color.a}px, ${-1.5 * color.b}px)${current ? ' scale(1.5)' : ''}`,
	backgroundColor: color.hex,
});
const getLStyle = (color) => ({transform: `translateY(${529 - 5.2 * color.l}px)`, backgroundColor: color.hex});
const getCStyle = (color) => ({transform: `translateX(${9 + 2.8889 * color.c}px)`, backgroundColor: color.hex});

const getDotClass = (className, index, current) => className + (index === current ? ' ' + className + '--current' : '');

const LuvDisplay = ({palette, current, onSelect}) => {
	const colors = palette.map((lch) => {
		const c = lch[1];
		const [l, a, b] = lch2luv(lch);
		const hex = luv2hex([l, a, b]);
		return {l, a, b, c, hex};
	});

	return (
		<div className="LuvDisplay">
			<div className="UVPlane">
				<div className="UVPlane__x" />
				<div className="UVPlane__y" />
				<div className="UVPlane__label">u*v*</div>
				{colors.map((c, i) => (
					<div className="UVPlane__dot" style={getUVStyle(c, i === current)} onClick={() => onSelect(i)} />
				))}
			</div>

			<div className="LPlane">
				<div className="LPlane__label">L*</div>
				{colors.map((c, i) => (
					<div className={getDotClass('LPlane__dot', i, current)} style={getLStyle(c)} onClick={() => onSelect(i)} />
				))}
			</div>

			<div className="CPlane">
				<div className="CPlane__label">c*</div>
				{colors.map((c, i) => (
					<div className={getDotClass('CPlane__dot', i, current)} style={getCStyle(c)} onClick={() => onSelect(i)} />
				))}
			</div>
		</div>
	);
};

LuvDisplay.propTypes = {
	palette: PropTypes.array,
	current: PropTypes.number,
	onSelect: PropTypes.func,
};

export default LuvDisplay;
