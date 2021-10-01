import PropTypes from 'prop-types';

import formatNumber from './formatNumber';
import {lch2luv, luv2xyz, rgb2hex, xyz2rgb} from './conversions';

const lch2xyz = (lch) => luv2xyz(lch2luv(lch));
const xyz2hex = (xyz) => rgb2hex(xyz2rgb(xyz));

const getColor = (l) => (l < 0.5 ? '#ffffff' : '#000000');

const contrast = (l1, l2) => (l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05));

const renderContrast = (c) => formatNumber(c) + ' ' + (c >= 7 ? 'AAA' : c >= 4.5 ? 'AA' : c >= 3 ? 'G' : 'F');

const Display = ({palette, bg, current, onSelect}) => {
	const bgXYZ = lch2xyz(bg);
	const bgL = bgXYZ[1];
	return (
		<div className="Display" style={{color: getColor(bgL), backgroundColor: xyz2hex(bgXYZ)}}>
			{palette.map(lch2xyz).map((xyz, i) => (
				<div className="Display__color">
					<div
						className={'Display__bar' + (i === current ? ' Display--current' : '')}
						style={{backgroundColor: xyz2hex(xyz)}}
						onClick={() => onSelect(i)}
					/>
					<div className="Display__contrast">{renderContrast(contrast(xyz[1], bgL))}</div>
				</div>
			))}
		</div>
	);
};

Display.propTypes = {
	palette: PropTypes.array,
	bg: PropTypes.string,
	current: PropTypes.number,
	onSelect: PropTypes.func,
};

export default Display;
