import { useState, useEffect } from 'react'
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

const ControlPresupuesto = ({
    gastos,
    setGastos, 
    presupuesto,
    setPresupuesto,
    setIsValidPresupuesto
}) => {

  const [porcentaje, setPorcentaje] = useState(0);
  const [disponible, setDisponible] = useState(0);
  const [gastado, setGastado] = useState(0);
  
  useEffect(() => {
    const totalGastado = gastos.reduce((total, gasto) => gasto.cantidad + total, 0);

    const totalDisponible = presupuesto - totalGastado;

    // Calcular el porcentaje gastados
    const nuevoPorcentaje = (( (presupuesto - totalDisponible) / presupuesto) * 100).toFixed(2);
    
    setDisponible(totalDisponible);
    setGastado(totalGastado);

    setTimeout(() => {  
        setPorcentaje(nuevoPorcentaje);
    }, 1000)
  }, [gastos])

  const formatearCantidad = (cantidad) => {
      return cantidad.toLocaleString("en-US", {
          style: "currency",
          currency: "USD"
      })
  }

  const handleResetApp = () => {
    Swal.fire({
        title: '¿Deseas reiniciar presupuesto y gastos?',
        text: "No puedes revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, reiniciar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
        Swal.fire(
            'Reiniciado',
            'Presupuesto y gastos han sido reiniciados',
            'success'
        )

        setGastos([])
        setPresupuesto(0)
        setIsValidPresupuesto(false)
        }
    })
  }

  return (
    <div className="contenedor-presupuesto contenedor sombra dos-columnas">
        <div>
            <CircularProgressbar
                styles={buildStyles({
                    pathColor: porcentaje > 100 ? "#DC2626" : "#3B82F6",
                    trailColor: "#F5F5F5",
                    textColor: porcentaje > 100 ? "#DC2626" : "#3B82F6",
                })}
                value={porcentaje}
                text={`${porcentaje}% Gastado`}
            />
        </div>

        <div className="contenido-presupuesto">
            <button
                className="reset-app"
                onClick={handleResetApp}
            >
                Resetear App
            </button>
            <p>
                <span>Presupuesto: </span>{formatearCantidad(presupuesto)}
            </p>
            <p className={`${disponible < 0 ? "negativo" : ""}`}>
                <span>Disponible: </span>{formatearCantidad(disponible)}
            </p>
            <p>
                <span>Gastado: </span>{formatearCantidad(gastado)}
            </p>
        </div>
    </div>
  )
}

export default ControlPresupuesto