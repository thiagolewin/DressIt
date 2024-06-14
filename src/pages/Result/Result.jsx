import './Result.css'
import { useParams,useLocation} from 'react-router-dom';
const Result = ()=> {
    const location = useLocation();
    const imageUrl = location.state.imageUrl;
    console.log(imageUrl)
    return(
        <section id='Result'>
            <h1>DressIt</h1>
        </section>
    )
}
export default Result