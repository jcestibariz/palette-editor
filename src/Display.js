import preact from 'preact';
import PropTypes from 'prop-types';
import chroma, {contrast} from 'chroma-js';

import formatNumber from './formatNumber';

const getColor = bg => (bg.luminance() < 0.5 ? '#ffffff' : '#000000');

const renderContrast = c => formatNumber(c) + ' ' + (c >= 7 ? 'AAA' : c >= 4.5 ? 'AA' : c >= 3 ? 'G' : 'F');

const Display = ({palette, bg, current, onSelect}) => (
	<div className="Display" style={{color: getColor(bg), backgroundColor: bg.hex()}}>
		{palette
			.map(c => chroma.lch(c))
			.map((c, i) => (
				<div className="Display__color">
					<div
						className={'Display__bar' + (i === current ? ' Display--current' : '')}
						style={{backgroundColor: c.hex()}}
						onClick={() => onSelect(i)}
					/>
					<div className="Display__contrast">{renderContrast(contrast(c, bg))}</div>
				</div>
			))}
	</div>
);

Display.propTypes = {
	palette: PropTypes.array,
	bg: PropTypes.string,
	current: PropTypes.number,
	onSelect: PropTypes.func,
};

export default Display;
