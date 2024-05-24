import "./Start.css"
import { useNavigate } from "react-router-dom";

const Start = ()=> {
    const navigateTo = useNavigate();

    const handleRedirectToLogin = () => {
        navigateTo("/login");
    };

    return (
        <section onClick={handleRedirectToLogin}>
            <h1>DressIt</h1>
        </section>
    );
};

export default Start;
