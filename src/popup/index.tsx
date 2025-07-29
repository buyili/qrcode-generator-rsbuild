import { createRoot } from "react-dom/client";
import { Popup } from "./popup";
import '../styles/global.css';
import './index.css';

const root = createRoot(document.querySelector("#root")!);

root.render(<Popup />);
