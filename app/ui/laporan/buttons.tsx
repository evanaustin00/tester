import Link from 'next/link';

import React from 'react';
export function Detail_Penjualan() {
  return (
    <Link
      href="/dashboard/detail_penjualan"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span>Detail Penjualan</span>
    </Link>
  );
}

export function Detail_Pembelian() {
  return (
    <Link
      href="/dashboard/detail_pembelian"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span>Detail Pembelian</span>
    </Link>
  );
}
