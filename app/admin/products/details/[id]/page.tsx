import productService from '@/lib/services/productService'
import { getProductProperties } from '@/lib/services/propDescServices'
import React from 'react'
import Product from './Product'
import AdminLayout from '@/components/admin/AdminLayout'


export const generateMetadata = async  ({
    params,
  }: {
    params: { id: string }
  }) => {
    const product = await productService.getById(parseInt(params.id))
    if (!product) {
      return { title: 'Product not found' }
    }
    return {
      title: product.name,
      description: product.description,
    }
}

const ProductViewPage = async ({
    params,
  }: {
    params: { id: string }
}) => {
    const product: Product = await productService.getById(parseInt(params.id))

    if (!product) {
        return <div>Product not found</div>  
    }

    const productProperties: ProductProperty | null = await getProductProperties(product.id!)

  return (
    <AdminLayout activeItem='products'>
        
        {/* Product details */}
        <Product 
            product={product}
            productProperties={productProperties}
        />
    </AdminLayout>
  )
}

export default ProductViewPage