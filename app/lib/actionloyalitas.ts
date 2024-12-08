'use server';

import { sql } from '@vercel/postgres';
import { PelangganField } from './definitions';
// Definisikan tipe data pelanggan


// Fungsi untuk mencari pelanggan berdasarkan nomor HP
export async function fetchPelangganByNoHp(no_hp: string): Promise<PelangganField | null> {
    try {
      console.log("Fetching pelanggan with no_hp:", no_hp); // Debug nomor HP
  
      const result = await sql<PelangganField[]>`
        SELECT id_pelanggan, nama_pelanggan, alamat, no_hp, jumlah_xp
        FROM pelanggan
        WHERE no_hp = ${no_hp}
        LIMIT 1;
      `;
  
      console.log("Database result:", result.rows); // Debug hasil query
  
      // Ambil elemen pertama dari result.rows jika ada, atau null jika tidak
      const pelanggan = result.rows.length > 0 ? result.rows[0] : null;
      console.log("Result rows:", result.rows); // Debug semua hasil query
      console.log("Pelanggan yang ditemukan:", pelanggan); // Debug hasil pelanggan
      
      return pelanggan; // Kembalikan pelanggan atau null jika tidak ditemukan
    } catch (error) {
      console.error("Error fetching pelanggan:", error);
      throw new Error("Failed to fetch pelanggan data.");
    }
  }
    