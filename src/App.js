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
		self.setState({
			catVotes: await this.getVotes("cat"),
			dogVotes: await this.getVotes("dog"),
		})
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

	async getVotes(name) {
		let score;
		let getURL = "http://dreamlo.com/lb/5ec2880d0cf2aa0c28423922/json"
		await fetch(getURL)
			.then(res => res.json())
			.then(json => {
				if (json.dreamlo.leaderboard == null) {
					self.setVotes(name, 0);
					score = 0;
				} else {
					let entries = json.dreamlo.leaderboard.entry;
					entries = entries.filter((value) => {
						if (value.name == name) return true
						else return false
					});
					score = Number(entries[0].score);
				}
			});

		return score;
	}
	setVotes(name, score) {
		let setURL = "http://dreamlo.com/lb/rB0P6BG4_0y6ODkGEkwiBQyiBo5yCdykaB3uR9hY74_g/add/" +
			name + "/" + score;
		fetch(setURL)
	}
	async updateVotes() {
		let catScore = await self.getVotes("cat");
		let dogScore = await self.getVotes("dog");
		self.setState({
			catVotes: catScore,
			dogVotes: dogScore,
		});
	}

	async addVoteCat() {
		let score = await self.getVotes("cat");
		score++;
		self.setVotes("cat", score);

		self.updateVotes();
		self.loadNewPictures();
	}
	async addVoteDog() {
		let score = await self.getVotes("dog");
		score++;
		self.setVotes("dog", score);

		self.updateVotes();
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