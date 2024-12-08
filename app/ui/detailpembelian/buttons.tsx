'use client';

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { fetchtanggaltransaksi } from '../../lib/actionpembelian';
import { transaksiPembelianForm } from "../../lib/definitions";

interface transaksipembelian {
  id_transaksi_pembelian: string;
  tanggal_pembelian: string;
  total_harga: number;
  nama_supplier: string;
}

export function ReportFilter() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filteredData, setFilteredData] = useState<transaksiPembelianForm[]>([]);

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      alert("Pilih tanggal awal dan akhir sebelum mencari!");
      return;
    }

    // Format the dates to YYYY-MM-DD (no time portion)
    const startDateString = startDate.toISOString().split('T')[0];
    const endDateString = endDate.toISOString().split('T')[0];

    try {
      const data = await fetchtanggaltransaksi({ startDate: startDateString, endDate: endDateString });

      if (data.length === 0) {
        alert("Tidak ada data ditemukan untuk rentang tanggal ini.");
      }

      setFilteredData(data); // Update filtered data dengan data yang didapat
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data:", error);
      alert("Terjadi kesalahan saat mengambil data pembelian.");
    }
  };

  const handlePrintPDF = () => {
    if (filteredData.length === 0) {
      alert("Tidak ada data untuk dicetak!");
      return;
    }

    const doc = new jsPDF();

    // Judul Laporan
    doc.text("Laporan Transaksi Pembelian", 14, 10);
    doc.setFontSize(12);
    doc.text(`Periode: ${startDate?.toLocaleDateString()} - ${endDate?.toLocaleDateString()}`, 14, 20);

    // Header Tabel
    const tableColumns = ["ID Transaksi", "Tanggal Transaksi", "Nama Supplier", "Nama Barang", "Total Transaksi"];
    const tableRows = filteredData.map((item) => [
      item.id_transaksi_pembelian,
      new Date(item.tanggal_pembelian).toLocaleDateString(),
      item.nama_supplier,
      item.nama_barang,
      `Rp ${item.total_harga.toLocaleString()}`,
    ]);

    // Auto Table
    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 30,
    });

    // Simpan PDF
    doc.save("laporan_transaksi.pdf");
  };

  // Calculate the total transaksi from the filtered data
  const totalTransaksi = filteredData.reduce((sum, item) => sum + item.total_harga, 0);

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="flex space-x-4">
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => setStartDate(date)}
          placeholderText="Start Date"
          className="px-4 py-2 rounded-md border"
        />
        <DatePicker
          selected={endDate}
          onChange={(date: Date | null) => setEndDate(date)}
          placeholderText="End Date"
          className="px-4 py-2 rounded-md border"
        />
        <button
          onClick={handleSearch}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <span>Cari Pembelian</span>
        </button>
        <button
          onClick={handlePrintPDF}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <span>Cetak PDF</span>
        </button>
      </div>

      <div className="w-full rounded-md border p-4 mt-4">
        {filteredData.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="px-6 py-3 text-left">ID Transaksi</th>
                <th className="px-6 py-3 text-left">Tanggal Transaksi</th>
                <th className="px-6 py-3 text-left">Nama Supplier</th>
                <th className="px-6 py-3 text-left">Nama Barang</th>
                <th className="px-6 py-3 text-left">Total Transaksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((items, index) => (
                <tr
                  key={items.id_transaksi_pembelian}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200 transition-all duration-300`}
                >
                  <td className="px-6 py-4 text-sm font-medium">{items.id_transaksi_pembelian}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {new Date(items.tanggal_pembelian).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{items.nama_supplier}</td>
                  <td className="px-6 py-4 text-sm font-medium">{items.nama_barang}</td>
                  <td className="px-6 py-4 text-sm font-medium">Rp {items.total_harga.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">
            Data transaksi akan ditampilkan di sini setelah pencarian.
          </p>
        )}
      </div>

      {/* Display Total Transaksi below the table */}
      {filteredData.length > 0 && (
        <div className="mt-4 text-lg font-semibold">
          <p>Total Pembelian: Rp {totalTransaksi.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
