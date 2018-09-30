import preact, {Component} from 'preact';
import chroma from 'chroma-js';

import LabDisplay from './LabDisplay';
import Display from './Display';
import ColorEditor from './ColorEditor';
import PaletteEditor from './PaletteEditor';

const toLCH = c => chroma(c.trim()).lch();

const update = (a, i, v) => {
	const a1 = [...a];
	a1[i] = v;
	return a1;
};

class App extends Component {
	state = {
		palette: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#808080'].map(toLCH),
		bg: chroma('#ffffff'),
		current: 0,
		originalPalette: null,
	};

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
				.split(',')
				.map(toLCH);
			this.setState({palette, current: 0});
		} catch (e) {
			alert(e);
		}
	};

	updateBG = e => {
		try {
			const bg = chroma(e.target.value);
			this.setState({bg});
		} catch (e) {
			alert(e);
		}
	};

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
		const {palette, bg, current, originalPalette} = this.state;
		return (
			<div className="App">
				<LabDisplay palette={palette} />
				<Display palette={palette} bg={bg} />
				<ColorEditor
					className="App__editor"
					color={palette[current]}
					onReplace={this.replaceColor}
					onAdd={this.addColor}
				/>

				<div className="App__palette">
					<div>Palette</div>
					<textarea value={palette.map(c => "'" + chroma.lch(c).hex() + "'").join(',')} onChange={this.updatePalette} />
				</div>
				<div className="App__bg">
					<div>Background</div>
					<input value={bg} onChange={this.updateBG} />
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
					<div className="App__editPalette">
						<button onClick={this.startChange}>Alter Palette</button>
					</div>
				)}
			</div>
		);
	}
}

export default App;
