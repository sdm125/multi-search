const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const google = require('google');

app.engine('handlebars', exphbs({	defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

// Body Parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
	res.render('index');
});

app.post('/search', (req, res) => {
	const searchPromises = [];
	let searchData = {
		terms: [],
		results: null,
		orientation: ''
	};

	for (formElm in req.body) {
		if(formElm !== 'orientation') {
			searchData.terms.push(req.body[formElm]);
			searchPromises.push(new Promise((resolve, reject) => {
				google(req.body[formElm], (err, results) => {
					err ? reject(err) : resolve(results);
				});
			}));
		}
		else {
			searchData.orientation = req.body[formElm] === 'column';
		}
	}

	Promise.all(searchPromises).then(data => {
		const results = data.map(list => {
			list.links = list.links.filter(searchResult => searchResult.link !== null);
			return {title: list.query.toUpperCase(), links: list.links, urlencoded: encodeURIComponent(list.query)};
		});
		searchData.results = results;
		res.render('index', {searchData});
	}).catch(err => console.log(err));
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => console.log('Listening on port 3000.'));
