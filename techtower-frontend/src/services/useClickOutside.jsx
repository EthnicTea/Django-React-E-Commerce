import { useEffect, useRef } from 'react';

/**
 * Hook que detecta clics fuera de un elemento referenciado.
 * @param {Function} handler - La función a ejecutar cuando se hace clic fuera.
 * @returns {React.RefObject} - La referencia que debes asignar al elemento que quieres "vigilar".
 */
export function useClickOutside(handler) {
    const domNodeRef = useRef();

    useEffect(() => {
        const maybeHandler = (event) => {
            // Si la referencia existe Y el clic NO fue dentro del elemento referenciado!
            if (domNodeRef.current && !domNodeRef.current.contains(event.target)) {
                // ...ejecuta la función que nos pasaron, por ejemplo, cerrar un DROPDOWN
                handler();
            }
        };

        // Añadimos el "escucha" al documento entero
        document.addEventListener("mousedown", maybeHandler);

        // ¡IMPORTANTE! SE LIMPIA el "escucha" cuando el componente se desmonta
        return () => {
            document.removeEventListener("mousedown", maybeHandler);
        };
    }, [handler]); // Se re-ejecuta si el 'handler' cambia!

    return domNodeRef; // Devolvemos la referencia para que se use en cualquier JSX
}