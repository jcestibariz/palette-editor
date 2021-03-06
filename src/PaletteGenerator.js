import {Component} from 'preact';
import PropTypes from 'prop-types';
import {hex2rgb, isClipped, lch2luv, luv2lch, luv2xyz, rgb2hex, rgb2xyz, xyz2luv, xyz2rgb} from './conversions';
import intlFormatter from './intlFormatter';

const fmt = intlFormatter(new Intl.NumberFormat(undefined, {maximumFractionDigits: 3}));

const rgb2lch = (rgb) => luv2lch(xyz2luv(rgb2xyz(rgb)));
const lch2rgb = (lch) => xyz2rgb(luv2xyz(lch2luv(lch)));
const lch2hex = (lch) => rgb2hex(lch2rgb(lch));

const generatePalette = (lch, factor, increment, count) => {
	const palette = [];
	palette.push(lch);
	for (let i = 1; i < count; ++i) {
		lch = [lch[0] / factor, lch[1] - increment, lch[2]];
		palette.push(lch);
	}
	return palette;
};

export default class PaletteGenerator extends Component {
	propTypes = {
		color: PropTypes.array,
		onSave: PropTypes.func,
		onCancel: PropTypes.func,
	};

	state = {
		lch: this.props.color,
		factor: 1.25,
		increment: 10,
		count: 5,
	};

	setHex = (event) => {
		const target = event.target;
		const rgb = hex2rgb(target.value);
		if (rgb) {
			this.setState({lch: rgb2lch(rgb)});
		} else {
			target.setCustomValidity('Invalid color');
		}
	};

	setL = (event) => this.setValue(0, +event.target.value);
	setC = (event) => this.setValue(1, +event.target.value);
	setH = (event) => this.setValue(2, +event.target.value);

	setFactor = (event) => this.setState({factor: +event.target.value});
	setIncrement = (event) => this.setState({increment: +event.target.value});
	setCount = (event) => this.setState({count: +event.target.value});

	handleSave = (event) => {
		const {onSave} = this.props;
		event.preventDefault();
		onSave(this.palette);
	};

	setValue(index, value) {
		const lch = [...this.state.lch];
		lch[index] = value;
		this.setState({lch});
	}

	render() {
		const {onCancel} = this.props;
		const {lch, increment, factor, count} = this.state;
		const hex = lch2hex(lch);
		const error = lch[1] - increment * count < 0 ? 'The final chroma would be negative' : null;
		let warning = null;

		if (error) {
			this.palette = null;
		} else {
			const palette = generatePalette(lch, factor, increment, count);
			if (palette.map(lch2rgb).some(isClipped)) {
				warning = 'Some colors fall outside of sRGB';
			}
			this.palette = palette;
		}

		return (
			<div className="PaletteGenerator">
				<form className="PaletteGenerator__dialog" onSubmit={this.handleSave}>
					<div className="PaletteGenerator__title">Generate Palette</div>
					<div className="PaletteGenerator__body">
						<div className="PaletteGenerator__main">
							<div className="PaletteGenerator__patch" style={{backgroundColor: hex}} />
							<div className="PaletteGenerator__inputs">
								<div className="PaletteGenerator__field">
									<label htmlFor="hex">Hex</label>
									<input id="hex" type="text" value={hex} spellCheck="false" autoFocus onInput={this.setHex} />
								</div>
								<div className="PaletteGenerator__field">
									<label htmlFor="colorL">L</label>
									<input
										id="colorL"
										type="number"
										min={0}
										max={100}
										step={0.001}
										value={fmt(lch[0])}
										onInput={this.setL}
									/>
								</div>
								<div className="PaletteGenerator__field">
									<label htmlFor="colorC">C</label>
									<input id="colorC" type="number" min={0} step={0.001} value={fmt(lch[1])} onInput={this.setC} />
								</div>
								<div className="PaletteGenerator__field">
									<label htmlFor="colorH">H</label>
									<input
										id="colorH"
										type="number"
										min={0}
										max={360}
										step={0.001}
										value={fmt(lch[2])}
										onInput={this.setH}
									/>
								</div>
							</div>
							<div className="PaletteGenerator__inputs">
								<div className="PaletteGenerator__field">
									<label htmlFor="factor">L Factor</label>
									<input id="factor" type="number" min={1} step={1e-6} value={factor} onInput={this.setFactor} />
								</div>
								<div className="PaletteGenerator__field">
									<label htmlFor="increment">C Increment</label>
									<input id="increment" type="number" step={0.01} value={increment} onInput={this.setIncrement} />
								</div>
								<div className="PaletteGenerator__field">
									<label htmlFor="count">Count</label>
									<input id="count" type="number" min={1} step={1} value={count} onInput={this.setCount} />
								</div>
							</div>
						</div>
						{this.palette && (
							<div className="PaletteGenerator__sample">
								{this.palette.map(lch2hex).map((hex) => (
									<div className="PaletteGenerator__color" style={{backgroundColor: hex}} />
								))}
							</div>
						)}
						<div className="PaletteGenerator__error">{error || warning}</div>
					</div>
					<div className="PaletteGenerator__buttons">
						<button disabled={!!error}>Save</button>
						<button type="button" onClick={onCancel}>
							Cancel
						</button>
					</div>
				</form>
			</div>
		);
	}
}
