import preact, {Component} from 'preact';

import LuvDisplay from './LuvDisplay';
import Display from './Display';
import ColorEditor from './ColorEditor';
import PaletteGenerator from './PaletteGenerator';
import PaletteEditor from './PaletteEditor';
import {hex2rgb, luv2lch, lch2luv, luv2xyz, rgb2hex, rgb2xyz, xyz2luv, xyz2rgb} from './conversions';

const {max} = Math;

const rbg2lch = rgb => luv2lch(xyz2luv(rgb2xyz(rgb)));
const hex2lch = hex => rbg2lch(hex2rgb(hex));
const lch2hex = lch => rgb2hex(xyz2rgb(luv2xyz(lch2luv(lch))));

const update = (a, i, v) => {
	const a1 = [...a];
	a1[i] = v;
	return a1;
};

class App extends Component {
	state = {
		palette: ['#8dd3c7', '#f7ea7b', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b6dd71', '#fccde5'].map(hex2lch),
		bg: hex2lch('#ffffff'),
		bgText: '#ffffff',
		bgError: false,
		current: 0,
		showGenerate: false,
		originalPalette: null,
	};

	setCurrent = current => this.setState({current});

	replaceColor = color => {
		const {palette, current} = this.state;
		palette[current] = color;
		this.setState({palette});
	};

	addColor = color => {
		const {palette} = this.state;
		palette.push(color);
		this.setState({palette, current: palette.length - 1});
	};

	updatePalette = e => {
		const rgbs = e.target.value.split(/[,\n]/).map(hex2rgb);
		if (rgbs.some(c => !c)) {
			alert('Invalid color found');
		} else {
			this.setState({palette: rgbs.map(rbg2lch), current: 0});
		}
	};

	updateBG = e => {
		const bgText = e.target.value;
		const rgb = hex2rgb(bgText);
		if (rgb) {
			this.setState({bg: rbg2lch(rgb), bgText, bgError: false});
		} else {
			this.setState({bgText, bgError: true});
		}
	};

	startGenerate = () => this.setState({showGenerate: true});
	cancelGenerate = () => this.setState({showGenerate: false});

	savePalette = palette => this.setState({palette, current: 0, showGenerate: false});

	startChange = () => this.setState({originalPalette: this.state.palette});

	applyChange = () => this.setState({originalPalette: null});

	cancelChange = () => this.setState({palette: this.state.originalPalette, originalPalette: null});

	updateLightness = l => {
		const {palette, originalPalette} = this.state;
		this.setState({palette: palette.map((e, i) => update(e, 0, originalPalette[i][0] + l))});
	};

	updateChroma = c => {
		const {palette, originalPalette} = this.state;
		this.setState({
			palette: palette.map((e, i) => update(e, 1, isNaN(e[2]) ? 0 : max(originalPalette[i][1] + c, 0))),
		});
	};

	updateHue = h => {
		const {palette, originalPalette} = this.state;
		this.setState({
			palette: palette.map((e, i) => update(e, 2, isNaN(e[2]) ? NaN : originalPalette[i][2] + (h % 360))),
		});
	};

	render() {
		const {palette, bg, bgText, bgError, current, showGenerate, originalPalette} = this.state;
		return (
			<div className="App">
				<LuvDisplay palette={palette} current={current} onSelect={this.setCurrent} />
				<Display palette={palette} bg={bg} current={current} onSelect={this.setCurrent} />
				<ColorEditor
					className="App__editor"
					color={palette[current]}
					onReplace={this.replaceColor}
					onAdd={this.addColor}
				/>

				<div className="App__palette">
					<label htmlFor="mainPalette">Palette</label>
					<textarea
						id="mainPalette"
						value={palette.map(lch2hex).join(',')}
						spellCheck="false"
						onChange={this.updatePalette}
					/>
				</div>
				<div className="App__bg">
					<label htmlFor="mainBG">Background</label>
					<input id="mainBG" value={bgText} spellCheck="false" aria-invalid={bgError} onInput={this.updateBG} />
				</div>

				{originalPalette ? (
					<PaletteEditor
						className="App__editPalette"
						onLightnessChange={this.updateLightness}
						onChromaChange={this.updateChroma}
						onHueChange={this.updateHue}
						onApply={this.applyChange}
						onCancel={this.cancelChange}
					/>
				) : (
					<div className="App__buttons">
						<button onClick={this.startGenerate}>Generate</button>
						<button onClick={this.startChange}>Alter Palette</button>
					</div>
				)}
				{showGenerate && (
					<PaletteGenerator color={palette[current]} onSave={this.savePalette} onCancel={this.cancelGenerate} />
				)}
			</div>
		);
	}
}

export default App;
