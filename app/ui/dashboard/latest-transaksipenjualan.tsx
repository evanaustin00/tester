import  ArrowPathIcon  from '@heroicons/react/24/outline/ArrowPathIcon.js';
import clsx from 'clsx';
import Image from 'next/image';
import { inter } from '../../ui/fonts';
import { latest_Transaksi_Penjualan } from '../../lib/definitions';
import React from 'react';

export default async function latest_Transaksi_penjualan({
  latest_Transaksi_penjualan,
}: {
  latest_Transaksi_penjualan: latest_Transaksi_Penjualan[];
}) {
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${inter.className} mb-4 text-xl md:text-2xl`}>
        Latest Transaksi Penjualan
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-green-200 p-4">
        {/* NOTE: Uncomment this code in Chapter 7 */}

        <div className="bg-white px-6">
          {latest_Transaksi_penjualan.map((transaksipenjualan, i) => {
            return (
              <div
                key={transaksipenjualan.nama_produk}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )} 
              > 
                <div className="flex items-center">
                  
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {transaksipenjualan.nama_produk}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {transaksipenjualan.tanggal_transaksi}
                    </p>
                  </div>
                </div>
                <p
                  className={`${inter.className} truncate text-sm font-medium md:text-base`}
                >
                  {transaksipenjualan.total_transaksi}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-yellow-800" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
