import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/useProducts';
import { productSchema } from '../../utils/validators';
import { formatPrice } from '../../utils/formatters';
import type { Product } from '../../types';

export const AdminProducts = () => {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
  });

  const openCreate = () => {
    setEditing(null);
    reset({ name: '', description: '', price: 0, category: '', stock: 0 });
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
    setModalOpen(true);
  };

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', String(data.price));
    formData.append('category', data.category);
    formData.append('stock', String(data.stock));

    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
    if (fileInput?.files?.[0]) {
      formData.append('image', fileInput.files[0]);
    }

    if (editing) {
      updateProduct.mutate({ id: editing._id, data: formData });
    } else {
      createProduct.mutate(formData);
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-text-secondary text-sm">{products?.length || 0} products</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all text-sm"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="px-6 py-4"><div className="h-5 w-48 glass rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-24 glass rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-20 glass rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-16 glass rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-16 glass rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : (
                products?.map((product) => (
                  <tr key={product._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.imagesUrl} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                        <span className="text-sm font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{product.category}</td>
                    <td className="px-6 py-4 text-sm font-medium">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${product.stock > 0 ? 'text-success' : 'text-error'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(product)} className="p-2 text-text-secondary hover:text-accent transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => deleteProduct.mutate(product._id)} className="p-2 text-text-secondary hover:text-error transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/60 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-lg glass rounded-2xl p-8 border border-white/10 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">{editing ? 'Edit Product' : 'Add Product'}</h2>
                  <button onClick={() => setModalOpen(false)} className="p-1 text-text-secondary hover:text-white">
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input {...register('name')} className="w-full px-4 py-3 glass rounded-xl text-white placeholder-text-secondary outline-none focus:border-accent/50 transition-colors border border-white/10" />
                    {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea {...register('description')} rows={3} className="w-full px-4 py-3 glass rounded-xl text-white placeholder-text-secondary outline-none focus:border-accent/50 transition-colors border border-white/10 resize-none" />
                    {errors.description && <p className="text-error text-xs mt-1">{errors.description.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Price (₹)</label>
                      <input type="number" {...register('price')} className="w-full px-4 py-3 glass rounded-xl text-white placeholder-text-secondary outline-none focus:border-accent/50 transition-colors border border-white/10" />
                      {errors.price && <p className="text-error text-xs mt-1">{errors.price.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Stock</label>
                      <input type="number" {...register('stock')} className="w-full px-4 py-3 glass rounded-xl text-white placeholder-text-secondary outline-none focus:border-accent/50 transition-colors border border-white/10" />
                      {errors.stock && <p className="text-error text-xs mt-1">{errors.stock.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      {...register('category')}
                      className="w-full px-4 py-3 glass rounded-xl text-white bg-[rgba(255,255,255,0.05)] outline-none focus:border-accent/50 focus:bg-[rgba(255,255,255,0.08)] transition-colors border border-white/10"
                    >
                      <option value="" className="bg-[#0f172a] text-white">Select category</option>
                      {['Phones', 'Laptops', 'Gaming', 'Audio', 'Wearables', 'Accessories', 'Cameras', 'Smart Home'].map((cat) => (
                        <option key={cat} value={cat} className="bg-[#0f172a] text-white">{cat}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-error text-xs mt-1">{errors.category.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Image</label>
                    <input type="file" accept="image/*" className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-white/10 file:text-white hover:file:bg-white/20 transition-colors" />
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all">
                    {editing ? 'Update Product' : 'Create Product'}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
