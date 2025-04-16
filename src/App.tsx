import Router from "./Router";
import "./assets/reset.css";
import "./assets/style.css";
import { Header } from "./components/Header";

const App = () => {

  return (
    <>
      <Header />
      <main className="c-main-image c-main" style={{ overflow: 'auto' }}>
        <Router />
      </main>
    </>
  )
}

export default App;