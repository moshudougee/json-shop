/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react'
import useLayoutService from '@/lib/hooks/useLayout'
//import { OrderItem } from '@/lib/models/OrderModel'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

const OrderDetails = ({
    orderId,
  }: {
    orderId: string
  }) => {
    const { theme } = useLayoutService()
    const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
        `/api/orders/${orderId}`,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async (url) => {
        const res = await fetch(`/api/admin/orders/${orderId}/deliver`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
        })
        const data = await res.json()
        res.ok
            ? toast.success('Order delivered successfully')
            : toast.error(data.message)
        }
    )
    
    const { data, error } = useSWR<Order, Error>(`/api/orders/${orderId}`)

    if (error) return error.message
    if (!data) return 'Loading...'

    const {
        paymentMethod,
        shippingAddress,
        items,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isDelivered,
        deliveredAt,
        isPaid,
        paidAt,
    } = data

  return (
    <div>
      <h1 className="text-2xl py-4">Order {orderId}</h1>
      <div className="grid md:grid-cols-3 md:gap-5 my-4">
        <div className="md:col-span-3">
            <div className='flex flex-col lg:flex-row gap-4'>
                <div className='w-full md:w-1/2 lg:w-1/3'>
                    <div className="card bg-base-300 w-full">
                        <div className="card-body">
                            <h2 className="card-title">Order Summary</h2>
                            <ul>
                                <li>
                                <div className="mb-2 flex justify-between">
                                    <div>Items</div>
                                    <div>${itemsPrice}</div>
                                </div>
                                </li>
                                <li>
                                <div className="mb-2 flex justify-between">
                                    <div>Tax</div>
                                    <div>${taxPrice}</div>
                                </div>
                                </li>
                                <li>
                                <div className="mb-2 flex justify-between">
                                    <div>Shipping</div>
                                    <div>${shippingPrice}</div>
                                </div>
                                </li>
                                <li>
                                <div className="mb-2 flex justify-between">
                                    <div>Total</div>
                                    <div>${totalPrice}</div>
                                </div>
                                </li>

                                
                                <li>
                                <button
                                    className="btn w-full my-2"
                                    onClick={() => deliverOrder()}
                                    disabled={isDelivering}
                                >
                                    {isDelivering && (
                                    <span className="loading loading-spinner"></span>
                                    )}
                                    Mark as delivered
                                </button>
                                </li>
                                
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div className='flex flex-col md:flex-row gap-4 w-full lg:w-2/3'>
                    <div className="card bg-base-300 w-full md:w-1/2">
                        <div className="card-body">
                            <h2 className="card-title">Shipping Address</h2>
                            <p>{shippingAddress.fullName}</p>
                            <p>
                                {shippingAddress.address}, {shippingAddress.city},{' '}
                                {shippingAddress.postalCode}, {shippingAddress.country}{' '}
                            </p>
                            {isDelivered ? (
                                <div className="text-success">Delivered at {deliveredAt}</div>
                            ) : (
                                <div className="text-error">Not Delivered</div>
                            )}
                        </div>
                    </div>

                    <div className="card bg-base-300 w-full md:w-1/2">
                        <div className="card-body">
                            <h2 className="card-title">Payment Method</h2>
                            <p>{paymentMethod}</p>
                            {isPaid ? (
                                <div className="text-success">Paid at {paidAt}</div>
                            ) : (
                                <div className="text-error">Not Paid</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Items</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Properties</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: OrderItem, index) => {
                    // Format the product name for better readability
                    let formatedName = ''
                    if (item.name.length > 20) {
                      formatedName = item.name.substring(0, 20) + '...'
                    } else {
                      formatedName = item.name
                    }

                    return (
                      <tr key={index}>
                        <td>
                          <Link
                            href={`/product/${item.slug}`}
                            className="flex items-center"
                          >
                            <Image
                              src={item.images[0]}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></Image>
                            <span className="px-2">
                              {formatedName}
                            </span>
                          </Link>
                        </td>
                        <td>
                          {item.properties && item.properties?.length > 0 && item.properties?.map((property, index) => {
                            return (
                              <div key={property.propertyId} className='flex flex-wrap gap-1'>
                                <span className={`font-semibold ${theme === 'dark' ? 'text-orange-600/80' : ''}`}>
                                  {property.name}:
                                </span>
                                <span className="ml-1">{property.value}</span>
                                <span>{index !== (item.properties?.length ?? 0) - 1 ? ',' : ''}</span>
                              </div>
                            )
                          })
                          }
                        </td>
                        <td>{item.qty}</td>
                        <td>${item.price}</td>
                      </tr>
                    )}
                  )}
                </tbody>
              </table>
            </div>
            </div>
        </div>

        
      </div>
    </div>
  )
}

export default OrderDetails