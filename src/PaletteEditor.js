import {Component} from 'preact';
import PropTypes from 'prop-types';

import Slider from './Slider';

export default class PaletteEditor extends Component {
	static propTypes = {
		className: PropTypes.string,
		onLightnessChange: PropTypes.func,
		onChromaChange: PropTypes.func,
		onHueChange: PropTypes.func,
		onApply: PropTypes.func,
		onCancel: PropTypes.func,
	};

	state = {l: 0, c: 0, h: 0};

	setL = (l) => (this.setState({l}), this.props.onLightnessChange(l));
	setC = (c) => (this.setState({c}), this.props.onChromaChange(c));
	setH = (h) => (this.setState({h}), this.props.onHueChange(h));

	render() {
		const {className, onApply, onCancel} = this.props;
		const {l, c, h} = this.state;
		return (
			<div className={'PaletteEditor ' + className}>
				<div className="PaletteEditor__controls">
					<div className="PaletteEditor__control">
						<div className="PaletteEditor__controlLabel">L</div>
						<Slider className="PaletteEditor__slider" value={l} min={-50} max={50} onValueChange={this.setL} />
					</div>
					<div className="PaletteEditor__control">
						<div className="PaletteEditor__controlLabel">C</div>
						<Slider className="PaletteEditor__slider" value={c} min={-50} max={50} onValueChange={this.setC} />
					</div>
					<div className="PaletteEditor__control">
						<div className="PaletteEditor__controlLabel">H</div>
						<Slider className="PaletteEditor__slider" value={h} min={-180} max={180} onValueChange={this.setH} />
					</div>
				</div>
				<div className="PaletteEditor__buttons">
					<button onClick={onApply}>Apply</button>
					<button onClick={onCancel}>Cancel</button>
				</div>
			</div>
		);
	}
}
