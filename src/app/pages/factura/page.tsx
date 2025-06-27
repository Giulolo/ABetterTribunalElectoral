'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Plus,
  Trash2,
  Edit2,
  FileText,
  Building,
  User,
  CreditCard,
} from 'lucide-react';
import {
  Cedulacion,
  Factura,
  Servicio,
  Tribunal,
  FacturaDetalle,
} from '@/app/types';

const InvoiceManagement = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [tribunales, setTribunales] = useState<Tribunal[]>([]);
  const [cedulaciones, setCedulaciones] = useState<Cedulacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFactura, setEditingFactura] = useState<Factura | null>(null);

  // Form state
  const [selectedCedulacion, setSelectedCedulacion] = useState('');
  const [selectedServicios, setSelectedServicios] = useState<
    { servicioId: string; cantidad: number }[]
  >([{ servicioId: '', cantidad: 1 }]);
  const [impuestos, setImpuestos] = useState('0.07');
  const [metodoPago, setMetodoPago] = useState('');

  const printRef = useRef<HTMLDivElement>(null);

  // Calcular impuesto como 7% fijo

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [facturasRes, serviciosRes, tribunalesRes, cedulacionesRes] =
        await Promise.all([
          fetch('/api/facturas'),
          fetch('/api/servicios'),
          fetch('/api/tribunales'),
          fetch('/api/cedulaciones'),
        ]);

      const [facturasData, serviciosData, tribunalesData, cedulacionesData] =
        await Promise.all([
          facturasRes.json(),
          serviciosRes.json(),
          tribunalesRes.json(),
          cedulacionesRes.json(),
        ]);

      setFacturas(facturasData);
      setServicios(serviciosData);
      setTribunales(tribunalesData);
      setCedulaciones(cedulacionesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCedulacion('');
    setSelectedServicios([{ servicioId: '', cantidad: 1 }]);
    setImpuestos('0');
    setMetodoPago('');
    setEditingFactura(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const serviciosData = selectedServicios
      .filter(s => s.servicioId)
      .map(s => {
        const servicio = servicios.find(
          serv => serv.id === parseInt(s.servicioId),
        );
        return {
          servicioId: s.servicioId,
          cantidad: s.cantidad,
          precioUnitario: servicio?.precio || 0,
        };
      });

    if (!selectedCedulacion || serviciosData.length === 0) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      const response = await fetch('/api/facturas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cedulacionId: selectedCedulacion,
          servicios: serviciosData,
          impuestos: parseFloat(impuestos),
          metodoPago,
          estadoPago: 'pendiente',
        }),
      });

      if (response.ok) {
        await fetchAllData();
        setShowModal(false);
        resetForm();
      } else {
        alert('Error al crear la factura');
      }
    } catch (error) {
      console.error('Error creating factura:', error);
      alert('Error al crear la factura');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de que desea eliminar esta factura?')) return;

    try {
      const response = await fetch(`/api/facturas/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchAllData();
      } else {
        alert('Error al eliminar la factura');
      }
    } catch (error) {
      console.error('Error deleting factura:', error);
      alert('Error al eliminar la factura');
    }
  };

  const handleUpdatePayment = async (facturaId: number, estadoPago: string) => {
    try {
      const response = await fetch(`/api/facturas/${facturaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estadoPago,
          fechaPago: estadoPago === 'pagado' ? new Date().toISOString() : null,
        }),
      });

      if (response.ok) {
        await fetchAllData();
      } else {
        alert('Error al actualizar el estado de pago');
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Error al actualizar el estado de pago');
    }
  };

  const addServicioRow = () => {
    setSelectedServicios([
      ...selectedServicios,
      { servicioId: '', cantidad: 1 },
    ]);
  };

  const removeServicioRow = (index: number) => {
    setSelectedServicios(selectedServicios.filter((_, i) => i !== index));
  };

  const updateServicioRow = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updated = [...selectedServicios];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedServicios(updated);
  };

  const generatePDF = (factura: Factura) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #0066cc; padding-bottom: 20px; }
          .logo { color: #0066cc; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .title { color: #333; font-size: 18px; margin-bottom: 5px; }
          .subtitle { color: #666; font-size: 14px; }
          .logo-img { 
            max-width: 28rem; 
            height: auto; 
            margin-bottom: 0px; 
          }
          .factura-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
          }
          .info-section { margin: 20px 0; }
          .factura-info { flex: 1; }
          .pago-info { text-align: right; flex: 1; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          .info-box { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
          .info-title { font-weight: bold; color: #0066cc; margin-bottom: 10px; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th, .table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          .table th { background-color: #f5f5f5; font-weight: bold; }
          .totals { margin-top: 20px; text-align: right; }
          .total-row { margin: 5px 0; }
          .total-final { font-size: 18px; font-weight: bold; color: #0066cc; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
          .status { padding: 5px 10px; border-radius: 3px; font-size: 12px; font-weight: bold; }
          .status-pendiente { background-color: #fff3cd; color: #856404; }
          .status-pagado { background-color: #d4edda; color: #155724; }
          .status-cancelado { background-color: #f8d7da; color: #721c24; }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="/tepanama-logo.png" alt="Tribunal Electoral" class="logo-img" />
          <div class="title">DIRECCIÓN NACIONAL DE CEDULACIÓN</div>
          <div class="subtitle">República de Panamá</div>
        </div>

        <div class="info-section">
          <h2 style="color: #0066cc;">FACTURA N° ${factura.numeroFactura}</h2>
        </div>

        <div class="factura-header">
          <div class="factura-info">
            <p><strong>Fecha:</strong> ${new Date(
              factura.createdAt,
            ).toLocaleDateString('es-PA')}</p>
            <p><strong>Estado:</strong> <span class="status status-${
              factura.estadoPago
            }">${factura.estadoPago.toUpperCase()}</span></p>
          </div>

          ${
            factura.metodoPago
              ? `
            <div class="pago-info">
              <p><strong>Método de Pago:</strong> ${factura.metodoPago}</p>
              ${
                factura.fechaPago
                  ? `<p><strong>Fecha de Pago:</strong> ${new Date(
                      factura.fechaPago,
                    ).toLocaleDateString('es-PA')}</p>`
                  : ''
              }
            </div>
          `
              : ''
          }
        </div>

        <div class="info-grid">
          <div class="info-box">
            <div class="info-title">👤 DATOS DEL SOLICITANTE</div>
            <p><strong>Nombre:</strong> ${factura.cedulacion.nombreCompleto}</p>
            <p><strong>Cédula:</strong> ${
              factura.cedulacion.cedulaOriginal || 'N/A'
            }</p>
            <p><strong>Fecha Nacimiento:</strong> ${new Date(
              factura.cedulacion.fechaNacimiento,
            ).toLocaleDateString('es-PA')}</p>
            <p><strong>Lugar Nacimiento:</strong> ${
              factura.cedulacion.lugarNacimiento
            }</p>
            <p><strong>Género:</strong> ${factura.cedulacion.genero}</p>
          </div>
          
          <div class="info-box">
            <div class="info-title">🏛️ TRIBUNAL ASIGNADO</div>
            <p><strong>Nombre:</strong> ${
              factura.cedulacion.tribunal.nombre
            }</p>
            <p><strong>Provincia:</strong> ${
              factura.cedulacion.tribunal.provincia
            }</p>
            <p><strong>Dirección:</strong> ${
              factura.cedulacion.tribunal.direccion || 'N/A'
            }</p>
            <p><strong>Teléfono:</strong> ${
              factura.cedulacion.tribunal.telefono || 'N/A'
            }</p>
          </div>
        </div>

        <div class="info-section">
          <h3 style="color: #0066cc;">DETALLE DE SERVICIOS</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${factura.facturaDetalles
                .map(
                  detalle => `
                <tr>
                  <td>${detalle.servicio.nombre}</td>
                  <td>${detalle.servicio.tipoServicio}</td>
                  <td>${detalle.cantidad}</td>
                  <td>B/. ${parseFloat(
                    detalle.precioUnitario.toString(),
                  ).toFixed(2)}</td>
                  <td>B/. ${parseFloat(detalle.subtotal.toString()).toFixed(
                    2,
                  )}</td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
        </div>

        <div class="totals">
          <div class="total-row">
            <strong>Subtotal: B/. ${parseFloat(
              factura.subtotal.toString(),
            ).toFixed(2)}</strong>
          </div>
          <div class="total-row">
            <strong>Impuestos: B/. ${parseFloat(
              factura.impuestos.toString(),
            ).toFixed(2)}</strong>
          </div>
          <div class="total-row total-final">
            <strong>TOTAL: B/. ${parseFloat(factura.total.toString()).toFixed(
              2,
            )}</strong>
          </div>
        </div>

        

        <div class="footer">
          <p><strong>Tribunal Electoral de la República de Panamá</strong></p>
          <p>Dirección Nacional de Cedulación</p>
          <p>www.tribunal-electoral.gob.pa</p>
          <p>Esta factura es un documento oficial del Tribunal Electoral</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(pdfContent);
    printWindow.document.close();
    printWindow.print();

    // Esperar a que se cargue la imagen antes de imprimir
    printWindow.onload = function () {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  };

  const formatCurrency = (amount: number) => {
    const numericAmount = parseFloat(amount.toString()) || 0;
    return `B/. ${numericAmount.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pagado':
        return 'text-green-700 bg-green-100';
      case 'cancelado':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-yellow-700 bg-yellow-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Sistema de Facturación
                </h1>
                <p className="text-gray-600">
                  Tribunal Electoral - Dirección Nacional de Cedulación
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Nueva Factura</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Facturas
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {facturas.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pagadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {facturas.filter(f => f.estadoPago === 'pagado').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <User className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {facturas.filter(f => f.estadoPago === 'pendiente').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Facturas Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Lista de Facturas
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Factura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tribunal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {facturas.map(factura => (
                  <tr key={factura.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {factura.numeroFactura}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {factura.cedulacion.nombreCompleto}
                      </div>
                      <div className="text-sm text-gray-500">
                        {factura.cedulacion.cedulaOriginal}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {factura.cedulacion.tribunal.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {factura.cedulacion.tribunal.provincia}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(parseFloat(factura.total.toString()))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          factura.estadoPago,
                        )}`}
                      >
                        {factura.estadoPago}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(factura.createdAt).toLocaleDateString('es-PA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => generatePDF(factura)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Generar PDF"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        {factura.estadoPago === 'pendiente' && (
                          <button
                            onClick={() =>
                              handleUpdatePayment(factura.id, 'pagado')
                            }
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Marcar como pagado"
                          >
                            <CreditCard className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(factura.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for New Invoice */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Nueva Factura
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cedulación Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Cedulación *
                  </label>
                  <select
                    value={selectedCedulacion}
                    onChange={e => setSelectedCedulacion(e.target.value)}
                    className="w-full p-3 border border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Seleccione una cedulación...</option>
                    {cedulaciones.map(cedulacion => (
                      <option key={cedulacion.id} value={cedulacion.id}>
                        {cedulacion.nombreCompleto} -{' '}
                        {cedulacion.cedulaOriginal} (
                        {cedulacion.tribunal.nombre})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Services Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Servicios *
                  </label>
                  {selectedServicios.map((item, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <select
                        value={item.servicioId}
                        onChange={e =>
                          updateServicioRow(index, 'servicioId', e.target.value)
                        }
                        className="flex-1 p-3 border border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Seleccione un servicio...</option>
                        {servicios.map(servicio => (
                          <option key={servicio.id} value={servicio.id}>
                            {servicio.nombre} -{' '}
                            {formatCurrency(servicio.precio)} (
                            {servicio.tipoServicio})
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={e =>
                          updateServicioRow(
                            index,
                            'cantidad',
                            parseInt(e.target.value),
                          )
                        }
                        className="w-20 p-3 border border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Cant."
                      />
                      {selectedServicios.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeServicioRow(index)}
                          className="p-3 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addServicioRow}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar servicio
                  </button>
                </div>

                {/* Additional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Impuestos (B/.)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={impuestos}
                      // onChange={(e) => setImpuestos(e.target.value)}
                      readOnly
                      className="w-full p-3 border border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Método de Pago
                    </label>
                    <select
                      value={metodoPago}
                      onChange={e => setMetodoPago(e.target.value)}
                      className="w-full p-3 border border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccione método...</option>
                      <option value="efectivo">Efectivo</option>
                      <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                      <option value="transferencia">
                        Transferencia Bancaria
                      </option>
                      <option value="cheque">Cheque</option>
                    </select>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Crear Factura
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceManagement;
