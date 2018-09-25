import {h} from 'preact';
import PropTypes from 'prop-types';

const getStyle = color => {
	const lab = color.lab();
	return {left: 160 + lab[1], top: 160 - lab[2], backgroundColor: color.hex()};
};

const ABPlane = ({palette}) => (
	<div className="ABPlane">
		<div className="ABPlane__x"/>
		<div className="ABPlane__y"/>
		<div className="ABPlane__label">a*b*</div>
		{palette.map(c => <div className="ABPlane__dot" style={getStyle(c)}/>)}
	</div>
);

ABPlane.propTypes = {
	palette: PropTypes.array,
};

export default ABPlane;
