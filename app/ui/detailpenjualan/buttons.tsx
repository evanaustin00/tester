'use client';

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { fetchtanggaltransaksi } from '../../lib/actionpenjualan';
import { transaksipenjualanForm } from "../../lib/definitions";

interface transaksipenjualan {
  id_transaksi_penjualan: string;
  tanggal_transaksi: string;
  total_transaksi: number;
}

export function ReportFilter() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filteredData, setFilteredData] = useState<transaksipenjualanForm[]>([]);
  const [selectedTingkat, setSelectedTingkat] = useState<string>("");

  // Function to determine text color based on 'tingkat'
  const getTingkatColor = (tingkat: string): string => {
    switch (tingkat) {
      case 'Gold':
        return 'text-yellow-500';
      case 'Silver':
        return 'text-slate-300';
      case 'Bronze':
        return 'text-orange-600';
      default:
        return 'text-gray-700';
    }
  };

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

      // Filter data berdasarkan tingkat
      const filtered = filterDataByTingkat(data);
      setFilteredData(filtered);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data:", error);
      alert("Terjadi kesalahan saat mengambil data.");
    }
  };

  const filterDataByTingkat = (data: transaksipenjualanForm[]) => {
    if (!selectedTingkat) return data; // Tidak ada filter tingkat jika kosong
    return data.filter(item => item.tingkat === selectedTingkat);
  };

  const handleTingkatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTingkat(event.target.value);
  };

  const handlePrintPDF = () => {
    if (filteredData.length === 0) {
      alert("Tidak ada data untuk dicetak!");
      return;
    }
  
    const doc = new jsPDF();
  
    // Judul Laporan
    doc.text("Laporan Transaksi Penjualan", 14, 10);
    doc.setFontSize(12);
    doc.text(`Periode: ${startDate?.toLocaleDateString()} - ${endDate?.toLocaleDateString()}`, 14, 20);
  
    // Header Tabel
    const tableColumns = ["ID Transaksi", "Tanggal Transaksi", "Total Transaksi"];
    const tableRows = filteredData.map((item) => [
      item.id_transaksi_penjualan,
      new Date(item.tanggal_transaksi).toLocaleDateString(),
      `Rp ${item.total_transaksi.toLocaleString()}`,
    ]);
  
    // Auto Table
    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 30,
    });
  
    // Menghitung total transaksi
    const totalTransaksi = filteredData.reduce((sum, item) => sum + item.total_transaksi, 0);
  
    // Menambahkan total transaksi di bagian bawah tabel
    const finalY = doc.lastAutoTable.finalY + 10; // Get the last Y position after the table
    doc.text(`Total Transaksi: Rp ${totalTransaksi.toLocaleString()}`, 14, finalY);
  
    // Simpan PDF
    doc.save("laporan_transaksi.pdf");
  };

  // Calculate the total transaksi from the filtered data
  const totalTransaksi = filteredData.reduce((sum, item) => sum + item.total_transaksi, 0);

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
        <select
          onChange={handleTingkatChange}
          className="px-4 py-2 rounded-md border"
          value={selectedTingkat}
        >
          <option value="">Pilih Tingkat</option>
          <option value="Bronze">Bronze</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
        </select>
        <button
          onClick={handleSearch}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <span>Cari</span>
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
                <th className="px-6 py-3 text-left">Nama Pegawai</th>
                <th className="px-6 py-3 text-left">Nama Pelanggan</th>
                <th className="px-6 py-3 text-left">Tingkat</th>
                <th className="px-6 py-3 text-left">No HP</th>
                <th className="px-6 py-3 text-left">Total Transaksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr
                  key={item.id_transaksi_penjualan}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200 transition-all duration-300`}
                >
                  <td className="px-6 py-4 text-sm font-medium">{item.id_transaksi_penjualan}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {new Date(item.tanggal_transaksi).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{item.nama_pegawai}</td>
                  <td className="px-6 py-4 text-sm font-medium">{item.nama_pelanggan}</td>
                  <td className={`px-6 py-4 text-sm font-medium ${getTingkatColor(item.tingkat)}`}>
                    {item.tingkat}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{item.no_hp}</td>
                  <td className="px-6 py-4 text-sm font-medium">Rp {item.total_transaksi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">
            Data akan ditampilkan di sini setelah pencarian.
          </p>
        )}
      </div>

      {/* Display Total Transaksi below the table */}
      {filteredData.length > 0 && (
        <div className="mt-4 text-lg font-semibold">
          <p>Total Transaksi: Rp {totalTransaksi.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
