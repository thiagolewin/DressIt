import './NavBar.css'
import { useNavigate } from "react-router-dom";
import home from "../../img/home.svg"
import search from "../../img/search.svg"
import profile from "../../img/profile.svg"
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
            <img src={home} alt="" />
            <h4>Home</h4>
        </div>
        <div className="search" onClick={handleSearchClick}>
            <img src={search} alt="" />
        </div>
        <div className="profile" onClick={handleProfileClick}>
            <img src={profile} alt="" />
            <h4>Profile</h4>
        </div>
    </nav>)
}
export default NavBar