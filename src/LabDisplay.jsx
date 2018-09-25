import {h} from 'preact';
import PropTypes from 'prop-types';

import ABPlane from './ABPlane';
import LPlane from './LPlane';
import CPlane from './CPlane';

const LabDisplay = ({palette}) => {
	const colors = palette.map(e => {
		const [l, a, b] = e.lab();
		const c = Math.sqrt(a * a + b * b);
		const hex = e.hex();
		return {l, a, b, c, hex};
	});
	return (
		<div className="LabDisplay">
			<ABPlane palette={colors}/>
			<LPlane palette={colors}/>
			<CPlane palette={colors}/>
		</div>
	);
};

LabDisplay.propTypes = {
	palette: PropTypes.array,
};

export default LabDisplay;
