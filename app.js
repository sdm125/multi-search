const express = require('express');
const app = express();
const env = require('dotenv').config();
const path = require('path');
const exphbs = require('express-handlebars');
const osmosis = require('osmosis');

app.engine('handlebars', exphbs({	defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

// Body Parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const generateID = () => {
	return Math.random().toString(16).substring(2);
}

app.get('/', (req, res) => {
	res.render('index', {searchTermID: generateID()});
});

app.post('/search', (req, res) => {
	const searchPromises = [];
	let searchData = {
		terms: [],
		results: null,
		orientation: ''
	};

	for (formElm in req.body) {
		if (formElm !== 'orientation') {
			if (req.body[formElm] !== '') {
				searchData.terms.push({name: formElm, value: req.body[formElm]});
				searchPromises.push(new Promise((resolve, reject) => {
					osmosis.get(`${process.env.SEARCH}${req.body[formElm]}`)
					.set({'search': 'input["title=search"]@value',
								'links': {
									'titles': [process.env.TITLE_SEL],
									'urls': [process.env.URL_SEL],
									'descriptions': [process.env.DESCRIPTION_SEL]	
								}
							})
					.data(searchData => {
						searchData.links = searchData.links.titles.map((search, index) => {
							return {title: searchData.links.titles[index], 
											url: searchData.links.urls[index], 
											description: searchData.links.descriptions[index]};
						});	
						resolve(searchData);
					});
				}));
			}
		}
		else {
			if (Object.keys(req.body).length > 2) {
				searchData.orientation = req.body[formElm] === 'column';
			}
			else {
				searchData.orientation = true;
			}
		}
	}

	Promise.all(searchPromises).then(data => {
		searchData.results = data;
		res.render('index', {searchData});	
	}).catch(err => console.log(err));
});

app.use(express.static(path.join(__dirname, 'dist')));

app.listen(3000, () => 'Listening on port 3000');
