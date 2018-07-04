import * as React from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Management from './pages/management';
import Public from './pages/public';
import Singer from './pages/singer';

class App extends React.Component {
	public render() {
		return (
			<Router>
				<Switch>
					<Route path="/singer" component={Singer} />
					<Route path="/management" component={Management} />
					<Route path="/" exact={true} component={Public} />
				</Switch>
			</Router>
		);
	}
}

export default App;
