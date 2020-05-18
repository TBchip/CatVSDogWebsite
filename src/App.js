import React, { Component } from 'react';
import Cat from './Cat';
import Dog from './Dog';
import './styles.css';
import VoteCount from './VoteCount';

var self;

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			catPictureURL: [],
			dogPictureURL: [],
			catVotes: 0,
			dogVotes: 0,
		};
	}

	async componentDidMount() {
		self = this;
		self.loadNewPictures();
	}

	async loadNewPictures() {
		let catURL, dogURL;

		await fetch('https://aws.random.cat/meow')
			.then(res => res.json())
			.then(json => {
				catURL = json.file;
			});

		var found = false;
		while (!found) {
			await fetch('https://random.dog/woof.json')
				.then(res => res.json())
				.then(json => {
					var imgType = json.url.substring(json.url.length - 4, json.url.length).toLowerCase();
					if (imgType === ".jpg" || imgType === ".png") {
						found = true;
						dogURL = json.url;
					}
				});
		}

		self.setState({
			catPictureURL: catURL,
			dogPictureURL: dogURL,
		});
	}

	async addVoteCat() {
		let { catVotes: catScore } = self.state;

		self.setState({
			catVotes: catScore + 1,
		});

		self.loadNewPictures();
	}
	async addVoteDog() {
		let { dogVotes: dogScore } = self.state;

		self.setState({
			dogVotes: dogScore + 1,
		});

		self.loadNewPictures();
	}


	render() {
		var { catPictureURL, dogPictureURL, catVotes, dogVotes } = this.state;

		return (
			<div className={"background"}>
				<div className={"pictures"}>
					<Cat picture={catPictureURL} />
					<Dog picture={dogPictureURL} />
				</div>
				<div className={"voteBtns"}>
					<button className={"voteBtn"} onClick={this.addVoteCat}>cat</button>
					<button className={"voteBtn"} onClick={this.addVoteDog}>dog</button>
				</div>
				<div className={"voteCounts"}>
					<VoteCount votes={catVotes} />
					<VoteCount votes={dogVotes} />
				</div>
			</div>
		);
	}

}

export default App;