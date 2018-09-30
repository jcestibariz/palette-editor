import preact, {Component} from 'preact';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';

import Slider from './Slider';

const intlFormatter = fmt => x => fmt.format(x);
const formatNumber = intlFormatter(new Intl.NumberFormat(undefined, {maximumFractionDigits: 1}));

export default class ColorEditor extends Component {
	static propTypes = {
		className: PropTypes.string,
		color: PropTypes.array,
		onReplace: PropTypes.func,
		onAdd: PropTypes.func,
	};

	state = {
		lch: this.props.color,
	};

	setL = v => this.setValue(0, v);
	setC = v => this.setValue(1, v);
	setH = v => this.setValue(2, v);

	handleReplace = () => this.props.onReplace(this.state.lch);
	handleAdd = () => this.props.onAdd(this.state.lch);

	setValue(index, value) {
		const lch = this.state.lch;
		lch[index] = value;
		this.setState({lch});
	}

	render() {
		const {className, color} = this.props;
		const lch = this.state.lch;
		const newColor = chroma.lch(lch);
		const hex = newColor.hex();
		const [l, c, h] = lch;
		const hr = (h * Math.PI) / 180;
		const lab = [l, c * Math.cos(hr), c * Math.sin(hr)];

		return (
			<div className={'ColorEditor ' + className}>
				<div className="ColorEditor__patch" style={{backgroundColor: chroma.lch(color).hex()}} />
				<div className="ColorEditor__patch" style={{backgroundColor: hex}} />
				<div className="ColorEditor__controls">
					<div className="ColorEditor__control">
						<div className="ColorEditor__controlLabel">L</div>
						<Slider className="ColorEditor__slider" min={0} max={100} value={lch[0]} onValueChange={this.setL} />
					</div>
					<div className="ColorEditor__control">
						<div className="ColorEditor__controlLabel">C</div>
						<Slider className="ColorEditor__slider" min={0} max={150} value={lch[1]} onValueChange={this.setC} />
					</div>
					<div className="ColorEditor__control">
						<div className="ColorEditor__controlLabel">H</div>
						<Slider className="ColorEditor__slider" min={0} max={360} value={lch[2]} onValueChange={this.setH} />
					</div>
				</div>
				<div className="ColorEditor__values">
					<div className="ColorEditor__valueRow">
						<div className="ColorEditor__valueLabel">LCH</div>
						<div className="ColorEditor__value">{lch.map(formatNumber).join(' ')}</div>
					</div>
					<div className="ColorEditor__valueRow">
						<div className="ColorEditor__valueLabel">LAB</div>
						<div className="ColorEditor__value">{lab.map(formatNumber).join(' ')}</div>
					</div>
					<div className="ColorEditor__valueRow">
						<div className="ColorEditor__valueLabel">Hex</div>
						<div className="ColorEditor__value">{hex}</div>
					</div>
					<div className="ColorEditor__valueRow">
						<div className="ColorEditor__valueLabel">Clipped</div>
						<div className="ColorEditor__value">{newColor.clipped() ? 'yes' : 'no'}</div>
					</div>
				</div>
				<div className="ColorEditor__buttons">
					<button onClick={this.handleReplace}>Replace</button>
					<button onClick={this.handleAdd}>Add</button>
				</div>
			</div>
		);
	}
}
