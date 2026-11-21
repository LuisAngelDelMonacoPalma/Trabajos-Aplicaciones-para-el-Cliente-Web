const { useState } = React;

function BotonMeGusta() {
  const [likes, setLikes] = useState(0);

  return (
    <button onClick={() => setLikes(likes + 1)}>
      Me gusta (React): {likes}
    </button>
  );
}

const contenedor = document.getElementById("root");
const root = ReactDOM.createRoot(contenedor);
root.render(<BotonMeGusta />);