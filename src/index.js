import ReactDOM from 'react-dom';
import createRoutes from './routes';

const rootElement = document.getElementById('root');
const routes = createRoutes();

ReactDOM.render(routes, rootElement);