import preact from 'preact';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';

const getABStyle = color => ({left: 320 + 2 * color.a, top: 320 - 2 * color.b, backgroundColor: color.hex});
const getLStyle = color => ({top: 630 - 6.2 * color.l, backgroundColor: color.hex});
const getCStyle = color => ({left: 10 + 4.1333 * color.c, backgroundColor: color.hex});

const getDotClass = (className, index, current) => className + (index === current ? ' ' + className + '--current' : '');

const LabDisplay = ({palette, current, onSelect}) => {
	const colors = palette.map(e => {
		const [l, c, h] = e;
		const hr = isNaN(h) ? 0 : (h * Math.PI) / 180;
		const a = c * Math.cos(hr);
		const b = c * Math.sin(hr);
		const hex = chroma.lch(e).hex();
		return {l, a, b, c, hex};
	});

	return (
		<div className="LabDisplay">
			<div className="ABPlane">
				<div className="ABPlane__x" />
				<div className="ABPlane__y" />
				<div className="ABPlane__label">a*b*</div>
				{colors.map((c, i) => (
					<div className={getDotClass('ABPlane__dot', i, current)} style={getABStyle(c)} onClick={() => onSelect(i)} />
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

LabDisplay.propTypes = {
	palette: PropTypes.array,
	current: PropTypes.number,
	onSelect: PropTypes.func,
};

export default LabDisplay;