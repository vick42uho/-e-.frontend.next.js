"use client";

import { Config } from "@/app/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ProductInterface } from "@/app/interface/ProductInterface";
import Image from "next/image";


// กำหนดหมวดหมู่สินค้า
const categories = [
  { label: 'เครื่องใช้ไฟฟ้า', value: 'เครื่องใช้ไฟฟ้า' },
  { label: 'เครื่องดื่ม', value: 'เครื่องดื่ม' },
  { label: 'อาหาร', value: 'อาหาร' },
  { label: 'อุปกรณ์เสริมอิเล็กทรอนิกส์', value: 'อุปกรณ์เสริมอิเล็กทรอนิกส์' },
  { label: 'สุขภาพและความงาม', value: 'สุขภาพและความงาม' },
  { label: 'แฟชั่น', value: 'แฟชั่น' }
];

// กำหนด schema ด้านนอกคอมโพเนนต์
const createProductSchema = z.object({
  name: z.string().min(3, "ชื่อต้องมีอย่างน้อย 3 ตัวอักษร"),
  price: z.string().min(1, "กรุณาระบุราคา"),
  isbn: z.string().min(3, "ISBN ต้องมีอย่างน้อย 3 ตัวอักษร"),
  description: z.string().min(3, "คำอธิบายต้องมีอย่างน้อย 3 ตัวอักษร"),
  category: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
});

// Schema สำหรับการแก้ไข
const updateProductSchema = z.object({
  name: z.string().min(3, "ชื่อต้องมีอย่างน้อย 3 ตัวอักษร"),
  price: z.string().min(1, "กรุณาระบุราคา"),
  isbn: z.string().min(3, "ISBN ต้องมีอย่างน้อย 3 ตัวอักษร"),
  description: z.string().min(3, "คำอธิบายต้องมีอย่างน้อย 3 ตัวอักษร"),
  category: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
})

// เราจะใช้ schema แยกกันตามสถานะการแก้ไข

type CreateProductValues = z.infer<typeof createProductSchema>;
type UpdateProductValues = z.infer<typeof updateProductSchema>;
type ProductFormValues = CreateProductValues | UpdateProductValues;




export default function ProductPage() {
  const [productList, setProductList] = useState<ProductInterface[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [currentProductImage, setCurrentProductImage] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductInterface | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // ใช้ useForm กับ zod resolver
  const form = useForm<CreateProductValues | UpdateProductValues>({
    resolver: zodResolver(editingId ? updateProductSchema : createProductSchema),
    defaultValues: {
      name: '',
      price: '',
      isbn: '',
      description: '',
      category: ''
    }
  });

  
  const fetchData = async () => {
    try {
      const response = await axios.get(`${Config.apiURL}/api/product/list`);
      if (response.status === 200) {
        setProductList(response.data);
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด", {
        duration: 9000,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



const handleSave = async (formData: CreateProductValues | UpdateProductValues) => {
  try {
    if (!image && !editingId) {
      toast.error("กรุณาเลือกรูปภาพ", { duration: 9000 });
      return;
    }

    const data = new FormData();
    if (image) {
      data.append("image", image);
    }
    data.append("isbn", formData.isbn);
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("category", formData.category);

    if (editingId) {
      data.append("id", editingId);
    }
    
    const url = editingId 
      ? `${Config.apiURL}/api/product/update/${editingId}`
      : `${Config.apiURL}/api/product/create`;
    
    const response = editingId
      ? await axios.put(url, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      : await axios.post(url, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

    if (response.status === 200) {
      toast.success(editingId ? "อัปเดตสำเร็จ" : "บันทึกสำเร็จ", { duration: 9000 });
      fetchData();
      setShowModal(false);
      form.reset();
      setEditingId(null);
    }
  } catch (error) {
    console.error('Error saving admin:', error);
    toast.error("เกิดข้อผิดพลาด", { duration: 9000 });
  }
};

const handleEdit = (product: ProductInterface) => {
  setShowModal(true);
  setEditingId(product.id);
  setCurrentProductImage(product.image || "");
  form.reset({
    name: product.name,
    price: product.price.toString(),
    isbn: product.isbn,
    description: product.description,
    category: product.category
  });
}


const confirmDelete = (product: ProductInterface) => {
  setProductToDelete(product)
  setShowDeleteDialog(true)
}

const handleDelete = async () => {
  if (!productToDelete) return
  
  try {
    const response = await axios.delete(`${Config.apiURL}/api/product/remove/${productToDelete.id}`)
    if (response.status === 200) {
      toast.success("ลบสำเร็จ", {
        duration: 9000,
      })
      fetchData()
      setShowDeleteDialog(false)
      setProductToDelete(null)
    }
  } catch (error) {
    toast.error("เกิดข้อผิดพลาด", {
      duration: 9000,
    });
  }
}

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    const file = files[0];
    setImage(file);
  }
}

  return (
    <div className="h-full w-full flex flex-col px-5">
      <Toaster position="top-right" richColors />
      <div className="px-2 mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">สินค้า</h1>
        <Dialog open={showModal} onOpenChange={(open) => {
          if (!open) {
            form.reset();
            setEditingId(null);
          }
          setShowModal(open);
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              form.reset({
                name: '',
                price: '',
                isbn: '',
                description: '',
                category: '',
              });
              setEditingId(null);
            }}>เพิ่มสินค้า</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'}
              </DialogTitle>
              <DialogDescription>
                {editingId ? 'แก้ไขรายละเอียดผู้ใช้งาน' : 'กรุณากรอกรายละเอียดเพื่อเพิ่มผู้ใช้งาน'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4 py-4">
              {/* isbn */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isbn" className="text-right">
                  isbn
                </Label>
                <div className="col-span-3 space-y-1">
                  <Input
                    id="isbn"
                    {...form.register("isbn")}
                  />
                  {form.formState.errors.isbn && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.isbn.message}
                    </p>
                  )}
                </div>
              </div>
              
              {/* ชื่อ */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  ชื่อ
                </Label>
                <div className="col-span-3 space-y-1">
                  <Input
                    id="name"
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
              </div>
              
              {/* ราคา */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  ราคา
                </Label>
                <div className="col-span-3 space-y-1">
                  <Input
                    id="price"
                    type="number"
                    {...form.register("price")}
                  />
                  {form.formState.errors.price && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.price.message}
                    </p>
                  )}
                </div>
              </div>
              
              {/* รายละเอียด */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  รายละเอียด
                </Label>
                <div className="col-span-3 space-y-1">
                  <Input
                    type="text"
                    id="description"
                    {...form.register("description")}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>
              </div>

              {/* หมวดหมู่ */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  หมวดหมู่
                </Label>
                <div className="col-span-3 space-y-1">
                  <Controller
                    name="category"
                    control={form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกหมวดหมู่" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.category && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.category.message}
                    </p>
                  )}
                </div>
              </div>
              
              {/* รูปภาพ */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  รูปภาพ
                </Label>
                <div className="col-span-3 space-y-1">
                  {editingId && currentProductImage && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-500 mb-1">รูปภาพปัจจุบัน:</p>
                      <div className="relative w-[100px] h-[100px] rounded-md overflow-hidden">
                        <img
                          src={`${Config.apiURL}/uploads/${currentProductImage}`}
                          alt="รูปภาพสินค้า"
                          className="object-cover w-full h-full rounded-md"
                          onError={(e) => {
                            // ถ้าโหลดรูปไม่สำเร็จให้แสดงไอคอนแทน
                            (e.target as HTMLImageElement).style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-md"><span className="text-gray-400 text-2xl">🖼️</span></div>';
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <Input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {editingId && (
                    <p className="text-sm text-gray-500 mt-1">
                      {image ? 'เลือกรูปใหม่แล้ว' : 'ไม่ต้องเลือกรูปหากไม่ต้องการเปลี่ยน'}
                    </p>
                  )}
                </div>
              </div>
              

              
              <DialogFooter>
                <Button type="submit">
                  {editingId ? 'อัปเดต' : 'บันทึก'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 w-full overflow-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>รูปภาพ</TableHead>
              <TableHead>isbn</TableHead>
              <TableHead>ชื่อ</TableHead>
              <TableHead>ราคา</TableHead>
              <TableHead>หมวดหมู่</TableHead>
              <TableHead>รายละเอียด</TableHead>
              <TableHead className="text-center">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productList.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                    {product.image != null ? (
                        <div className="relative w-[50px] h-[50px] rounded-md overflow-hidden">
                          <img 
                            src={`${Config.apiURL}/uploads/${product.image}`} 
                            alt={product.name} 
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              // ถ้าโหลดรูปไม่สำเร็จให้แสดงไอคอนแทน
                              (e.target as HTMLImageElement).style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = '<div className="flex items-center justify-center w-full h-full bg-gray-100"><span className="text-gray-400">🖼️</span></div>';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-[50px] h-[50px] bg-gray-100 rounded-md">
                          <span className="text-gray-400">🖼️</span>
                        </div>
                      )
                    }
                </TableCell>
                <TableCell>{product.isbn}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell className="flex gap-1 justify-center">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => confirmDelete(product)}
                  >
                    ลบ
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => handleEdit(product)}
                  >
                    แก้ไข
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog ยืนยันการลบ */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ยืนยันการลบ</DialogTitle>
            <DialogDescription>
              คุณต้องการลบสินค้า {productToDelete?.name} ใช่หรือไม่?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="outline">ยกเลิก</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>ยืนยันการลบ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
