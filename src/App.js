import preact, {Component} from 'preact';
import chroma from 'chroma-js';

import LabDisplay from './LabDisplay';
import Display from './Display';
import ColorEditor from './ColorEditor';
import PaletteGenerator from './PaletteGenerator';
import PaletteEditor from './PaletteEditor';

const toLCH = c => chroma(c.trim()).lch();

const update = (a, i, v) => {
	const a1 = [...a];
	a1[i] = v;
	return a1;
};

class App extends Component {
	state = {
		palette: ['#8dd3c7', '#f7ea7b', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b6dd71', '#fccde5'].map(toLCH),
		bg: chroma('#ffffff'),
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
		try {
			const palette = e.target.value
				.replace(/['"]/g, '')
				.split(/[,\n]/)
				.filter(v => v)
				.map(toLCH);
			this.setState({palette, current: 0});
		} catch (e) {
			alert(e);
		}
	};

	updateBG = e => {
		const bgText = e.target.value;
		try {
			const bg = chroma(bgText);
			this.setState({bg, bgText, bgError: false});
		} catch (e) {
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
			palette: palette.map((e, i) => update(e, 1, isNaN(e[2]) ? 0 : Math.max(originalPalette[i][1] + c, 0))),
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
				<LabDisplay palette={palette} current={current} onSelect={this.setCurrent} />
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
						value={palette.map(c => chroma.lch(c).hex()).join(',')}
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
