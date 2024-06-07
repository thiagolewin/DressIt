import './NavBar.css'
import { useNavigate } from "react-router-dom";
const NavBar = ()=> {
    const navigateTo = useNavigate();
    const handleSearchClick = () => {
        navigateTo("/search");
    };
    const handleHomeClick = () => {
        navigateTo("/inicio");
    };
    const handleProfileClick = () => {
        navigateTo("/search");
    };
    return (<nav id="Nav">
        <div className="home" onClick={handleHomeClick}>
            <img src="./src/img/home.svg" alt="" />
            <h4>Home</h4>
        </div>
        <div className="search" onClick={handleSearchClick}>
            <img src="./src/img/search.svg" alt="" />
        </div>
        <div className="profile" onClick={handleProfileClick}>
            <img src="./src/img/profile.svg" alt="" />
            <h4>Profile</h4>
        </div>
    </nav>)
}
export default NavBar