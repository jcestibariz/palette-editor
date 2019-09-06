import preact, {Component} from 'preact';
import PropTypes from 'prop-types';

class Slider extends Component {
	static propTypes = {
		className: PropTypes.string,
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
			this.props.onValueChange(this.props.min + p / this.factor);
		}
	};

	handleMouseDown = event => {
		event.preventDefault();
		if (!this.props.disabled) {
			this.active = true;
			this.offset = event.pageX - this.current;
			this.trackElement.focus();
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
					this.props.onValueChange(this.props.min + this.current / this.factor);
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

	handleKeyDown = event => {
		const {min, max, value, onValueChange} = this.props;
		const step = (event.ctrlKey ? 10 : 1) / this.factor;
		switch (event.code) {
			case 'ArrowLeft':
				if (value !== min) {
					onValueChange(Math.max(value - step, min));
				}
				break;
			case 'ArrowRight':
				if (value !== max) {
					onValueChange(Math.min(value + step, max));
				}
				break;
			case 'Home':
				if (value !== min) {
					onValueChange(min);
				}
				break;
			case 'End':
				if (value !== max) {
					onValueChange(max);
				}
				break;
		}
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
		const {className, disabled} = this.props;

		return (
			<div
				className={'Slider' + (disabled ? ' Slider--disabled' : '') + (className ? ' ' + className : '')}
				tabIndex={0}
				ref={this.setTrackElement}
				onClick={this.handleTrackClick}
				onKeyDown={this.handleKeyDown}>
				<div className="Slider__dot" onMouseDown={this.handleMouseDown}>
					<div className="Slider__thumb" />
				</div>
				<div className="Slider__bar" />
			</div>
		);
	}
}

export default Slider;
