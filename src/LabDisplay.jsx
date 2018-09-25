import {h} from 'preact';
import PropTypes from 'prop-types';

import ABPlane from './ABPlane';
import LPlane from './LPlane';
import CPlane from './CPlane';

const LabDisplay = ({palette}) => (
	<div className="LabDisplay">
		<ABPlane palette={palette}/>
		<LPlane palette={palette}/>
		<CPlane palette={palette}/>
	</div>
);

LabDisplay.propTypes = {
	palette: PropTypes.array,
};

export default LabDisplay;
