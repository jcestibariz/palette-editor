import {h} from 'preact';
import PropTypes from 'prop-types';

const getStyle = color => ({left: 25 + 2 * color.lch()[1], backgroundColor: color.hex()});

const CPlane = ({palette}) => (
	<div className="CPlane">
		<div className="CPlane__label">c*</div>
		{palette.map(c => <div className="CPlane__dot" style={getStyle(c)}/>)}
	</div>
);

CPlane.propTypes = {
	palette: PropTypes.array,
};

export default CPlane;
