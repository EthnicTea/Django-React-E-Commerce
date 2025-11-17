import React, { useState, useEffect } from 'react';
import { useAuth } from './services/AuthContext.jsx';
import { Bar, Pie } from 'react-chartjs-2';
import { // Librerías gráficos
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend, 
    ArcElement 
} from 'chart.js';
import './Dashboard.css'; 

ChartJS.register(
    CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement
);

const API_URL = import.meta.env.VITE_API_URL + '/api' //'http://127.0.0.1:8000/api';

// Agrega esto DESPUÉS de tus imports y ANTES del componente Dashboard

const chartOptions = (title) => {
    return {
        responsive: true,
        maintainAspectRatio: false, // CLAVE: Permite que el gráfico use toda la altura del contenedor
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 15,
                    font: {
                        size: 12
                    }
                }
            },
            title: {
                display: false // Ya tienes el título en el h3
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 13
                },
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        // Formatear números con separador de miles
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('es-CL', {
                                style: 'currency',
                                currency: 'CLP',
                                minimumFractionDigits: 0
                            }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        // Formatear el eje Y con separador de miles
                        return new Intl.NumberFormat('es-CL', {
                            notation: 'compact',
                            compactDisplay: 'short'
                        }).format(value);
                    },
                    font: {
                        size: 11
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 10
                    },
                    maxRotation: 90, // Rotar verticalmente
                    minRotation: 45, // Mínimo 45 grados
                    autoSkip: false, // No saltar etiquetas
                    callback: function(value, index, values) {
                        // Acortar nombres largos
                        const label = this.getLabelForValue(value);
                        if (label.length > 25) {
                            return label.substring(0, 25) + '...';
                        }
                        return label;
                    }
                },
                grid: {
                    display: false
                }
            }
        }
    };
};

// Opciones específicas para el gráfico de pie (sin ejes)
const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                padding: 10,
                font: {
                    size: 11
                },
                boxWidth: 15
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            callbacks: {
                label: function(context) {
                    let label = context.label || '';
                    if (label) {
                        label += ': ';
                    }
                    // Formatear con moneda
                    label += new Intl.NumberFormat('es-CL', {
                        style: 'currency',
                        currency: 'CLP',
                        minimumFractionDigits: 0
                    }).format(context.parsed);
                    
                    // Agregar porcentaje
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = ((context.parsed / total) * 100).toFixed(1);
                    label += ` (${percentage}%)`;
                    
                    return label;
                }
            }
        }
    }
};
const CCurrentYear = new Date().getFullYear();
const CYears = Array.from({ length: 5 }, (_, i) => CCurrentYear - i); // [2025, 2024, 2023, 2022, 2021]

export default function Dashboard() {
    const { authToken } = useAuth();

    const [selectedYear, setSelectedYear] = useState(CCurrentYear);
    const [pieData, setPieData] = useState(null);
    const [barData, setBarData] = useState(null);
    const [topProductsData, setTopProductsData] = useState(null);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            if (!authToken) return;
            setLoading(true); // Loading cuando haya cambio de año
            
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                };

                // ¡Añadimos el filtro de año a TODAS las peticiones!
                const [categoryRes, monthRes, topProductsRes] = await Promise.all([
                    fetch(`${API_URL}/dashboard/sales-by-category/?year=${selectedYear}`, { headers }),
                    fetch(`${API_URL}/dashboard/sales-by-month/?year=${selectedYear}`, { headers }),
                    fetch(`${API_URL}/dashboard/top-products/?year=${selectedYear}`, { headers }) //
                ]);

                if (!categoryRes.ok || !monthRes.ok || !topProductsRes.ok) {
                    throw new Error('Error al cargar los datos del dashboard');
                }

                const categoryJson = await categoryRes.json();
                const monthJson = await monthRes.json();
                const topProductsJson = await topProductsRes.json();

                // Transformamos el JSON del Backend al formato de Chart.js
                
                setPieData({
                    labels: categoryJson.map(item => item.label), // ['Gaming', 'Computacion', ...]
                    datasets: [{
                        label: 'Ventas por Categoría',
                        data: categoryJson.map(item => item.value), // [500000, 300000, ...]
                        backgroundColor: [ // Colores bonitos
                            '#007bff', '#28a745', '#dc3545', 
                            '#ffc107', '#17a2b8', '#6f42c1'
                        ],
                        hoverOffset: 4
                    }]
                });

                // Para el Gráfico de Barras
                setBarData({
                    labels: monthJson.map(item => item.label), // ['Octubre 2025', 'Noviembre 2025']
                    datasets: [{
                        label: 'Ventas Totales por Mes',
                        data: monthJson.map(item => item.value), // [800000, 1200000]
                        backgroundColor: '#007bff',
                    }]
                });

                setTopProductsData({
                    labels: topProductsJson.map(item => item.label), // Nombres de productos
                    datasets: [{
                        label: 'Ingresos por Producto',
                        data: topProductsJson.map(item => item.value), // Total $
                        backgroundColor: '#28a745', // Verde
                    }]
                });

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [authToken, selectedYear]);

    if (loading) return <div className="dashboard-container"><h2>Cargando Dashboard...</h2></div>;
    if (error) return <div className="dashboard-container"><h2 className="error-texto">{error}</h2></div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard de Ventas</h1>

                <div className="year-selector">
                    <label htmlFor="year-select">Mostrando datos del año: </label>
                    <select 
                        id="year-select"
                        value={selectedYear} 
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        {CYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div className="dashboard-grid">
                
                <div className="chart-card large-card">
                    <h3>Ventas por Mes</h3>
                    {barData && <Bar data={barData} options={chartOptions('Ventas por Mes')} />}
                </div>

                <div className="small-charts-stack"> 
                    <div className="chart-card">
                        <h3>Ventas por Categoría</h3>
                        {pieData && <Pie data={pieData} options={pieChartOptions} />}
                    </div>
                    
                    <div className="chart-card">
                        <h3>Top 5 Productos (Ingresos)</h3>
                        {topProductsData && <Bar data={topProductsData} options={chartOptions('Top 5 Productos')} />}
                    </div>
                </div>

            </div>
        </div>
    );
}