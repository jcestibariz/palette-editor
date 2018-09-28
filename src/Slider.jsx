import preact, {Component} from 'preact';
import PropTypes from 'prop-types';

class Slider extends Component {
	static propTypes = {
		min: PropTypes.number,
		max: PropTypes.number,
		value: PropTypes.number,
		disabled: PropTypes.boolean,
		onValueChange: PropTypes.func,
	};

	setTrackElement = element => (this.trackElement = element);

	handleTrackClick = event => {
		if (!this.props.disabled) {
			let p = event.clientX - this.trackStart;
			this.props.onValueChange(Math.round(this.props.min + p / this.factor));
		}
	};

	handleMouseDown = event => {
		event.preventDefault();
		if (!this.props.disabled) {
			this.active = true;
			this.offset = event.pageX - this.current;
			document.addEventListener('mousemove', this.handleMouseMove);
			document.addEventListener('mouseup', this.handleMouseUp);
		}
	};

	handleMouseMove = event => {
		const p = event.pageX - this.offset;
		if (p >= 0 && p <= this.trackWidth) {
			this.current = p;
			if (!this.scheduled) {
				this.scheduled = true;
				requestAnimationFrame(() => {
					this.scheduled = false;
					this.trackElement.firstChild.style.left = this.current + 'px';
					this.props.onValueChange(Math.round(this.props.min + this.current / this.factor));
				});
			}
		}
	};

	handleMouseUp = event => {
		event.preventDefault();
		this.active = false;
		document.removeEventListener('mousemove', this.handleMouseMove);
		document.removeEventListener('mouseup', this.handleMouseUp);
	};

	componentDidMount() {
		this.updateValue();
	}

	componentDidUpdate(prevProps) {
		if (this.props.value !== prevProps.value) {
			this.updateValue();
		}
	}

	updateValue() {
		let element = this.trackElement;
		const {min, max, value} = this.props;
		let r = element.getBoundingClientRect();
		let w = r.width;
		let f = w / (max - min);
		let p = (value - min) * f;
		this.trackStart = r.left;
		this.trackWidth = w;
		this.factor = f;
		element.lastChild.style.width = p + 'px';
		if (!this.active) {
			this.current = p;
			element.firstChild.style.left = p + 'px';
		}
	}

	render() {
		const {min, max, value, disabled} = this.props;
		let className = 'Slider';
		if (disabled) {
			className += ' Slider--disabled';
		}

		return (
			<div className={className}>
				<div className="Slider__text">{value}</div>
				<div className="Slider__track" ref={this.setTrackElement} onClick={this.handleTrackClick}>
					<div className="Slider__dot" onMouseDown={this.handleMouseDown}>
						<div className="Slider__thumb" />
					</div>
					<div className="Slider__bar" />
				</div>
				<div className="Slider__bottom">
					<div className="Slider__min">{min}</div>
					<div className="Slider__max">{max}</div>
				</div>
			</div>
		);
	}
}

export default Slider;
