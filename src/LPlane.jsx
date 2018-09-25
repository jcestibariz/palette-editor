import {h} from 'preact';
import PropTypes from 'prop-types';

const getStyle = color => ({top: 260 - 2 * color.lab()[0], backgroundColor: color.hex()});

const LPlane = ({palette}) => (
	<div className="LPlane">
		<div className="LPlane__label">L*</div>
		{palette.map(c => <div className="LPlane__dot" style={getStyle(c)}/>)}
	</div>
);

LPlane.propTypes = {
	palette: PropTypes.array,
};

export default LPlane;
