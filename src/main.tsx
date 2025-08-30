import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './router'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <Toaster richColors position='bottom-right'/>
  </Provider>
)
