import { useState, useEffect, useRef } from "react";
import { Fragment } from "react";
import "./Probar.css";
import { useNavigate,useParams } from "react-router-dom";
import returnImg from "../../img/return.svg";
import home from "../../img/home.svg";
import photo from "../../img/photo.svg";
import tick from "../../img/tick.png";
import profile from "../../img/profile.svg";
import subir from '../../img/subir.png'
import Webcam from "react-webcam";
import x from "../../img/x.png"
function base64ToBlob(base64String, mimeType) {
  // Separa el encabezado de la cadena base64
  const byteCharacters = atob(base64String.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}
const Probar = () => {
  const navigateTo = useNavigate();
  const { img,site } = useParams();
  const webRef = useRef(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [imageResultado, setImageResultado] = useState("");
  const [cargando, setCargando] = useState(false);
  const [camara,setCamara] = useState("usuario")
  const [file,setFile] = useState(null)
  const [videoactivo,setVideoactivo] = useState(true)
  const [videoConstraints, setVideoConstraints] = useState({
    facingMode: "user",
    mirrored:"true" 
  })
  const [stream, setStream] = useState(null);
  const selectedHandler = (e) => {
    setVideoactivo(false)
    console.log("asd")
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Leer el archivo y establecer la URL de la imagen para la vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
        setVideoactivo(false)
      };
      reader.readAsDataURL(selectedFile);

      let video = document.querySelector("video");
      if (video) {
        video.style.display = "none";
      }
      e.target.value = null;
    }
  };
  const handleHomeClick = () => {
    navigateTo("/inicio");
  };
  const sendHandler = async  ()=> {
    let archivo = undefined;
    if(videoactivo) {
      let imagen = webRef.current.getScreenshot()
      const mimeType = 'image/jpeg'; // Asegúrate de usar el tipo MIME correcto
      const blob = base64ToBlob(imagen, mimeType);
      archivo = new File([blob], "captura.jpg", { type: mimeType });
      let video = document.querySelector("video");
      if (video) {
        video.style.display = "none";
      }
      setVideoactivo(false)
      setImagePreviewUrl(imagen)
      setFile(archivo);
    } else {
      if(!file && !archivo) {
        alert('Debes escoger un archivo')
        return
      } 
      const formData = new FormData();
      if(file) {
        formData.append('background_url', file);
      } else {
        formData.append('background_url', archivo);
      }
   // imageFile es el archivo que quieres subir
      formData.append('garment_url', img);
      console.log(formData.get("background_url"))
      setCargando(true)
      try {
        const response = await fetch("https://dressitnode-uq2eh73iia-uc.a.run.app/api/image/post", {
          method: "POST",
          body: formData
      });
          const blob = await response.blob(); // Convierte el ReadableStream a un Blob
          const url = URL.createObjectURL(blob); // Crea un objeto URL para el Blob
          setCargando(false)
          setImageResultado(url);
      } catch (error) {
        setCargando(false)
      }
    }
    
    

}
  const sacarImagen = ()=> {
    setVideoactivo(true)
    setFile(null)
    setImagePreviewUrl("")
    let video = document.querySelector("video");
    if (video) {
      video.style.display = "block";
    }
  }
  const changeCamera = ()=> {
    if(camara == "usuario") { 
      setVideoConstraints({
        facingMode: "environment",
        mirrored:"false" 
      })
      setCamara("environment")
    } else {
      setVideoConstraints({
        facingMode: "user",
        mirrored:"true" 
      })
      setCamara("usuario")
    }
    
  }
  const handleProfileClick = () => {
    navigateTo("/search");
  };
  const Volver = () => {
    navigateTo(-1);
}
  const irAcomprar = () => {
    window.location.href = site;
  }
  // Función para iniciar la cámara
  useEffect(() => {
  }, []); // El segundo argumento del useEffect es un array vacío para que se ejecute solo una vez después de que el componente se monte

  return (
    <>
    { cargando==true&&<div className="cargando">
    <div className="container">
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>
<h3>Esperar. Esto puede demorar hasta 1 minuto</h3>
    </div>}
      {!imageResultado && <section id="Probar">
        <h1>Probar Prenda</h1>
        <Webcam ref={webRef} screenshotFormat="image/jpeg" className="video" videoConstraints={videoConstraints}></Webcam>
    {imagePreviewUrl && <div className="imagenCross"><img src={imagePreviewUrl} className="ImagenPrenda" /> <img src={x} className="x" onClick={sacarImagen}></img></div>}
        <div className="pictureOptions">
          <div className="contenedor">
          <img src={subir} alt="" />
          <input type="file" className="form-control" onChange={selectedHandler}/>
          </div>
          <div className="contenedor">
          <img src={returnImg} alt="" onClick={changeCamera}/>
          </div>

        </div>
      </section>}
     {imageResultado && <section id="ProbarResultado">
        <h1 className="tituloResultado">DressIt</h1>
        <img className="imageResultado" src={imageResultado} alt="" />
        <div className="botones">
          <button className="comprar" onClick={irAcomprar}>Ir A Comprar</button>
          <button className="volver" onClick={ Volver}>volver</button>
        </div>
      </section>}
      <nav id="NavProbar">
        <div className="home" onClick={handleHomeClick}>
          <img src={home} alt="" />
          <h4>Home</h4>
        </div>
        <div className="search" onClick={sendHandler}>
          {videoactivo &&<img src={photo} alt="" />}
          {!videoactivo &&<img src={tick} alt="" width="30px"/>}
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
