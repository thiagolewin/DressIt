import "./Start.css"
import { useNavigate } from "react-router-dom";

const Start = ()=> {
    const navigateTo = useNavigate();

    const handleRedirectToLogin = () => {
        navigateTo("/inicio");
    };

    return (
        <section onClick={handleRedirectToLogin} id="start">
            <h1>DressIt</h1>
        </section>
    );
};

export default Start;
