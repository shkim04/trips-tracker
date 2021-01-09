import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class HandleClickListener extends Component {
    constructor(props) {
        super(props);

        this.wrapperRef = React.createRef();
        this.handleClickListener = this.handleClickListener.bind(this);
    }
    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickListener)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickListener)
    }

    handleClickListener(event) {       
        const { onClick } = this.props;
        if (this.wrapperRef && this.wrapperRef.current.contains(event.target)) {
            return ;
        }
        onClick(event);
    }
    
    render() {
        return (
            <div ref={this.wrapperRef}>
                { this.props.children }
            </div>
        )
    }
}

HandleClickListener.propTypes = {
    children: PropTypes.element.isRequired,
    onClick: PropTypes.func,
}