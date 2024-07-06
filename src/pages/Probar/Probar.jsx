import { useState, useEffect } from "react";
import { Fragment } from "react";
import "./Probar.css";
import { useNavigate,useParams } from "react-router-dom";
import returnImg from "../../img/return.svg";
import home from "../../img/home.svg";
import photo from "../../img/photo.svg";
import profile from "../../img/profile.svg";
import messi from '../../img/messi.jpg'
const Probar = () => {
  const navigateTo = useNavigate();
  const { img } = useParams();
  const urlCodificada = encodeURIComponent(img);
  const [file,setFile] = useState(null)
  const [stream, setStream] = useState(null);
  const selectedHandler = (e) => {
    setFile(e.target.files[0])
  };

  const handleHomeClick = () => {
    navigateTo("/inicio");
  };
  const sendHandler = ()=> {
    if(!file) {
      alert('Debes escoger un archivo')
      return
    } 
    const formdata = new FormData()
    formdata.append('image', file)

    fetch("http://localhost:3000/api/image/post",{
      method: "POST",
      body: formdata
    }).then(res => res.text()).then(res=> console.log(res)).catch(err=> {
      console.error(err)
    })
    setFile(null)
  }

  const handleProfileClick = () => {
    navigateTo("/search");
  };

  // Función para iniciar la cámara
  useEffect(() => {
    const iniciarCamara = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(stream);
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
      }
    };

    iniciarCamara(); // Llama a iniciarCamara() después de que el componente se monte

    // Limpia la función de limpieza para detener la cámara cuando el componente se desmonta
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // El segundo argumento del useEffect es un array vacío para que se ejecute solo una vez después de que el componente se monte

  return (
    <>
      <section id="Probar">
        <h1>Probar Prenda</h1>
        <video
            autoPlay
            playsInline
            className="takePicture"
            ref={(video) => {
              if (video) video.srcObject = stream;
            }}
          />
        <div className="pictureOptions">
          <img src={messi} alt="" />
            <input type="file" className="form-control" onChange={selectedHandler}/>
          <img src={returnImg} alt="" />
        </div>
      </section>
      <nav id="NavProbar">
        <div className="home" onClick={handleHomeClick}>
          <img src={home} alt="" />
          <h4>Home</h4>
        </div>
        <div className="search">
          <img src={photo} alt="" onClick={sendHandler}/>
        </div>
        <div className="profile" onClick={handleProfileClick}>
          <img src={profile} alt="" />
          <h4>Profile</h4>
        </div>
      </nav>
    </>
  );
};

export default Probar;
