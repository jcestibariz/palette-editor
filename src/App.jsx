import {h, Component} from 'preact';
import chroma from 'chroma-js';

import LabDisplay from './LabDisplay';
import Display from './Display';

const toChroma = c => chroma(c.trim());

class App extends Component {
	state = {
		palette: ['#808080', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'].map(toChroma),
		bg: chroma('#ffffff'),
	};

	updatePalette = e => {
		try {
			const palette = e.target.value.replace(/['"]/g, '').split(',').map(toChroma);
			this.setState({palette});
		} catch (e) {
			alert(e);
		}
	};

	updateBG = e => {
		try {
			const bg = chroma(e.target.value);
			this.setState({bg})
		} catch (e) {
			alert(e);
		}
	};

	render() {
		const {palette, bg} = this.state;
		return (
			<div className="App">
				<LabDisplay palette={palette}/>
				<Display palette={palette} bg={bg}/>
				<div className="App__palette">
					<div>Palette</div>
					<textarea value={palette.map(c => '\'' + c + '\'').join(',')} onChange={this.updatePalette}/>
				</div>
				<div className="App__bg">
					<div>Background</div>
					<input value={bg} onChange={this.updateBG}/>
				</div>
			</div>
		);
	}
}

export default App;
