import "./index";
import { signInWithPopup } from "./index"

function index(){
    return (
    <div className = "index">
        <button onClick= {signInWithPopup}> Sign In With Google</button>;
    </div>
    );
}
export default index;