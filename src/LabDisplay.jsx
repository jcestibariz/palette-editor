import preact from 'preact';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';

const getABStyle = color => ({left: 160 + color.a, top: 160 - color.b, backgroundColor: color.hex});
const getLStyle = color => ({top: 260 - 2 * color.l, backgroundColor: color.hex});
const getCStyle = color => ({left: 25 + 2 * color.c, backgroundColor: color.hex});

const LabDisplay = ({palette}) => {
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
				{colors.map(c => (
					<div className="ABPlane__dot" style={getABStyle(c)} />
				))}
			</div>

			<div className="LPlane">
				<div className="LPlane__label">L*</div>
				{colors.map(c => (
					<div className="LPlane__dot" style={getLStyle(c)} />
				))}
			</div>

			<div className="CPlane">
				<div className="CPlane__label">c*</div>
				{colors.map(c => (
					<div className="CPlane__dot" style={getCStyle(c)} />
				))}
			</div>
		</div>
	);
};

LabDisplay.propTypes = {
	palette: PropTypes.array,
};

export default LabDisplay;
