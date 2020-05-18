import React from 'react';
import './styles.css';

export default function Cat({ picture }) {

	return (
		<img className={"picture"} src={picture} />
	);
}
