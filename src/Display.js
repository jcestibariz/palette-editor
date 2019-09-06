import preact from 'preact';
import PropTypes from 'prop-types';
import chroma, {deltaE} from 'chroma-js';

import formatNumber from './formatNumber';

const getColor = bg => (bg.luminance() < 0.5 ? '#ffffff' : '#000000');

const Display = ({palette, bg, current, onSelect}) => (
	<div className="Display" style={{color: getColor(bg), backgroundColor: bg.hex()}}>
		{palette.map(c => chroma.lch(c)).map((c, i, p) => (
			<div className="Display__color">
				<div
					className={'Display__bar' + (i === current ? ' Display--current' : '')}
					style={{backgroundColor: c.hex()}}
					onClick={() => onSelect(i)}
				/>
				<div className="Display__deltaE">{i !== current && formatNumber(deltaE(c, p[current]))}</div>
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
