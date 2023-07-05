import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom';
import { router } from './Configs/router';
import { Provider } from 'react-redux';
import { store } from './Configs/Redux/store';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <Provider store={store}>
     <RouterProvider router={router} />
    </Provider>
  </>
)
