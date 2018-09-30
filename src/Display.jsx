import preact from 'preact';
import PropTypes from 'prop-types';
import chroma, {contrast, deltaE} from 'chroma-js';

const getColor = bg => (bg.luminance() < 0.5 ? '#ffffff' : '#000000');

const Display = ({palette, bg}) => (
	<div className="Display" style={{color: getColor(bg), backgroundColor: bg.hex()}}>
		{palette.map(c => chroma.lch(c)).map(c => (
			<div className="Display__color">
				<div className="Display__bar" style={{backgroundColor: c.hex()}} />
				<div className="Display__contrast">{contrast(c, bg)}</div>
				<div className="Display__deltaE">{deltaE(c, bg)}</div>
			</div>
		))}
	</div>
);

Display.propTypes = {
	palette: PropTypes.array,
	bg: PropTypes.string,
};

export default Display;
