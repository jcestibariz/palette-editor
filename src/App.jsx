import preact, {Component} from 'preact';
import chroma from 'chroma-js';

import LabDisplay from './LabDisplay';
import Display from './Display';
import ColorEditor from './ColorEditor';
import Slider from './Slider';

const toChroma = c => chroma(c.trim());

class App extends Component {
	state = {
		palette: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#808080'].map(toChroma),
		bg: chroma('#ffffff'),
		current: 0,
		originalPalette: null,
		lightness: 0,
		chroma: 0,
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
				.map(toChroma);
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

	applyChange = () => this.setState({originalPalette: null, lightness: 0, chroma: 0});

	cancelChange = () =>
		this.setState({palette: this.state.originalPalette, originalPalette: null, lightness: 0, chroma: 0});

	updateLightness = v => {
		const originalPalette = this.state.originalPalette;
		this.setState({
			lightness: v,
			palette: this.state.palette.map((c, i) => {
				const lch = c.lch();
				lch[0] = originalPalette[i].lch()[0] + v;
				return chroma.lch(lch);
			}),
		});
	};

	updateChroma = v => {
		const originalPalette = this.state.originalPalette;
		this.setState({
			chroma: v,
			palette: this.state.palette.map((c, i) => {
				const lch = c.lch();
				lch[1] = Math.max(originalPalette[i].lch()[1] + v, 0);
				return chroma.lch(lch);
			}),
		});
	};

	render() {
		const {palette, bg, current, originalPalette, lightness, chroma} = this.state;
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
					<textarea value={palette.map(c => "'" + c + "'").join(',')} onChange={this.updatePalette} />
				</div>
				<div className="App__bg">
					<div>Background</div>
					<input value={bg} onChange={this.updateBG} />
				</div>

				{originalPalette ? (
					<div className="App__editPalette">
						<div className="App__slider">
							<div>Lightness</div>
							<Slider value={lightness} min={-50} max={50} onValueChange={this.updateLightness} />
						</div>
						<div className="App__slider">
							<div>Chroma</div>
							<Slider value={chroma} min={-50} max={50} onValueChange={this.updateChroma} />
						</div>
						<div>
							<button onClick={this.applyChange}>Apply</button>
							<button onClick={this.cancelChange}>Cancel</button>
						</div>
					</div>
				) : (
					<div className="App__editPalette">
						<button onClick={this.startChange}>Update Palette</button>
					</div>
				)}
			</div>
		);
	}
}

export default App;
