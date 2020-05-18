import React from 'react';
import './styles.css';

export default function Dog({ picture }) {

	return (
		<img className={"picture"} src={picture} />
	);
}
