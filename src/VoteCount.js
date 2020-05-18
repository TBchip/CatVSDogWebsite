import React from 'react';
import './styles.css';

export default function VoteCount({ votes }) {

	return (
		<h3 className={"voteCount"}>{votes}</h3>
	);
}
